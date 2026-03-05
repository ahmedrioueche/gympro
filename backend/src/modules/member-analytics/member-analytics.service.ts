import {
  ApiResponse,
  ErrorCode,
  MemberDashboardStats,
} from '@ahmedrioueche/gympro-client';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { GymMembershipModel } from '../gym-membership/membership.schema';
import { SubscriptionHistoryModel } from '../gym-subscription/gymSubscription.schema';
import { SessionDocument } from '../sessions/schemas/session.schema';

@Injectable()
export class MemberAnalyticsService {
  private readonly logger = new Logger(MemberAnalyticsService.name);

  constructor(
    @InjectModel('SubscriptionHistory')
    private historyModel: Model<SubscriptionHistoryModel>,
    @InjectModel('Session') private sessionModel: Model<SessionDocument>,
    @InjectModel('GymMembership')
    private membershipModel: Model<GymMembershipModel>,
  ) {}

  async getDashboardStats(
    memberId: string,
  ): Promise<ApiResponse<MemberDashboardStats>> {
    try {
      const memberObjectId = new Types.ObjectId(memberId);

      // 1. Check active subscriptions
      const activeSubscriptions = await this.membershipModel.countDocuments({
        user: memberObjectId,
        membershipStatus: 'active',
      });

      // 2. Check-ins (Past completed sessions)
      const checkIns = await this.sessionModel.countDocuments({
        'attendees.userId': memberObjectId,
        status: 'completed',
        startTime: { $lte: new Date() },
      });

      // 3. Next Class
      const nextSession = await this.sessionModel
        .findOne({
          'attendees.userId': memberObjectId,
          startTime: { $gt: new Date() },
          status: { $in: ['scheduled', 'confirmed'] },
        })
        .sort({ startTime: 1 })
        .lean();

      // 4. Days Streak (Consecutive days with at least one completed session)
      // This is complex aggregation. Simplified: Just count sessions this week?
      // Or calculate real streak.
      // Let's implement a simple "Current Streak" calculation.
      const streak = await this.calculateStreak(memberObjectId);

      return {
        success: true,
        data: {
          activeSubscriptions,
          checkIns,
          nextClass: nextSession,
          daysStreak: streak,
        },
      };
    } catch (error) {
      this.logger.error(
        `Error getting member stats: ${error.message}`,
        error.stack,
      );
      return {
        success: false,
        errorCode: ErrorCode.UNKNOWN_ERROR,
        message: 'Failed to fetch member stats',
      };
    }
  }

  private async calculateStreak(memberId: Types.ObjectId): Promise<number> {
    // Get distinct dates of completed sessions, sorted desc
    const sessions = await this.sessionModel.aggregate([
      {
        $match: {
          'attendees.userId': memberId,
          status: 'completed',
        },
      },
      {
        $project: {
          date: {
            $dateToString: { format: '%Y-%m-%d', date: '$startTime' },
          },
        },
      },
      {
        $group: {
          _id: '$date',
        },
      },
      { $sort: { _id: -1 } },
    ]);

    let streak = 0;
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000)
      .toISOString()
      .split('T')[0];

    // If no sessions, streak is 0
    if (sessions.length === 0) return 0;

    // Check if the most recent session was today or yesterday to start the streak
    const lastSessionDate = sessions[0]._id;
    if (lastSessionDate !== today && lastSessionDate !== yesterday) {
      return 0;
    }

    // Iterate to count consecutive days
    // Convert current date to compare
    let currentDate = new Date(lastSessionDate);

    for (const session of sessions) {
      const sessionDate = new Date(session._id);

      // Calculate difference in days
      const diffTime = Math.abs(currentDate.getTime() - sessionDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays <= 1) {
        // 0 or 1 day difference (consecutive)
        streak++;
        currentDate = sessionDate;
      } else {
        break;
      }
    }

    return streak;
  }
}
