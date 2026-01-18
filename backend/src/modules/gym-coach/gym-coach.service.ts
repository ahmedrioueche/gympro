import {
  ApiResponse,
  ErrorCode,
  GymCoachAffiliation as GymCoachAffiliationType,
} from '@ahmedrioueche/gympro-client';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from '../../common/schemas/user.schema';
import { GymModel as Gym } from '../gym/gym.schema';
import { NotificationsService } from '../notifications/notifications.service';
import {
  AffiliationStatus,
  GymCoachAffiliation,
  GymCoachAffiliationDocument,
} from './schemas/gym-coach-affiliation.schema';

@Injectable()
export class GymCoachService {
  constructor(
    @InjectModel(GymCoachAffiliation.name)
    private affiliationModel: Model<GymCoachAffiliationDocument>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Gym.name) private gymModel: Model<Gym>,
    private notificationsService: NotificationsService,
  ) {}

  /**
   * Get all coaches affiliated with a gym
   */
  async getGymCoaches(
    gymId: string,
  ): Promise<ApiResponse<GymCoachAffiliationType[]>> {
    try {
      const affiliations = await this.affiliationModel
        .find({
          gymId: new Types.ObjectId(gymId),
          status: {
            $in: [AffiliationStatus.ACTIVE, AffiliationStatus.PENDING],
          },
        })
        .populate('coachId', 'profile coachingInfo')
        .lean();

      const mapped = affiliations.map((a: any) => ({
        _id: a._id.toString(),
        gymId: a.gymId.toString(),
        coachId: a.coachId._id?.toString() || a.coachId.toString(),
        status: a.status,
        initiatedBy: a.initiatedBy,
        startDate: a.startDate,
        endDate: a.endDate,
        permissions: a.permissions,
        isExclusive: a.isExclusive,
        commissionRate: a.commissionRate,
        createdAt: a.createdAt,
        updatedAt: a.updatedAt,
        coach: a.coachId._id
          ? {
              _id: a.coachId._id.toString(),
              fullName: a.coachId.profile?.fullName,
              username: a.coachId.profile?.username,
              profileImageUrl: a.coachId.profile?.profileImageUrl,
              specializations: a.coachId.coachingInfo?.specializations,
            }
          : undefined,
      }));

      return { success: true, data: mapped };
    } catch (error) {
      console.error('Error fetching gym coaches:', error);
      return {
        success: false,
        errorCode: ErrorCode.AFFILIATION_FETCH_ERROR,
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
      console.log('Fetching affiliations for coachId:', coachId);

      const affiliations = await this.affiliationModel
        .find({
          coachId: new Types.ObjectId(coachId),
          status: {
            $in: [AffiliationStatus.ACTIVE, AffiliationStatus.PENDING],
          },
        })
        .populate('gymId', 'name slug logo location')
        .lean();

      console.log('Found affiliations:', JSON.stringify(affiliations, null, 2));

      const mapped = affiliations.map((a: any) => ({
        _id: a._id.toString(),
        gymId: a.gymId._id?.toString() || a.gymId.toString(),
        coachId: a.coachId.toString(),
        status: a.status,
        initiatedBy: a.initiatedBy,
        startDate: a.startDate,
        endDate: a.endDate,
        permissions: a.permissions,
        isExclusive: a.isExclusive,
        commissionRate: a.commissionRate,
        createdAt: a.createdAt,
        updatedAt: a.updatedAt,
        gym: a.gymId._id
          ? {
              _id: a.gymId._id.toString(),
              name: a.gymId.name,
              slug: a.gymId.slug,
              logo: a.gymId.logo,
              location: a.gymId.location,
            }
          : undefined,
      }));

      return { success: true, data: mapped };
    } catch (error) {
      console.error('Error fetching coach affiliations:', error);
      return {
        success: false,
        errorCode: ErrorCode.AFFILIATION_FETCH_ERROR,
        message: 'Failed to fetch coach affiliations',
      };
    }
  }

  /**
   * Gym invites a coach
   */
  async inviteCoach(
    gymId: string,
    coachId: string,
    inviterId: string,
    data: {
      message?: string;
      permissions?: {
        canScheduleSessions?: boolean;
        canAccessFacilities?: boolean;
      };
      isExclusive?: boolean;
      commissionRate?: number;
    },
  ): Promise<ApiResponse<GymCoachAffiliationType>> {
    try {
      // Check if an active or pending affiliation already exists
      const existing = await this.affiliationModel.findOne({
        gymId: new Types.ObjectId(gymId),
        coachId: new Types.ObjectId(coachId),
        status: { $in: [AffiliationStatus.ACTIVE, AffiliationStatus.PENDING] },
      });

      if (existing) {
        return {
          success: false,
          errorCode: ErrorCode.AFFILIATION_ALREADY_EXISTS,
          message: 'Affiliation already exists',
        };
      }

      // Delete any old terminated/declined affiliations to allow fresh re-invite
      await this.affiliationModel.deleteMany({
        gymId: new Types.ObjectId(gymId),
        coachId: new Types.ObjectId(coachId),
        status: {
          $in: [AffiliationStatus.TERMINATED, AffiliationStatus.DECLINED],
        },
      });

      const affiliation = await this.affiliationModel.create({
        gymId: new Types.ObjectId(gymId),
        coachId: new Types.ObjectId(coachId),
        status: AffiliationStatus.PENDING,
        initiatedBy: 'gym',
        permissions: data.permissions || {
          canScheduleSessions: true,
          canAccessFacilities: true,
        },
        isExclusive: data.isExclusive || false,
        commissionRate: data.commissionRate,
        message: data.message,
      });

      // Notify coach
      const gym = await this.gymModel.findById(gymId);
      await this.notificationsService.notifyUser({ _id: coachId } as any, {
        title: 'Gym Invitation',
        message: `${gym?.name} has invited you to join as a coach`,
        type: 'alert',
        priority: 'high',
        relatedId: affiliation?._id?.toString(),
        skipExternal: true,
      });

      return {
        success: true,
        data: {
          _id: affiliation?._id?.toString() || '',
          gymId: affiliation?.gymId?.toString(),
          coachId: affiliation?.coachId?.toString(),
          status: affiliation?.status,
          initiatedBy: affiliation?.initiatedBy,
          startDate: affiliation?.startDate,
          permissions: affiliation.permissions,
          isExclusive: affiliation.isExclusive,
          commissionRate: affiliation.commissionRate,
          createdAt: (affiliation as any).createdAt,
          updatedAt: (affiliation as any).updatedAt,
        },
      };
    } catch (error) {
      console.error('Error inviting coach:', error);
      return {
        success: false,
        errorCode: ErrorCode.AFFILIATION_CREATE_ERROR,
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
    data?: { message?: string },
  ): Promise<ApiResponse<GymCoachAffiliationType>> {
    try {
      const existing = await this.affiliationModel.findOne({
        gymId: new Types.ObjectId(gymId),
        coachId: new Types.ObjectId(coachId),
      });

      if (existing) {
        return {
          success: false,
          errorCode: ErrorCode.AFFILIATION_ALREADY_EXISTS,
          message: 'Affiliation request already exists',
        };
      }

      const affiliation = await this.affiliationModel.create({
        gymId: new Types.ObjectId(gymId),
        coachId: new Types.ObjectId(coachId),
        status: AffiliationStatus.PENDING,
        initiatedBy: 'coach',
        message: data?.message,
      });

      // Notify gym owner
      const gym = await this.gymModel.findById(gymId);
      const coach = await this.userModel.findById(coachId);
      if (gym?.owner) {
        await this.notificationsService.notifyUser({ _id: gym.owner } as any, {
          title: 'Coach Request',
          message: `${coach?.profile?.fullName || coach?.profile?.username} wants to join ${gym.name} as a coach`,
          type: 'alert',
          priority: 'high',
          relatedId: affiliation?._id?.toString(),
          skipExternal: true,
        });
      }

      return {
        success: true,
        data: {
          _id: affiliation?._id?.toString() || '',
          gymId: affiliation.gymId.toString(),
          coachId: affiliation.coachId.toString(),
          status: affiliation.status,
          initiatedBy: affiliation.initiatedBy,
          startDate: affiliation.startDate,
          permissions: affiliation.permissions,
          isExclusive: affiliation.isExclusive,
          createdAt: (affiliation as any).createdAt,
          updatedAt: (affiliation as any).updatedAt,
        },
      };
    } catch (error) {
      console.error('Error requesting affiliation:', error);
      return {
        success: false,
        errorCode: ErrorCode.AFFILIATION_CREATE_ERROR,
        message: 'Failed to request affiliation',
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
        return {
          success: false,
          errorCode: ErrorCode.AFFILIATION_NOT_FOUND,
          message: 'Affiliation not found',
        };
      }

      if (affiliation.status !== AffiliationStatus.PENDING) {
        return {
          success: false,
          errorCode: ErrorCode.AFFILIATION_INVALID_ACTION,
          message: 'Affiliation is not pending',
        };
      }

      affiliation.status = accept
        ? AffiliationStatus.ACTIVE
        : AffiliationStatus.DECLINED;
      if (accept) {
        affiliation.startDate = new Date();
      }
      await affiliation.save();

      // Notify the other party
      const gym = await this.gymModel.findById(affiliation.gymId);
      const coach = await this.userModel.findById(affiliation.coachId);

      // Notify the party who initiated the request about the response
      // If gym invited coach -> notify gym owner about coach's response
      // If coach requested -> notify coach about gym's response
      if (affiliation.initiatedBy === 'gym') {
        // Coach is responding to gym's invite - notify gym owner
        if (gym?.owner) {
          const coachName =
            coach?.profile?.fullName || coach?.profile?.username || 'The coach';
          await this.notificationsService.notifyUser(
            { _id: gym.owner } as any,
            {
              title: accept ? 'Coach Accepted Invite' : 'Coach Declined Invite',
              message: accept
                ? `${coachName} has accepted your invitation to join ${gym?.name}`
                : `${coachName} has declined your invitation to join ${gym?.name}`,
              type: 'alert',
              priority: 'high',
              skipExternal: true,
            },
          );
        }
      } else {
        // Gym is responding to coach's request - notify coach
        await this.notificationsService.notifyUser(
          { _id: affiliation.coachId } as any,
          {
            title: accept ? 'Request Accepted' : 'Request Declined',
            message: accept
              ? `Your request to join ${gym?.name || 'the gym'} has been accepted`
              : `Your request to join ${gym?.name || 'the gym'} has been declined`,
            type: 'alert',
            priority: 'medium',
            skipExternal: true,
          },
        );
      }

      return {
        success: true,
        data: {
          _id: affiliation?._id?.toString() || '',
          gymId: affiliation.gymId.toString(),
          coachId: affiliation.coachId.toString(),
          status: affiliation.status,
          initiatedBy: affiliation.initiatedBy,
          startDate: affiliation.startDate,
          permissions: affiliation.permissions,
          isExclusive: affiliation.isExclusive,
          commissionRate: affiliation.commissionRate,
          createdAt: (affiliation as any).createdAt,
          updatedAt: (affiliation as any).updatedAt,
        },
      };
    } catch (error) {
      console.error('Error responding to affiliation:', error);
      return {
        success: false,
        errorCode: ErrorCode.AFFILIATION_UPDATE_ERROR,
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
        return {
          success: false,
          errorCode: ErrorCode.AFFILIATION_NOT_FOUND,
          message: 'Affiliation not found',
        };
      }

      affiliation.status = AffiliationStatus.TERMINATED;
      affiliation.endDate = new Date();
      await affiliation.save();

      return { success: true };
    } catch (error) {
      console.error('Error terminating affiliation:', error);
      return {
        success: false,
        errorCode: ErrorCode.AFFILIATION_DELETE_ERROR,
        message: 'Failed to terminate affiliation',
      };
    }
  }
}
