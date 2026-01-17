import {
  ApiResponse,
  CoachClient,
  CoachProfile,
  CoachQueryDto,
  CoachRequest as CoachRequestType,
  CoachRequestWithDetails,
  ErrorCode,
  ProspectiveMember,
  ProspectiveMembersQueryDto,
  RequestCoachDto,
  RespondToRequestDto,
  SendCoachRequestDto,
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
   * Get a single coach profile by userId
   */
  async getCoachProfile(coachId: string): Promise<ApiResponse<CoachProfile>> {
    try {
      // Find coach by userId
      const coach = await this.userModel.findById(coachId).lean();

      if (!coach || coach.role !== 'coach') {
        return {
          success: false,
          errorCode: ErrorCode.COACH_NOT_FOUND,
          message: 'Coach not found',
        };
      }

      const coachProfile: CoachProfile = {
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
        certifications: coach.certifications?.map((cert: string) => ({
          name: cert,
        })),
        rating: coach.coachingInfo?.rating,
        totalClients: coach.coachingInfo?.coachedMembers?.length || 0,
        isVerified: coach.coachVerification?.status === 'approved',
      };

      return {
        success: true,
        data: coachProfile,
      };
    } catch (error) {
      console.error('Error fetching coach profile:', error);
      return {
        success: false,
        errorCode: ErrorCode.COACH_FETCH_ERROR,
        message: 'Failed to fetch coach profile',
      };
    }
  }

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

  // ============================================
  // COACH-SIDE CLIENT MANAGEMENT
  // ============================================

  /**
   * Get pending requests (received by coach)
   */
  async getPendingRequests(
    coachId: string,
  ): Promise<ApiResponse<CoachRequestWithDetails[]>> {
    try {
      const requests = await this.coachRequestModel
        .find({
          coachId: new Types.ObjectId(coachId),
          status: 'pending',
        })
        .sort({ createdAt: -1 })
        .lean();

      // Fetch member details for each request
      const requestsWithDetails: CoachRequestWithDetails[] = await Promise.all(
        requests.map(async (req: any) => {
          const member = await this.userModel.findById(req.memberId).lean();
          return {
            _id: req._id.toString(),
            memberId: req.memberId.toString(),
            coachId: req.coachId.toString(),
            message: req.message,
            status: req.status,
            createdAt: req.createdAt,
            updatedAt: req.updatedAt,
            memberDetails: member
              ? {
                  username: member.profile.username,
                  fullName: member.profile.fullName,
                  profileImageUrl: member.profile.profileImageUrl,
                  location: [
                    member.profile.city,
                    member.profile.state,
                    member.profile.country,
                  ]
                    .filter(Boolean)
                    .join(', '),
                }
              : undefined,
          };
        }),
      );

      return {
        success: true,
        data: requestsWithDetails,
      };
    } catch (error) {
      console.error('Error fetching pending requests:', error);
      return {
        success: false,
        errorCode: ErrorCode.COACH_REQUEST_FETCH_ERROR,
        message: 'Failed to fetch pending requests',
      };
    }
  }

  /**
   * Respond to a coaching request (accept or decline)
   */
  async respondToRequest(
    coachId: string,
    requestId: string,
    data: RespondToRequestDto,
  ): Promise<ApiResponse<CoachRequestType>> {
    try {
      const request = await this.coachRequestModel.findById(requestId);

      if (!request) {
        return {
          success: false,
          errorCode: ErrorCode.COACH_REQUEST_NOT_FOUND,
          message: 'Request not found',
        };
      }

      // Verify this request is for this coach
      if (request.coachId.toString() !== coachId) {
        return {
          success: false,
          errorCode: ErrorCode.UNAUTHORIZED,
          message: 'Unauthorized to respond to this request',
        };
      }

      // Update request status
      request.status = data.action === 'accept' ? 'accepted' : 'declined';
      request.response = data.response;
      request.respondedAt = new Date();
      await request.save();

      // If accepted, add member to coach's coachedMembers array
      if (data.action === 'accept') {
        await this.userModel.findByIdAndUpdate(coachId, {
          $addToSet: { 'coachingInfo.coachedMembers': request.memberId },
        });

        // Update member's coachId
        await this.userModel.findByIdAndUpdate(request.memberId, {
          'coachingInfo.coachId': new Types.ObjectId(coachId),
        });
      }

      // Notify member
      const member = await this.userModel.findById(request.memberId);
      const coach = await this.userModel.findById(coachId);

      if (member) {
        await this.notificationsService.notifyUser(member, {
          title:
            data.action === 'accept'
              ? 'Coaching Request Accepted'
              : 'Coaching Request Declined',
          message:
            data.action === 'accept'
              ? `${coach?.profile?.fullName || coach?.profile?.username} accepted your coaching request!`
              : `${coach?.profile?.fullName || coach?.profile?.username} declined your coaching request`,
          type: 'alert',
          priority: 'high',
          relatedId: request?._id?.toString(),
          skipExternal: false,
        });
      }

      const requestObj = request.toObject();

      return {
        success: true,
        data: {
          _id: requestObj._id?.toString() || '',
          memberId: request.memberId.toString(),
          coachId: request.coachId.toString(),
          message: request.message,
          status: request.status,
          respondedAt: requestObj.respondedAt?.toISOString(),
          response: request.response,
          createdAt: requestObj.createdAt?.toISOString(),
          updatedAt: requestObj.updatedAt?.toISOString(),
        },
      };
    } catch (error) {
      console.error('Error responding to request:', error);
      return {
        success: false,
        errorCode: ErrorCode.COACH_REQUEST_RESPOND_FAILED,
        message: 'Failed to respond to request',
      };
    }
  }

  /**
   * Get active clients (members being coached)
   */
  async getActiveClients(coachId: string): Promise<ApiResponse<CoachClient[]>> {
    try {
      const coach = await this.userModel.findById(coachId);

      if (!coach || !coach.coachingInfo?.coachedMembers) {
        return {
          success: true,
          data: [],
        };
      }

      const clients = await this.userModel
        .find({
          _id: { $in: coach.coachingInfo.coachedMembers },
        })
        .lean();

      // Fetch accepted requests to get the coaching start date
      const clientProfiles: CoachClient[] = await Promise.all(
        clients.map(async (client: any) => {
          // Find the accepted request for this client
          const acceptedRequest = await this.coachRequestModel
            .findOne({
              coachId: new Types.ObjectId(coachId),
              memberId: client._id,
              status: 'accepted',
            })
            .lean();

          return {
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
            // Use respondedAt (when request was accepted) as joinedAt
            joinedAt:
              acceptedRequest?.respondedAt?.toISOString() ||
              client.createdAt?.toISOString(),
            currentProgram: client.currentProgram
              ? {
                  programId: client.currentProgram.toString(),
                  programName: 'Program Name', // TODO: Fetch actual program name
                }
              : undefined,
            lastWorkoutDate:
              client.programProgress?.lastWorkoutDate?.toISOString(),
          };
        }),
      );

      return {
        success: true,
        data: clientProfiles,
      };
    } catch (error) {
      console.error('Error fetching active clients:', error);
      return {
        success: false,
        errorCode: ErrorCode.COACH_CLIENTS_FETCH_FAILED,
        message: 'Failed to fetch active clients',
      };
    }
  }

  /**
   * Get prospective members (members looking for a coach)
   */
  async getProspectiveMembers(
    coachId: string,
    query?: ProspectiveMembersQueryDto,
  ): Promise<ApiResponse<ProspectiveMember[]>> {
    try {
      // Build query for members without a coach or looking for one
      const matchQuery: any = {
        role: 'member',
        'profile.isOnBoarded': true,
        _id: { $ne: new Types.ObjectId(coachId) },
      };

      // Only show members without a coach
      matchQuery.$or = [
        { 'coachingInfo.coachId': { $exists: false } },
        { 'coachingInfo.coachId': null },
      ];

      // Location filters
      if (query?.city) {
        matchQuery['profile.city'] = new RegExp(query.city, 'i');
      }
      if (query?.state) {
        matchQuery['profile.state'] = new RegExp(query.state, 'i');
      }
      if (query?.country) {
        matchQuery['profile.country'] = new RegExp(query.country, 'i');
      }

      const limit = query?.limit || 20;
      const offset = query?.offset || 0;

      const members = await this.userModel
        .find(matchQuery)
        .skip(offset)
        .limit(limit)
        .lean();

      const prospectiveMembers: ProspectiveMember[] = members.map(
        (member: any) => ({
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
          gymMemberships: [], // TODO: Fetch actual gym names
          hasCoach: !!member.coachingInfo?.coachId,
        }),
      );

      return {
        success: true,
        data: prospectiveMembers,
      };
    } catch (error) {
      console.error('Error fetching prospective members:', error);
      return {
        success: false,
        errorCode: ErrorCode.COACH_PROSPECTIVE_MEMBERS_FETCH_FAILED,
        message: 'Failed to fetch prospective members',
      };
    }
  }

  /**
   * Send coaching request to a member (coach initiates)
   */
  async sendRequestToMember(
    coachId: string,
    memberId: string,
    data: SendCoachRequestDto,
  ): Promise<ApiResponse<CoachRequestType>> {
    try {
      // Verify member exists
      const member = await this.userModel.findById(memberId);
      if (!member || member.role !== 'member') {
        return {
          success: false,
          errorCode: ErrorCode.USER_NOT_FOUND,
          message: 'Member not found',
        };
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
          errorCode: ErrorCode.COACH_REQUEST_ALREADY_EXISTS,
          message: 'You already have a pending request with this member',
        };
      }

      // Create new request
      const request = await this.coachRequestModel.create({
        memberId: new Types.ObjectId(memberId),
        coachId: new Types.ObjectId(coachId),
        message: data.message,
        status: 'pending',
      });

      // Get coach info for notifications
      const coach = await this.userModel.findById(coachId);

      // Send in-app notification to member
      await this.notificationsService.notifyUser(member, {
        title: 'New Coaching Offer',
        message: `${coach?.profile?.fullName || coach?.profile?.username} wants to be your coach!`,
        type: 'alert',
        priority: 'high',
        relatedId: request?._id?.toString(),
        skipExternal: false,
      });

      const requestObj = request.toObject();

      return {
        success: true,
        data: {
          _id: request?._id?.toString() as string,
          memberId: request.memberId.toString(),
          coachId: request.coachId.toString(),
          message: request.message,
          status: request.status,
          createdAt: requestObj.createdAt,
          updatedAt: requestObj.updatedAt,
        },
      };
    } catch (error) {
      console.error('Error sending request to member:', error);
      return {
        success: false,
        errorCode: ErrorCode.COACH_REQUEST_FAILED,
        message: 'Failed to send coaching request',
      };
    }
  }

  /**
   * Get coach analytics data
   */
  async getAnalytics(coachId: string): Promise<ApiResponse<any>> {
    try {
      const coach = await this.userModel.findById(coachId);
      if (!coach || coach.role !== 'coach') {
        return {
          success: false,
          errorCode: ErrorCode.COACH_NOT_FOUND,
          message: 'Coach not found',
        };
      }

      // Get active clients count
      const clientIds = coach.coachingInfo?.coachedMembers || [];
      const activeClients = clientIds.length;

      // Get all accepted coach requests to count total clients over time
      const acceptedRequests = await this.coachRequestModel.countDocuments({
        coachId: new Types.ObjectId(coachId),
        status: 'accepted',
      });

      // Calculate session statistics (placeholder - would need Session model)
      // For now, use mock data based on clients
      const totalSessions = activeClients * 12; // Approximate
      const completedSessions = Math.floor(totalSessions * 0.85);
      const upcomingSessions = Math.floor(activeClients * 2);
      const sessionCompletionRate =
        totalSessions > 0 ? (completedSessions / totalSessions) * 100 : 0;

      // Calculate recent activity from coach requests
      const recentRequests = await this.coachRequestModel
        .find({ coachId: new Types.ObjectId(coachId) })
        .sort({ createdAt: -1 })
        .limit(10)
        .populate(
          'memberId',
          'profile.fullName profile.username profile.profileImageUrl',
        )
        .lean();

      const recentActivity = recentRequests.map((req: any) => ({
        type:
          req.status === 'accepted'
            ? 'new_client'
            : req.status === 'pending'
              ? 'session_created'
              : 'session_cancelled',
        description:
          req.status === 'accepted'
            ? `${req.memberId?.profile?.fullName || req.memberId?.profile?.username} became a client`
            : `Request from ${req.memberId?.profile?.fullName || req.memberId?.profile?.username}`,
        date: req.createdAt,
        clientName:
          req.memberId?.profile?.fullName || req.memberId?.profile?.username,
        clientAvatar: req.memberId?.profile?.profileImageUrl,
      }));

      // Build trend data for sessions (mock for last 6 months)
      const sessionTrendData: { date: string; value: number; label: string }[] =
        [];
      const now = new Date();
      for (let i = 5; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        sessionTrendData.push({
          date: date.toISOString().slice(0, 7),
          value: Math.floor(Math.random() * 20) + 10,
          label: date.toLocaleDateString('en-US', { month: 'short' }),
        });
      }

      // Session type distribution
      const sessionDistribution = {
        one_on_one: Math.floor(totalSessions * 0.5),
        consultation: Math.floor(totalSessions * 0.2),
        check_in: Math.floor(totalSessions * 0.2),
        assessment: Math.floor(totalSessions * 0.1),
      };

      return {
        success: true,
        data: {
          metrics: {
            totalClients: acceptedRequests,
            activeClients,
            totalSessions,
            completedSessions,
            upcomingSessions,
            sessionCompletionRate: Math.round(sessionCompletionRate),
            averageSessionsPerWeek:
              Math.round((completedSessions / 24) * 10) / 10,
            totalSessionHours: Math.round(completedSessions * 0.75 * 10) / 10,
            clientsTrend: 12,
            sessionsTrend: 8,
          },
          sessionTrendData,
          sessionDistribution,
          recentActivity,
        },
      };
    } catch (error) {
      console.error('Error fetching coach analytics:', error);
      return {
        success: false,
        errorCode: ErrorCode.COACH_FETCH_ERROR,
        message: 'Failed to fetch analytics',
      };
    }
  }
}
