import {
  ApiResponse,
  CoachProfile,
  CoachQueryDto,
  CoachRequest as CoachRequestType,
  ErrorCode,
  RequestCoachDto,
} from '@ahmedrioueche/gympro-client';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from '../common/schemas/user.schema';
import { NotificationsService } from '../modules/notifications/notifications.service';
import { CoachRequestModel } from './schemas/coach-request.schema';

@Injectable()
export class CoachService {
  constructor(
    @InjectModel('CoachRequest')
    private coachRequestModel: Model<CoachRequestModel>,
    @InjectModel(User.name) private userModel: Model<User>,
    private notificationsService: NotificationsService,
  ) {}

  /**
   * Get nearby coaches based on location
   */
  async getNearbyCoaches(
    userId: string,
    query?: CoachQueryDto,
  ): Promise<ApiResponse<CoachProfile[]>> {
    try {
      // Get user's location for reference
      const user = await this.userModel.findById(userId);
      const userLocation = {
        city: query?.city || user?.profile?.city,
        state: query?.state || user?.profile?.state,
        country: query?.country || user?.profile?.country,
      };

      // Build query for coaches
      const matchQuery: any = {
        role: 'coach',
        'profile.isOnBoarded': true,
      };

      // Location-based filtering
      if (userLocation.city) {
        matchQuery['profile.city'] = new RegExp(userLocation.city, 'i');
      }
      if (userLocation.state) {
        matchQuery['profile.state'] = new RegExp(userLocation.state, 'i');
      }
      if (userLocation.country) {
        matchQuery['profile.country'] = new RegExp(userLocation.country, 'i');
      }

      // Specialization filter
      if (query?.specialization) {
        matchQuery['coachingInfo.specializations'] = query.specialization;
      }

      const limit = query?.limit || 20;
      const offset = query?.offset || 0;

      const coaches = await this.userModel
        .find(matchQuery)
        .skip(offset)
        .limit(limit)
        .lean();

      const coachProfiles: CoachProfile[] = coaches.map((coach: any) => ({
        userId: coach._id.toString(),
        username: coach.profile.username,
        fullName: coach.profile.fullName,
        profileImageUrl: coach.profile.profileImageUrl,
        bio: coach.coachingInfo?.bio,
        specializations: coach.coachingInfo?.specializations,
        yearsOfExperience: coach.coachingInfo?.yearsOfExperience,
        location: {
          city: coach.profile.city,
          state: coach.profile.state,
          country: coach.profile.country,
        },
        certifications: coach.certifications,
        rating: coach.coachingInfo?.rating,
        totalClients: coach.coachingInfo?.coachedMembers?.length || 0,
        isVerified: coach.coachVerification?.status === 'approved',
      }));

      return {
        success: true,
        data: coachProfiles,
      };
    } catch (error) {
      console.error('Error fetching coaches:', error);
      return {
        success: false,
        errorCode: ErrorCode.COACH_FETCH_ERROR,
        message: 'Failed to fetch coaches',
      };
    }
  }

  /**
   * Request a coach's services
   */
  async requestCoach(
    memberId: string,
    coachId: string,
    data: RequestCoachDto,
  ): Promise<ApiResponse<CoachRequestType>> {
    try {
      // Verify coach exists and is actually a coach
      const coach = await this.userModel.findById(coachId);
      if (!coach || coach.role !== 'coach') {
        throw new NotFoundException('Coach not found');
      }

      // Check if request already exists
      const existingRequest = await this.coachRequestModel.findOne({
        memberId: new Types.ObjectId(memberId),
        coachId: new Types.ObjectId(coachId),
        status: 'pending',
      });

      if (existingRequest) {
        return {
          success: false,
          errorCode: ErrorCode.COACH_REQUEST_FAILED,
          message: 'You already have a pending request with this coach',
        };
      }

      // Create new request
      const request = await this.coachRequestModel.create({
        memberId: new Types.ObjectId(memberId),
        coachId: new Types.ObjectId(coachId),
        message: data.message,
        status: 'pending',
      });

      // Get member info for notifications
      const member = await this.userModel.findById(memberId);

      // Send in-app notification to coach
      await this.notificationsService.notifyUser(coach, {
        title: 'New Coaching Request',
        message: `${member?.profile?.fullName || member?.profile?.username} has requested your coaching services`,
        type: 'alert',
        priority: 'high',
        relatedId: request?._id?.toString(),
        skipExternal: false,
      });

      // Convert to plain object to access timestamps
      const requestObj = request.toObject();

      const response: CoachRequestType = {
        _id: request?._id?.toString() || '',
        memberId: request.memberId.toString(),
        coachId: request.coachId.toString(),
        message: request.message,
        status: request.status,
        createdAt: requestObj.createdAt,
        updatedAt: requestObj.updatedAt,
      };

      return {
        success: true,
        data: response,
      };
    } catch (error) {
      console.error('Error requesting coach:', error);
      return {
        success: false,
        errorCode: ErrorCode.COACH_REQUEST_FAILED,
        message: error.message || 'Failed to send coach request',
      };
    }
  }

  /**
   * Get my coach requests (as a member)
   */
  async getMyCoachRequests(
    memberId: string,
  ): Promise<ApiResponse<CoachRequestType[]>> {
    try {
      const requests = await this.coachRequestModel
        .find({ memberId: new Types.ObjectId(memberId) })
        .sort({ createdAt: -1 })
        .lean();

      const formattedRequests: CoachRequestType[] = requests.map(
        (req: any) => ({
          _id: req._id.toString(),
          memberId: req.memberId.toString(),
          coachId: req.coachId.toString(),
          message: req.message,
          status: req.status,
          respondedAt: req.respondedAt,
          response: req.response,
          createdAt: req.createdAt,
          updatedAt: req.updatedAt,
        }),
      );

      return {
        success: true,
        data: formattedRequests,
      };
    } catch (error) {
      console.error('Error fetching coach requests:', error);
      return {
        success: false,
        errorCode: ErrorCode.COACH_REQUEST_FETCH_ERROR,
        message: 'Failed to fetch coach requests',
      };
    }
  }
}
