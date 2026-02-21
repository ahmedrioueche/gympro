import {
  ApiResponse,
  ErrorCode,
  GymCoachAffiliation as GymCoachAffiliationType,
  UserRole,
} from '@ahmedrioueche/gympro-client';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from '../../common/schemas/user.schema';
import {
  CoachRequest,
  CoachRequestModel,
} from '../coach/schemas/coach-request.schema';
import { GymModel as Gym } from '../gym/gym.schema';
import { GymMembershipModel } from '../gymMembership/membership.schema';
import { NotificationsService } from '../notifications/notifications.service';
import { SessionModel } from '../sessions/schemas/session.schema';
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
    @InjectModel('GymMembership')
    private membershipModel: Model<GymMembershipModel>,
    @InjectModel(CoachRequest.name)
    private coachRequestModel: Model<CoachRequestModel>,
    @InjectModel(SessionModel.name)
    private sessionModel: Model<SessionModel>,
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
        gymId: a.gymId?.toString(),
        coachId: a.coachId?._id?.toString() || a.coachId?.toString() || '',
        status: a.status,
        initiatedBy: a.initiatedBy,
        startDate: a.startDate,
        endDate: a.endDate,
        permissions: a.permissions,
        isExclusive: a.isExclusive,
        commissionRate: a.commissionRate,
        createdAt: a.createdAt,
        updatedAt: a.updatedAt,
        coach: a.coachId?._id
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
        gymId: a.gymId?._id?.toString() || a.gymId?.toString() || '',
        coachId: a.coachId?.toString() || '',
        status: a.status,
        initiatedBy: a.initiatedBy,
        startDate: a.startDate,
        endDate: a.endDate,
        permissions: a.permissions,
        isExclusive: a.isExclusive,
        commissionRate: a.commissionRate,
        createdAt: a.createdAt,
        updatedAt: a.updatedAt,
        gym: a.gymId?._id
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
        type: 'invitation',
        priority: 'high',
        relatedId: affiliation?._id?.toString(),
        skipExternal: true,
        gymId: gymId, // Pass gymId for feature check
        action: {
          type: 'modal',
          payload: 'gym_invitation',
          data: {
            invitationId: affiliation?._id?.toString(),
            gymName: gym?.name || 'Unknown Gym',
            gymId: gymId,
          },
        },
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
          gymId: gymId, // Pass gymId for feature check
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

        // Create or update membership with 'coach' role
        const existingMembership = await this.membershipModel.findOne({
          user: affiliation.coachId,
          gym: affiliation.gymId,
        });

        if (existingMembership) {
          // Add coach role if not already present
          if (!existingMembership.roles.includes('coach' as UserRole)) {
            existingMembership.roles.push('coach' as UserRole);
            await existingMembership.save();
          }
        } else {
          // Create new membership with coach role
          const newMembership = await this.membershipModel.create({
            user: affiliation.coachId,
            gym: affiliation.gymId,
            roles: ['coach' as UserRole],
            membershipStatus: 'active',
            joinedAt: new Date(),
            permissions: ['schedules:view', 'schedules:manage', 'members:view'],
          });

          // Add membership to user's memberships array
          await this.userModel.findByIdAndUpdate(affiliation.coachId, {
            $addToSet: { memberships: newMembership._id },
          });
        }

        // Add 'coaching' to gym services if not already present
        const gym = await this.gymModel.findById(affiliation.gymId);
        if (gym) {
          // Ensure settings exists
          if (!gym.settings) {
            (gym as any).settings = { servicesOffered: [] };
          }

          // Ensure servicesOffered is an array
          if (!gym.settings?.servicesOffered) {
            (gym.settings as any).servicesOffered = [];
          }

          const hasCoaching = gym.settings?.servicesOffered?.some((s) =>
            typeof s === 'string' ? s === 'coaching' : s.name === 'coaching',
          );

          if (!hasCoaching) {
            (gym.settings?.servicesOffered as any[]).push({
              _id: new Types.ObjectId().toString(),
              name: 'coaching',
              createdAt: new Date(),
            });
            gym.markModified('settings');
            await gym.save();
          }
        }
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
              gymId: gym._id.toString(), // Pass gymId for feature check
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
            gymId: gym?._id?.toString(), // Pass gymId for feature check
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
   * Get filtered clients for a gym context
   */
  async getGymCoachClients(
    gymId: string,
    coachId: string,
  ): Promise<ApiResponse<any[]>> {
    try {
      const coach = await this.userModel.findById(coachId);
      if (!coach || !coach.coachingInfo?.coachedMembers) {
        return { success: true, data: [] };
      }

      // 1. Get all members coached by this coach
      const memberIds = coach.coachingInfo.coachedMembers;

      // 2. Filter which of these members have an ACTIVE membership at this gym
      const validMemberships = await this.membershipModel.find({
        gym: new Types.ObjectId(gymId),
        user: { $in: memberIds },
        membershipStatus: 'active',
      });

      const validMemberIds = validMemberships.map((m) => m.user.toString());

      // 3. Fetch full profiles for these verified members
      const clients = await this.userModel
        .find({
          _id: { $in: validMemberIds },
        })
        .lean();

      // 4. Map to CoachClient format (reuse mapping logic if possible or inline)
      const clientProfiles = clients.map((client: any) => ({
        userId: client._id.toString(),
        username: client.profile.username,
        fullName: client.profile.fullName,
        profileImageUrl: client.profile.profileImageUrl,
        email: client.profile.email,
        age: client.profile.age,
        gender: client.profile.gender,
        location: {
          city: client.profile.city,
          state: client.profile.state,
          country: client.profile.country,
        },
        joinedAt: client.createdAt?.toISOString(),
        // Note: For full fidelity, we'd fetch program details here too,
        // but for now basic profile is sufficient for the list
      }));

      return {
        success: true,
        data: clientProfiles,
      };
    } catch (error) {
      console.error('Error fetching gym coach clients:', error);
      return {
        success: false,
        errorCode: ErrorCode.COACH_CLIENTS_FETCH_FAILED,
        message: 'Failed to fetch gym clients',
      };
    }
  }

  /**
   * Get active gym members who are not yet clients of this coach
   */
  async getGymMembersForCoach(
    gymId: string,
    coachId: string,
  ): Promise<ApiResponse<any[]>> {
    try {
      const coach = await this.userModel.findById(coachId);
      const coachedMemberIds = coach?.coachingInfo?.coachedMembers || [];

      // Get pending requests from this coach
      const pendingRequests = await this.coachRequestModel
        .find({
          coachId: new Types.ObjectId(coachId),
          status: 'pending',
        })
        .select('memberId');

      const pendingMemberIds = pendingRequests.map((r) => r.memberId);

      // Exclude existing clients AND pending requests
      const excludeIds = [...coachedMemberIds, ...pendingMemberIds];

      // 1. Find active memberships for this gym, excluding current clients and pending requests
      const potentialMemberships = await this.membershipModel.find({
        gym: new Types.ObjectId(gymId),
        user: { $nin: excludeIds }, // Exclude active and pending
        membershipStatus: 'active',
        roles: 'member', // Ensure they are members
      });

      const potentialMemberIds = potentialMemberships.map((m) =>
        m.user.toString(),
      );

      const membershipMap = new Map(
        potentialMemberships.map((m) => [m.user.toString(), m]),
      );

      // 2. Fetch profiles
      // Exclude the coach themselves if they happen to be a member
      const members = await this.userModel
        .find({
          _id: {
            $in: potentialMemberIds,
            $ne: new Types.ObjectId(coachId),
          },
        })
        .lean();

      // 3. Map to ProspectiveMember format
      const prospectiveMembers = members.map((member: any) => {
        const membership = membershipMap.get(member._id.toString());
        return {
          userId: member._id.toString(),
          username: member.profile.username,
          fullName: member.profile.fullName,
          profileImageUrl: member.profile.profileImageUrl,
          age: member.profile.age,
          gender: member.profile.gender,
          location: {
            city: member.profile.city,
            state: member.profile.state,
            country: member.profile.country,
          },
          hasCoach: !!member.coachingInfo?.coachId,
          gymMemberships: [], // Not needed for this specific view as we are in a gym context
          email: member.profile.email,
          phone: member.profile.phoneNumber,
          joinedAt: membership?.joinedAt || member.createdAt?.toISOString(),
        };
      });

      return {
        success: true,
        data: prospectiveMembers,
      };
    } catch (error) {
      console.error('Error fetching gym members for coach:', error);
      return {
        success: false,
        errorCode: ErrorCode.COACH_PROSPECTIVE_MEMBERS_FETCH_FAILED,
        message: 'Failed to fetch gym members',
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
  async findAffiliation(gymId: string, coachId: string) {
    return this.affiliationModel.findOne({
      gymId: new Types.ObjectId(gymId),
      coachId: new Types.ObjectId(coachId),
      status: AffiliationStatus.ACTIVE,
    });
  }

  /**
   * Get analytics for a coach within a specific gym context
   */
  async getGymCoachAnalytics(
    gymId: string,
    coachId: string,
  ): Promise<ApiResponse<any>> {
    try {
      const gymObjectId = new Types.ObjectId(gymId);
      const coachObjectId = new Types.ObjectId(coachId);

      // 1. active clients (from existing method)
      const clientsResponse = await this.getGymCoachClients(gymId, coachId);
      const activeClientsCount = clientsResponse.data?.length || 0;

      // 2. Fetch Sessions
      const sessions = await this.sessionModel
        .find({
          gymId: gymObjectId,
          coachId: coachObjectId,
        })
        .sort({ startTime: -1 })
        .lean();

      const totalSessions = sessions.length;
      const completedSessions = sessions.filter(
        (s) => s.status === 'completed',
      ).length;
      const completionRate =
        totalSessions > 0
          ? Math.round((completedSessions / totalSessions) * 100)
          : 0;

      // Calculate total hours (duration in hours)
      const totalHours = sessions.reduce((acc, session) => {
        if (session.status === 'completed') {
          const duration =
            (new Date(session.endTime).getTime() -
              new Date(session.startTime).getTime()) /
            (1000 * 60 * 60);
          return acc + duration;
        }
        return acc;
      }, 0);

      // 3. Trends (Last 6 months)
      const months = Array.from({ length: 6 }, (_, i) => {
        const d = new Date();
        d.setMonth(d.getMonth() - i);
        return d.toLocaleString('default', { month: 'short' });
      }).reverse();

      const sessionTrendData = months.map((month) => {
        // Count sessions for this month
        // This is a simplified check, real implementation might need stricter date handling
        const count = sessions.filter((s) => {
          const d = new Date(s.startTime);
          return d.toLocaleString('default', { month: 'short' }) === month;
        }).length;
        return { name: month, sessions: count };
      });

      // 4. Session Types Distribution
      const typeCount: Record<string, number> = {};
      sessions.forEach((s) => {
        typeCount[s.type] = (typeCount[s.type] || 0) + 1;
      });
      const sessionDistribution = Object.entries(typeCount).map(
        ([name, value]) => ({ name, value }),
      );

      // 5. Recent Activity (last 5 sessions)
      const recentActivity = sessions.slice(0, 5).map((s) => ({
        id: s._id.toString(),
        type: 'session',
        description: `${s.type} session`,
        date: s.startTime,
        status: s.status,
      }));

      return {
        success: true,
        data: {
          metrics: {
            activeClients: activeClientsCount,
            totalSessions,
            sessionCompletionRate: completionRate,
            totalSessionHours: Math.round(totalHours * 10) / 10,
            revenue: 0, // Optionally calculate from payouts if available
          },
          sessionTrendData,
          sessionDistribution,
          recentActivity,
        },
      };
    } catch (error) {
      console.error('Error fetching gym coach analytics:', error);
      return {
        success: false,
        errorCode: ErrorCode.UNKNOWN_ERROR,
        message: 'Failed to fetch analytics',
      };
    }
  }

  async validateFacility(gymId: string, facilityId: string) {
    const gym = await this.gymModel.findOne({
      _id: gymId,
      'facilities._id': facilityId,
    });
    return !!gym;
  }
}
