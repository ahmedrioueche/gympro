import {
  ApiResponse,
  ErrorCode,
  GymCoachAffiliation as GymCoachAffiliationType,
  InviteCoachDto,
  RequestGymAffiliationDto,
} from '@ahmedrioueche/gympro-client';
import {
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from '../../common/schemas/user.schema';
import { GymModel } from '../gym/gym.schema';
import { GymMembershipModel } from '../gymMembership/membership.schema';
import { NotificationsService } from '../notifications/notifications.service';
import { SessionModel } from '../sessions/schemas/session.schema';
import { SessionsService } from '../sessions/sessions.service';
import {
  AffiliationStatus,
  GymCoachAffiliation,
  GymCoachAffiliationDocument,
} from './schemas/gym-coach-affiliation.schema';

@Injectable()
export class GymCoachService {
  private readonly logger = new Logger(GymCoachService.name);

  constructor(
    @InjectModel(GymCoachAffiliation.name)
    private affiliationModel: Model<GymCoachAffiliationDocument>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(GymModel.name) private gymModel: Model<GymModel>,
    @InjectModel('GymMembership')
    private membershipModel: Model<GymMembershipModel>,
    @InjectModel(SessionModel.name) private sessionModel: Model<SessionModel>,
    private notificationsService: NotificationsService,
    @Inject(forwardRef(() => SessionsService))
    private sessionsService: SessionsService,
  ) {}

  /**
   * Get all coaches affiliated with a gym
   */
  async getGymCoaches(
    gymId: string,
  ): Promise<ApiResponse<GymCoachAffiliationType[]>> {
    try {
      const affiliations = await this.affiliationModel
        .find({ gymId: new Types.ObjectId(gymId) })
        .populate(
          'coachId',
          'profile.fullName profile.username profile.profileImageUrl coachingInfo',
        )
        .lean();

      return {
        success: true,
        data: affiliations as any,
      };
    } catch (error) {
      this.logger.error('Error fetching gym coaches:', error);
      return {
        success: false,
        errorCode: ErrorCode.COACH_FETCH_ERROR,
        message: 'Failed to fetch gym coaches',
      };
    }
  }

  /**
   * Get all gyms a coach is affiliated with
   */
  async getCoachAffiliations(
    coachId: string,
  ): Promise<ApiResponse<GymCoachAffiliationType[]>> {
    try {
      const affiliations = await this.affiliationModel
        .find({ coachId: new Types.ObjectId(coachId) })
        .populate('gymId')
        .lean();

      return {
        success: true,
        data: affiliations as any,
      };
    } catch (error) {
      this.logger.error('Error fetching coach affiliations:', error);
      return {
        success: false,
        errorCode: ErrorCode.COACH_REQUEST_FETCH_ERROR,
        message: 'Failed to fetch coach affiliations',
      };
    }
  }

  /**
   * Invite a coach to a gym
   */
  async inviteCoach(
    gymId: string,
    coachId: string,
    inviterId: string,
    data: InviteCoachDto,
  ): Promise<ApiResponse<GymCoachAffiliationType>> {
    try {
      const coach = await this.userModel.findById(coachId);
      if (!coach || coach.role !== 'coach') {
        throw new NotFoundException('Coach not found');
      }

      const existingAffiliation = await this.affiliationModel.findOne({
        gymId: new Types.ObjectId(gymId),
        coachId: new Types.ObjectId(coachId),
      });

      if (existingAffiliation) {
        return {
          success: false,
          errorCode: ErrorCode.AFFILIATION_ALREADY_EXISTS,
          message: 'Affiliation already exists',
        };
      }

      const affiliation = await this.affiliationModel.create({
        gymId: new Types.ObjectId(gymId),
        coachId: new Types.ObjectId(coachId),
        initiatedBy: 'gym',
        status: AffiliationStatus.PENDING,
        isExclusive: data.isExclusive,
        commissionRate: data.commissionRate,
        message: data.message,
      });

      // Notify coach
      const gym = await this.gymModel.findById(gymId);
      await this.notificationsService.notifyUser(coach, {
        key: 'coach.invitation',
        vars: {
          gymName: gym?.name || 'A Gym',
          message: data.message || '',
        },
        type: 'alert',
        priority: 'high',
        relatedId: (affiliation as any)._id.toString(),
        action: {
          type: 'link',
          payload: '/coach/affiliations',
        },
      });

      return {
        success: true,
        data: affiliation.toObject() as any,
      };
    } catch (error) {
      this.logger.error('Error inviting coach:', error);
      return {
        success: false,
        errorCode: ErrorCode.UNKNOWN_ERROR,
        message: 'Failed to invite coach',
      };
    }
  }

  /**
   * Coach requests to join a gym
   */
  async requestGymAffiliation(
    gymId: string,
    coachId: string,
    data: RequestGymAffiliationDto,
  ): Promise<ApiResponse<GymCoachAffiliationType>> {
    try {
      const existingAffiliation = await this.affiliationModel.findOne({
        gymId: new Types.ObjectId(gymId),
        coachId: new Types.ObjectId(coachId),
      });

      if (existingAffiliation) {
        return {
          success: false,
          errorCode: ErrorCode.AFFILIATION_ALREADY_EXISTS,
          message: 'Affiliation already exists',
        };
      }

      const affiliation = await this.affiliationModel.create({
        gymId: new Types.ObjectId(gymId),
        coachId: new Types.ObjectId(coachId),
        initiatedBy: 'coach',
        status: AffiliationStatus.PENDING,
        message: data.message,
      });

      // Notify gym owner
      const coach = await this.userModel.findById(coachId);
      const gym = await this.gymModel.findById(gymId).populate('owner');
      if (gym?.owner) {
        await this.notificationsService.notifyUser(gym.owner as any, {
          key: 'gym.coach_request',
          vars: {
            coachName:
              coach?.profile?.fullName || coach?.profile?.username || 'A coach',
            message: data.message || '',
          },
          type: 'alert',
          priority: 'high',
          relatedId: (affiliation as any)._id.toString(),
          action: {
            type: 'link',
            payload: `/manager/gyms/${gymId}/settings?tab=coaches`,
          },
        });
      }

      return {
        success: true,
        data: affiliation.toObject() as any,
      };
    } catch (error) {
      this.logger.error('Error requesting gym affiliation:', error);
      return {
        success: false,
        errorCode: ErrorCode.UNKNOWN_ERROR,
        message: 'Failed to request gym affiliation',
      };
    }
  }

  /**
   * Respond to affiliation request
   */
  async respondToAffiliation(
    affiliationId: string,
    responderId: string,
    accept: boolean,
    message?: string,
  ): Promise<ApiResponse<GymCoachAffiliationType>> {
    try {
      const affiliation = await this.affiliationModel.findById(affiliationId);
      if (!affiliation) {
        throw new NotFoundException('Affiliation not found');
      }

      affiliation.status = accept
        ? AffiliationStatus.ACTIVE
        : AffiliationStatus.DECLINED;
      if (message) affiliation.message = message;
      if (accept) affiliation.startDate = new Date();

      await affiliation.save();

      // Notify the other party
      const gym = await this.gymModel.findById(affiliation.gymId);
      if (!gym) throw new NotFoundException('Gym not found');

      const notifyTo =
        affiliation.initiatedBy === 'gym'
          ? affiliation.coachId
          : (gym.owner as any);
      const userToNotify = await this.userModel.findById(notifyTo);

      if (userToNotify) {
        await this.notificationsService.notifyUser(userToNotify, {
          key: accept ? 'affiliation.accepted' : 'affiliation.declined',
          vars: {
            message: message || '',
          },
          type: 'alert',
          priority: 'medium',
        });
      }

      return {
        success: true,
        data: affiliation.toObject() as any,
      };
    } catch (error) {
      this.logger.error('Error responding to affiliation:', error);
      return {
        success: false,
        errorCode: ErrorCode.UNKNOWN_ERROR,
        message: 'Failed to respond to affiliation',
      };
    }
  }

  /**
   * Terminate affiliation
   */
  async terminateAffiliation(
    affiliationId: string,
    userId: string,
  ): Promise<ApiResponse<void>> {
    try {
      const affiliation = await this.affiliationModel.findById(affiliationId);
      if (!affiliation) {
        throw new NotFoundException('Affiliation not found');
      }

      affiliation.status = AffiliationStatus.TERMINATED;
      affiliation.endDate = new Date();
      await affiliation.save();

      return { success: true };
    } catch (error) {
      this.logger.error('Error terminating affiliation:', error);
      return {
        success: false,
        errorCode: ErrorCode.UNKNOWN_ERROR,
        message: 'Failed to terminate affiliation',
      };
    }
  }

  /**
   * Find a specific affiliation
   */
  async findAffiliation(gymId: string, coachId: string) {
    return this.affiliationModel.findOne({
      gymId: new Types.ObjectId(gymId),
      coachId: new Types.ObjectId(coachId),
      status: AffiliationStatus.ACTIVE,
    });
  }

  /**
   * Validate if a facility belongs to a gym
   */
  async validateFacility(gymId: string, facilityId: string): Promise<boolean> {
    const gym = await this.gymModel.findOne({
      _id: new Types.ObjectId(gymId),
      'facilities._id': facilityId,
    });
    return !!gym;
  }

  /**
   * Analytics and other methods can be added here
   */
  async getGymCoachClients(
    gymId: string,
    coachId: string,
  ): Promise<ApiResponse<any[]>> {
    // Basic implementation
    return { success: true, data: [] };
  }

  async getGymMembersForCoach(
    gymId: string,
    coachId: string,
  ): Promise<ApiResponse<any[]>> {
    // Basic implementation
    return { success: true, data: [] };
  }

  async getGymCoachAnalytics(
    gymId: string,
    coachId: string,
  ): Promise<ApiResponse<any>> {
    // Basic implementation
    return { success: true, data: {} };
  }
}
