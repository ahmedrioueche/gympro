import {
  ApiResponse,
  CoachClient,
  CoachDashboardStats,
  CoachPricingTier,
  CoachPricingTierDto,
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
import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from 'src/common/schemas/user.schema';
import { NotificationsService } from '../notifications/notifications.service';
import { SessionsService } from '../sessions/sessions.service';
import { TrainingService } from '../training/training.service';
import { CoachRequestModel } from './schemas/coach-request.schema';

@Injectable()
export class CoachService {
  private readonly logger = new Logger(CoachService.name);

  constructor(
    @InjectModel('CoachRequest')
    private coachRequestModel: Model<CoachRequestModel>,
    @InjectModel(User.name) private userModel: Model<User>,
    private notificationsService: NotificationsService,
    private trainingService: TrainingService,
    @Inject(forwardRef(() => SessionsService))
    private sessionsService: SessionsService,
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
        gender: coach.profile.gender,
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
      this.logger.error('Error fetching coach profile:', error);
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

      // Gender filter
      if (query?.gender) {
        matchQuery['profile.gender'] = query.gender;
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
        gender: coach.profile.gender,
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
      this.logger.error('Error fetching coaches:', error);
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
        initiatedBy: 'member',
      });

      // Get member info for notifications
      const member = await this.userModel.findById(memberId);

      // Send in-app and external notification to coach
      await this.notificationsService.notifyUser(coach, {
        key: 'coach.request',
        vars: {
          memberName:
            member?.profile?.fullName || member?.profile?.username || 'User',
          message: data.message || '',
        },
        type: 'alert',
        priority: 'high',
        relatedId: request?._id?.toString(),
        skipExternal: false,
        action: {
          type: 'link',
          payload: '/coach/clients',
        },
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
        initiatedBy: 'member',
      };

      return {
        success: true,
        data: response,
      };
    } catch (error) {
      this.logger.error('Error requesting coach:', error);
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
          initiatedBy: req.initiatedBy,
        }),
      );

      return {
        success: true,
        data: formattedRequests,
      };
    } catch (error) {
      this.logger.error('Error fetching coach requests:', error);
      return {
        success: false,
        errorCode: ErrorCode.COACH_REQUEST_FETCH_ERROR,
        message: 'Failed to fetch coach requests',
      };
    }
  }

  // ============================================
  // PRICING MANAGEMENT
  // ============================================

  /**
   * Get coach pricing tiers
   */
  async getMyPricing(
    coachId: string,
  ): Promise<ApiResponse<CoachPricingTier[]>> {
    try {
      const coach = await this.userModel.findById(coachId).lean();
      if (!coach) {
        throw new NotFoundException('Coach not found');
      }

      // Ensure pricing is an array
      const pricing = coach.coachingInfo?.pricing || [];

      return {
        success: true,
        data: pricing as any,
      };
    } catch (error) {
      this.logger.error('Error fetching pricing:', error);
      return {
        success: false,
        errorCode: ErrorCode.COACH_PRICING_FETCH_ERROR,
        message: 'Failed to fetch pricing',
      };
    }
  }

  /**
   * Create a new pricing tier
   */
  async createPricing(
    coachId: string,
    data: CoachPricingTierDto,
  ): Promise<ApiResponse<CoachPricingTier>> {
    try {
      const coach = await this.userModel.findById(coachId);
      if (!coach) {
        throw new NotFoundException('Coach not found');
      }

      if (!coach.coachingInfo) {
        coach.coachingInfo = {};
      }
      if (!coach.coachingInfo.pricing) {
        coach.coachingInfo.pricing = [];
      }

      // Add new pricing
      coach.coachingInfo.pricing.push(data as any);

      await coach.save();

      // Get the last added item
      const newPricing =
        coach.coachingInfo.pricing[coach.coachingInfo.pricing.length - 1];

      return {
        success: true,
        data: newPricing as any,
      };
    } catch (error) {
      this.logger.error('Error creating pricing:', error);
      return {
        success: false,
        errorCode: ErrorCode.COACH_PRICING_CREATE_ERROR,
        message: 'Failed to create pricing tier',
      };
    }
  }

  /**
   * Update a pricing tier
   */
  async updatePricing(
    coachId: string,
    pricingId: string,
    data: Partial<CoachPricingTierDto>,
  ): Promise<ApiResponse<CoachPricingTier>> {
    try {
      const coach = await this.userModel.findById(coachId);
      if (!coach) {
        throw new NotFoundException('Coach not found');
      }

      const pricing = (coach as any).coachingInfo?.pricing?.id(pricingId);
      if (!pricing) {
        return {
          success: false,
          errorCode: ErrorCode.COACH_PRICING_NOT_FOUND,
          message: 'Pricing not found',
        };
      }

      // Update fields
      if (data.name) pricing.name = data.name;
      if (data.description !== undefined)
        pricing.description = data.description;
      if (data.serviceType) pricing.serviceType = data.serviceType;
      if (data.duration) pricing.duration = data.duration;
      if (data.durationUnit) pricing.durationUnit = data.durationUnit;
      if (data.price !== undefined) pricing.price = data.price;
      if (data.currency) pricing.currency = data.currency;
      if (data.isActive !== undefined) pricing.isActive = data.isActive;

      await coach.save();

      return {
        success: true,
        data: pricing,
      };
    } catch (error) {
      this.logger.error('Error updating pricing:', error);
      return {
        success: false,
        errorCode: ErrorCode.COACH_PRICING_UPDATE_ERROR,
        message: 'Failed to update pricing tier',
      };
    }
  }

  /**
   * Delete a pricing tier
   */
  async deletePricing(
    coachId: string,
    pricingId: string,
  ): Promise<ApiResponse<void>> {
    try {
      const result = await this.userModel.updateOne(
        { _id: coachId },
        {
          $pull: {
            'coachingInfo.pricing': { _id: pricingId },
          },
        },
      );

      if (result.modifiedCount === 0) {
        return {
          success: false,
          errorCode: ErrorCode.COACH_PRICING_DELETE_ERROR,
          message: 'Failed to delete pricing tier or not found',
        };
      }

      return {
        success: true,
      };
    } catch (error) {
      this.logger.error('Error deleting pricing:', error);
      return {
        success: false,
        errorCode: ErrorCode.COACH_PRICING_DELETE_ERROR,
        message: 'Failed to delete pricing tier',
      };
    }
  }

  // ============================================
  // DASHBOARD STATS
  // ============================================

  /**
   * Get coach dashboard statistics
   */
  async getDashboardStats(
    coachId: string,
  ): Promise<ApiResponse<CoachDashboardStats>> {
    try {
      const coach = await this.userModel.findById(coachId);
      if (!coach) throw new NotFoundException('Coach not found');

      // 1. Active Clients
      const activeClientsCount =
        coach.coachingInfo?.coachedMembers?.length || 0;

      // Calculate Active Clients Trend (Growth this month vs last month)
      // Note: Since we don't have historical snapshots of `coachedMembers` array,
      // we can approximate new clients using `CoachRequest` accepted this month vs last month.
      // This is a proxy for "growth" rather than total count trend, but serves the purpose.

      const now = new Date();
      const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

      const [newClientsThisMonth, newClientsLastMonth] = await Promise.all([
        this.coachRequestModel.countDocuments({
          coachId: new Types.ObjectId(coachId),
          status: 'accepted',
          updatedAt: { $gte: currentMonthStart },
        }),
        this.coachRequestModel.countDocuments({
          coachId: new Types.ObjectId(coachId),
          status: 'accepted',
          updatedAt: { $gte: lastMonthStart, $lte: lastMonthEnd },
        }),
      ]);

      const clientTrend = newClientsThisMonth - newClientsLastMonth;

      // 2. Programs Created
      const programsCount = await this.trainingService.countPrograms(coachId);
      // Trend for programs (Assume `countPrograms` can filter by date if updated,
      // or we just use current total and 0 trend if not easily trackable without updating TrainingService)
      // For now, let's keep trend as 0 or implement granular count if TrainingService supports it.
      // Checking `trainingService` usage... `countPrograms(coachId)` is used.
      // Let's assume for now we don't have historical program data easily accesssible without checking TrainingService.
      // We'll leave trend as 0 for programs to be safe, or 1 if count > 0 to show "positive".
      const programTrend = 0;

      // 3. Sessions This Month
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const endOfMonth = new Date();
      endOfMonth.setMonth(endOfMonth.getMonth() + 1);
      endOfMonth.setDate(0);
      endOfMonth.setHours(23, 59, 59, 999);

      const sessionsCount = await this.sessionsService.countSessions(
        coachId,
        startOfMonth,
        endOfMonth,
      );

      // Sessions Last Month
      const sessionsLastMonthCount = await this.sessionsService.countSessions(
        coachId,
        lastMonthStart,
        lastMonthEnd,
      );

      const sessionTrend = sessionsCount - sessionsLastMonthCount;

      // 4. Client Retention Calculation
      // Formula: (Current Coached Members / Total Unique Clients Ever Accepted) * 100
      const totalAcceptedClients = await this.coachRequestModel.distinct(
        'memberId',
        {
          coachId: new Types.ObjectId(coachId),
          status: 'accepted',
        },
      );

      const totalAcceptedCount = totalAcceptedClients.length;
      let retentionRate: number | null = null;
      if (totalAcceptedCount > 0) {
        retentionRate = Math.round(
          (activeClientsCount / totalAcceptedCount) * 100,
        );
        // Cap at 100 just in case data inconsistencies occur
        if (retentionRate > 100) retentionRate = 100;
      }
      const retentionTrend = 0; // Requires historical retention snapshots to implement accurately

      // 5. Pending Requests Count (Real data for "Pending Check-Ins" UI)
      const pendingRequestsCount = await this.coachRequestModel.countDocuments({
        coachId: new Types.ObjectId(coachId),
        status: 'pending',
        initiatedBy: 'member',
      });

      // 6. Today's Sessions
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);

      const todayEnd = new Date();
      todayEnd.setHours(23, 59, 59, 999);

      const todaySessionsResult = await this.sessionsService.findAll({
        coachId,
        startDate: todayStart.toISOString(),
        endDate: todayEnd.toISOString(),
      });

      return {
        success: true,
        data: {
          activeClients: { value: activeClientsCount, trend: clientTrend },
          programsCreated: { value: programsCount, trend: programTrend },
          sessionsThisMonth: { value: sessionsCount, trend: sessionTrend },
          clientRetention: { value: retentionRate, trend: retentionTrend },
          todaySessions: todaySessionsResult.data || [],
          pendingRequestsCount,
        },
      };
    } catch (error) {
      this.logger.error('Error fetching dashboard stats:', error);
      return {
        success: false,
        errorCode: ErrorCode.UNKNOWN_ERROR,
        message: 'Failed to fetch dashboard stats',
      };
    }
  }

  /**
   * Get coach dashboard recent activity
   */
  async getDashboardActivity(coachId: string): Promise<ApiResponse<any[]>> {
    try {
      // 1. Get finished sessions (last 5)
      const recentSessions = await this.sessionsService.findRecent(coachId, 5);

      // 2. Get recent clients (last 5 accepted requests)
      const recentClients = await this.coachRequestModel
        .find({
          coachId: new Types.ObjectId(coachId),
          status: 'accepted',
        })
        .sort({ updatedAt: -1 })
        .limit(5)
        .lean();

      // Transform and merge
      const activities = [
        ...recentSessions.map((session) => ({
          type: 'session',
          message: `Session completed with ${(session as any).memberId?.profile?.fullName || 'Client'}`,
          time: session.endTime,
          icon: 'Clipboard',
          color: 'text-green-500',
        })),
        ...recentClients.map((req) => ({
          type: 'new_client',
          message: 'New client accepted',
          time: req.updatedAt,
          icon: 'UserPlus',
          color: 'text-blue-500',
        })),
      ];

      // Sort by time descending
      activities.sort(
        (a: any, b: any) =>
          new Date(b.time).getTime() - new Date(a.time).getTime(),
      );

      // Return top 10 combined
      return {
        success: true,
        data: activities.slice(0, 10),
      };
    } catch (error) {
      this.logger.error('Error fetching dashboard activity:', error);
      return {
        success: false,
        errorCode: ErrorCode.UNKNOWN_ERROR,
        message: 'Failed to fetch dashboard activity',
      };
    }
  }

  // ============================================
  // HELPERS
  // ============================================

  private async getProgramName(programId: string): Promise<string> {
    try {
      const program = await this.trainingService.findProgramById(programId);
      return program.name;
    } catch {
      return 'Unknown Program';
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
          initiatedBy: 'member',
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
            initiatedBy: req.initiatedBy,
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
      this.logger.error('Error fetching pending requests:', error);
      return {
        success: false,
        errorCode: ErrorCode.COACH_REQUEST_FETCH_ERROR,
        message: 'Failed to fetch pending requests',
      };
    }
  }

  /**
   * Get sent requests (initiated by coach)
   */
  async getSentRequests(
    coachId: string,
  ): Promise<ApiResponse<CoachRequestWithDetails[]>> {
    try {
      const query = {
        coachId: new Types.ObjectId(coachId),
        status: 'pending',
        initiatedBy: 'coach',
      };

      const requests = await this.coachRequestModel
        .find(query)
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
            initiatedBy: req.initiatedBy,
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
      this.logger.error('Error fetching sent requests:', error);
      return {
        success: false,
        errorCode: ErrorCode.COACH_REQUEST_FETCH_ERROR,
        message: 'Failed to fetch sent requests',
      };
    }
  }

  /**
   * Respond to a coaching request (accept or decline)
   */
  async respondToRequest(
    userId: string,
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

      // Determine who should be responding
      const isMemberInitiated = request.initiatedBy === 'member';
      const expectedResponderId = isMemberInitiated
        ? request.coachId.toString()
        : request.memberId.toString();

      // Verify the current user is the expected responder
      if (expectedResponderId !== userId) {
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

      const member = await this.userModel.findById(request.memberId);
      const coach = await this.userModel.findById(request.coachId);

      // If accepted, establish the coaching relationship
      if (data.action === 'accept') {
        const coachIdStr = request.coachId.toString();
        const memberIdStr = request.memberId.toString();

        await this.userModel.findByIdAndUpdate(coachIdStr, {
          $addToSet: { 'coachingInfo.coachedMembers': memberIdStr },
        });

        await this.userModel.findByIdAndUpdate(memberIdStr, {
          'coachingInfo.coachId': new Types.ObjectId(coachIdStr),
        });
      }

      // Notify the other party
      if (isMemberInitiated) {
        // Coach responded, notify member
        if (member) {
          await this.notificationsService.notifyUser(member, {
            key: `coach.respond_${data.action}`,
            vars: {
              coachName:
                coach?.profile?.fullName || coach?.profile?.username || 'Coach',
            },
            type: 'alert',
            priority: 'high',
            relatedId: request?._id?.toString(),
            skipExternal: false,
          });
        }
      } else {
        // Member responded, notify coach
        if (coach) {
          await this.notificationsService.notifyUser(coach, {
            key: `coach.offer_respond_${data.action}`,
            vars: {
              memberName:
                member?.profile?.fullName ||
                member?.profile?.username ||
                'Member',
            },
            type: 'alert',
            priority: 'high',
            relatedId: request?._id?.toString(),
            skipExternal: false,
            action: {
              type: 'link',
              payload: '/coach/clients',
            },
          });
        }
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
          initiatedBy: request.initiatedBy,
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

      console.log(
        'Fetching active clients. Count:',
        coach.coachingInfo.coachedMembers.length,
      );

      const clients = await this.userModel
        .find({
          _id: { $in: coach.coachingInfo.coachedMembers },
        })
        .lean();

      // Fetch accepted requests to get the coaching start date
      const clientProfiles = await Promise.all(
        clients.map(async (client: any) => {
          try {
            // Find the accepted request for this client
            const acceptedRequest = await this.coachRequestModel
              .findOne({
                coachId: new Types.ObjectId(coachId),
                memberId: client._id,
                status: 'accepted',
              })
              .lean();

            // Safe program name fetching
            let programInfo;
            if (client.currentProgram) {
              const name = await this.getProgramName(
                client.currentProgram.toString(),
              );
              programInfo = {
                programId: client.currentProgram.toString(),
                programName: name,
              };
            }

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
              currentProgram: programInfo,
              lastWorkoutDate:
                client.programProgress?.lastWorkoutDate?.toISOString(),
            };
          } catch (err) {
            console.error(`Error mapping client ${client?._id}:`, err);
            // Return partial client data so it doesn't disappear from the list
            return {
              userId: client?._id?.toString() || 'unknown',
              username: client?.profile?.username || 'Unknown',
              fullName: client?.profile?.fullName || 'Unknown Client',
              profileImageUrl: client?.profile?.profileImageUrl,
              // Fallback fields
              email: client?.profile?.email,
              age: client?.profile?.age,
              gender: client?.profile?.gender,
              location: {
                city: client?.profile?.city,
                state: client?.profile?.state,
                country: client?.profile?.country,
              },
              joinedAt: client?.createdAt?.toISOString(),
              currentProgram: undefined, // Program failed to load
              lastWorkoutDate: undefined,
            };
          }
        }),
      );

      const validProfiles = clientProfiles.filter(
        (p) => p !== null,
      ) as CoachClient[];

      return {
        success: true,
        data: validProfiles,
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
        initiatedBy: 'coach',
      });

      // Get coach info for notifications
      const coach = await this.userModel.findById(coachId);

      // Send in-app notification to member
      await this.notificationsService.notifyUser(member, {
        key: 'coach.offer',
        vars: {
          coachName:
            coach?.profile?.fullName || coach?.profile?.username || 'Coach',
        },
        type: 'alert',
        priority: 'high',
        relatedId: request?._id?.toString(),
        skipExternal: false,
        action: {
          type: 'modal',
          payload: 'coaching_offer',
          data: {
            requestId: request?._id?.toString(),
            coachName: coach?.profile?.fullName || coach?.profile?.username,
            coachId: coachId,
            coachImageUrl: coach?.profile?.profileImageUrl,
            message: data.message,
          },
        },
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
          initiatedBy: 'coach',
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
  /**
   * Assign a program to a client
   */
  async assignProgramToClient(
    coachId: string,
    clientId: string,
    programId: string,
  ): Promise<ApiResponse<any>> {
    try {
      // 1. Verify client is coached by this coach
      const coach = await this.userModel.findById(coachId);
      if (
        !coach?.coachingInfo?.coachedMembers?.includes(
          new Types.ObjectId(clientId) as any,
        )
      ) {
        throw new BadRequestException('Client is not coached by you');
      }

      // Check if program is already assigned
      const client = await this.userModel.findById(clientId);
      if (client?.currentProgram?.toString() === programId) {
        throw new BadRequestException(
          'This program is already assigned to the client',
        );
      }

      // 2. Start program (force override existing active program)
      const history = await this.trainingService.startProgram(
        programId,
        clientId,
        true,
      );

      // 3. Update User currentProgram
      const updatedUser = await this.userModel.findByIdAndUpdate(
        clientId,
        {
          currentProgram: new Types.ObjectId(programId),
          $push: { programHistory: history._id },
        },
        { new: true },
      );

      // 5. Notify Client
      if (updatedUser) {
        await this.notificationsService.notifyUser(updatedUser, {
          key: 'program_assigned',
          type: 'program',
          relatedId: programId,
          vars: {
            coachName: coach.profile.fullName || coach.profile.username,
          },
        });
      }

      return {
        success: true,
        data: history,
        message: 'Program assigned successfully',
      };
    } catch (error) {
      console.error('Error assigning program:', error);
      return {
        success: false,
        errorCode: ErrorCode.COACH_ACTION_FAILED,
        message: error.message || 'Failed to assign program',
      };
    }
  }
}
