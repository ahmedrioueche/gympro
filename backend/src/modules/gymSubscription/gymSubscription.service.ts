import {
  ApiResponse,
  CreateSubscriptionTypeDto,
  UpdateSubscriptionTypeDto,
} from '@ahmedrioueche/gympro-client';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { SubscriptionTypeModel } from './gymSubscription.schema';

@Injectable()
export class GymSubscriptionService {
  private readonly logger = new Logger(GymSubscriptionService.name);

  constructor(
    @InjectModel(SubscriptionTypeModel.name)
    private readonly subscriptionTypeModel: Model<SubscriptionTypeModel>,
  ) {}

  private toObjectId(id: string): Types.ObjectId {
    try {
      if (!id) throw new Error('ID is required');
      return new Types.ObjectId(id);
    } catch (error) {
      throw new BadRequestException('Invalid ID format');
    }
  }

  async getSubscriptionTypes(
    gymId: string,
  ): Promise<ApiResponse<SubscriptionTypeModel[]>> {
    try {
      const types = await this.subscriptionTypeModel
        .find({ gymId })
        .sort({ createdAt: -1 })
        .exec();

      return {
        success: true,
        data: types,
      };
    } catch (error) {
      this.logger.error(`Failed to fetch subscription types: ${error.message}`);
      throw new InternalServerErrorException(
        'Failed to fetch subscription types',
      );
    }
  }

  async createSubscriptionType(
    gymId: string,
    dto: CreateSubscriptionTypeDto,
  ): Promise<ApiResponse<SubscriptionTypeModel>> {
    try {
      const newType = new this.subscriptionTypeModel({
        ...dto,
        gymId,
      });

      const savedType = await newType.save();

      return {
        success: true,
        data: savedType,
        message: 'Subscription plan created successfully',
      };
    } catch (error) {
      this.logger.error(`Failed to create subscription type: ${error.message}`);
      throw new InternalServerErrorException(
        'Failed to create subscription plan',
      );
    }
  }

  async updateSubscriptionType(
    gymId: string,
    id: string,
    dto: UpdateSubscriptionTypeDto,
  ): Promise<ApiResponse<SubscriptionTypeModel>> {
    try {
      const updatedType = await this.subscriptionTypeModel
        .findOneAndUpdate(
          { _id: this.toObjectId(id), gymId },
          { $set: dto },
          { new: true },
        )
        .exec();

      if (!updatedType) {
        throw new NotFoundException('Subscription plan not found');
      }

      return {
        success: true,
        data: updatedType,
        message: 'Subscription plan updated successfully',
      };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      this.logger.error(`Failed to update subscription type: ${error.message}`);
      throw new InternalServerErrorException(
        'Failed to update subscription plan',
      );
    }
  }

  async deleteSubscriptionType(
    gymId: string,
    id: string,
  ): Promise<ApiResponse<void>> {
    try {
      const result = await this.subscriptionTypeModel
        .findOneAndDelete({ _id: this.toObjectId(id), gymId })
        .exec();

      if (!result) {
        throw new NotFoundException('Subscription plan not found');
      }

      return {
        success: true,
        message: 'Subscription plan deleted successfully',
      };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      this.logger.error(`Failed to delete subscription type: ${error.message}`);
      throw new InternalServerErrorException(
        'Failed to delete subscription plan',
      );
    }
  }
}
