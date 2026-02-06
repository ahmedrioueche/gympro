import {
  CompetitionQueryDto,
  CreateCompetitionDto,
  UpdateCompetitionDto,
} from '@ahmedrioueche/gympro-client';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/common/schemas/user.schema';
import { NotificationsService } from '../notifications/notifications.service';
import { CompetitionModel } from './competition.schema';

@Injectable()
export class CompetitionService {
  constructor(
    @InjectModel(CompetitionModel.name)
    private competitionModel: Model<CompetitionModel>,
    @InjectModel(User.name)
    private userModel: Model<User>,
    @InjectModel('GymMembership')
    private gymMembershipModel: Model<any>,
    private notificationsService: NotificationsService,
  ) {}

  async findAll(
    gymId: string,
    options: CompetitionQueryDto = {},
  ): Promise<{
    data: CompetitionModel[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const { search, type, status, page = 1, limit = 12 } = options;
    const skip = (page - 1) * limit;

    const query: any = { gymId };

    if (search && search.trim()) {
      query.$or = [
        { title: new RegExp(search.trim(), 'i') },
        { description: new RegExp(search.trim(), 'i') },
      ];
    }

    if (type) {
      query.type = type;
    }

    if (status) {
      query.status = status;
    }

    const [data, total] = await Promise.all([
      this.competitionModel
        .find(query)
        .sort({ startDate: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.competitionModel.countDocuments(query).exec(),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<CompetitionModel> {
    const competition = await this.competitionModel.findById(id).exec();
    if (!competition) {
      throw new NotFoundException(`Competition with ID ${id} not found`);
    }
    return competition;
  }

  async create(
    gymId: string,
    dto: CreateCompetitionDto,
    userId: string,
  ): Promise<CompetitionModel> {
    const newCompetition = new this.competitionModel({
      ...dto,
      gymId,
      createdBy: userId,
      participantCount: 0,
    });
    const saved = await newCompetition.save();

    // Notify all gym members
    await this.notifyMembersOfNewCompetition(saved);

    return saved;
  }

  async update(
    id: string,
    dto: UpdateCompetitionDto,
    userId: string,
  ): Promise<CompetitionModel> {
    const updatedCompetition = await this.competitionModel
      .findByIdAndUpdate(
        id,
        {
          ...dto,
          updatedBy: userId,
        },
        { new: true },
      )
      .exec();

    if (!updatedCompetition) {
      throw new NotFoundException(`Competition with ID ${id} not found`);
    }
    return updatedCompetition;
  }

  async remove(id: string): Promise<{ success: boolean }> {
    const result = await this.competitionModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Competition with ID ${id} not found`);
    }
    return { success: true };
  }

  /**
   * Find all competitions for gym members - returns only active/completed
   */
  async findAllForMembers(
    gymId: string,
    options: CompetitionQueryDto = {},
  ): Promise<{
    data: CompetitionModel[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const { search, type, page = 1, limit = 12 } = options;
    const skip = (page - 1) * limit;

    const query: any = {
      gymId,
      status: { $in: ['active', 'completed'] },
    };

    if (search && search.trim()) {
      query.$or = [
        { title: new RegExp(search.trim(), 'i') },
        { description: new RegExp(search.trim(), 'i') },
      ];
    }

    if (type) {
      query.type = type;
    }

    const [data, total] = await Promise.all([
      this.competitionModel
        .find(query)
        .sort({ startDate: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.competitionModel.countDocuments(query).exec(),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Member joins a competition
   */
  async join(competitionId: string, userId: string): Promise<CompetitionModel> {
    const competition = await this.competitionModel.findById(competitionId);
    if (!competition) {
      throw new NotFoundException('Competition not found');
    }

    if (competition.status !== 'active') {
      throw new Error('Competition is not active');
    }

    if (competition.participants.includes(userId)) {
      throw new Error('Already joined this competition');
    }

    if (
      competition.maxParticipants &&
      competition.participantCount >= competition.maxParticipants
    ) {
      throw new Error('Competition is full');
    }

    competition.participants.push(userId);
    competition.participantCount = competition.participants.length;
    const saved = await competition.save();

    // Notify manager
    await this.notifyManagerOfParticipant(saved, userId);

    return saved;
  }

  /**
   * Member leaves a competition
   */
  async leave(
    competitionId: string,
    userId: string,
  ): Promise<CompetitionModel> {
    const competition = await this.competitionModel.findById(competitionId);
    if (!competition) {
      throw new NotFoundException('Competition not found');
    }

    if (competition.status !== 'active') {
      throw new Error('Cannot leave a non-active competition');
    }

    if (!competition.participants.includes(userId)) {
      throw new Error('Not a participant in this competition');
    }

    competition.participants = competition.participants.filter(
      (p) => p !== userId,
    );
    competition.participantCount = competition.participants.length;
    return competition.save();
  }

  /**
   * Manager sets winners for a completed competition
   */
  async setWinners(
    competitionId: string,
    winners: {
      place: 1 | 2 | 3;
      userId: string;
      userName?: string;
      userAvatar?: string;
    }[],
    userId: string,
  ): Promise<CompetitionModel> {
    const competition = await this.competitionModel.findById(competitionId);
    if (!competition) {
      throw new NotFoundException('Competition not found');
    }

    if (competition.status !== 'active' && competition.status !== 'completed') {
      throw new Error(
        'Can only set winners for active or completed competitions',
      );
    }

    // Auto-complete if it was active
    if (competition.status === 'active') {
      competition.status = 'completed';
    }

    competition.winners = winners;
    competition.updatedBy = userId;
    const saved = await competition.save();

    // Notify participants
    await this.notifyParticipantsOfWinners(saved);

    return saved;
  }

  /**
   * Fetch populated participants for a competition (Manager only)
   */
  async getParticipants(competitionId: string): Promise<User[]> {
    const competition = await this.competitionModel.findById(competitionId);
    if (!competition) {
      throw new NotFoundException('Competition not found');
    }

    return this.userModel
      .find({
        _id: { $in: competition.participants },
      })
      .select('profile role email')
      .exec();
  }

  private async notifyMembersOfNewCompetition(competition: CompetitionModel) {
    try {
      // Find all active members of the gym
      const activeMemberships = await this.gymMembershipModel
        .find({
          gym: competition.gymId,
          membershipStatus: 'active',
        })
        .distinct('memberId');

      const members = await this.userModel.find({
        _id: { $in: activeMemberships },
      });

      for (const member of members) {
        await this.notificationsService.notifyUser(member, {
          key: 'competition_created',
          type: 'alert',
          vars: {
            title: competition.title,
          },
          relatedId: competition._id.toString(),
          gymId: competition.gymId,
        });
      }
    } catch (error) {
      console.error('Failed to notify members of new competition', error);
    }
  }

  private async notifyManagerOfParticipant(
    competition: CompetitionModel,
    participantId: string,
  ) {
    try {
      const participant = await this.userModel.findById(participantId);
      const gym = await this.userModel.db
        .model('GymModel')
        .findById(competition.gymId);
      if (!participant || !gym) return;

      const owner = await this.userModel.findById(gym.ownerId);
      if (owner) {
        await this.notificationsService.notifyUser(owner, {
          key: 'competition_participant_joined',
          type: 'alert',
          vars: {
            participantName:
              participant.profile.fullName ||
              participant.profile.username ||
              'A member',
            competitionTitle: competition.title,
          },
          relatedId: competition._id.toString(),
          gymId: competition.gymId,
        });
      }
    } catch (error) {
      console.error('Failed to notify manager of participant', error);
    }
  }

  private async notifyParticipantsOfWinners(competition: CompetitionModel) {
    try {
      const participants = await this.userModel.find({
        _id: { $in: competition.participants },
      });

      for (const participant of participants) {
        const winner = competition.winners.find(
          (w) => w.userId === participant._id.toString(),
        );

        if (winner) {
          // Personalized congrats for winners
          await this.notificationsService.notifyUser(participant, {
            key: 'competition_winner_congrats',
            type: 'trophy',
            vars: {
              title: competition.title,
              place: winner.place.toString(),
            },
            relatedId: competition._id.toString(),
            gymId: competition.gymId,
          });
        } else {
          // General announcement for other participants
          await this.notificationsService.notifyUser(participant, {
            key: 'competition_winners_set',
            type: 'trophy',
            vars: {
              title: competition.title,
            },
            relatedId: competition._id.toString(),
            gymId: competition.gymId,
          });
        }
      }
    } catch (error) {
      console.error('Failed to notify participants of winners', error);
    }
  }
}
