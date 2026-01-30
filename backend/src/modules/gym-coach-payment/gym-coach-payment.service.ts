import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateGymCoachPaymentDto } from './dto/create-payment.dto';
import {
  GymCoachPayment,
  GymCoachPaymentDocument,
  GymCoachPaymentStatus,
  GymCoachPaymentType,
} from './schemas/gym-coach-payment.schema';

@Injectable()
export class GymCoachPaymentService {
  constructor(
    @InjectModel(GymCoachPayment.name)
    private paymentModel: Model<GymCoachPaymentDocument>,
  ) {}

  async create(createPaymentDto: CreateGymCoachPaymentDto) {
    const payment = new this.paymentModel({
      ...createPaymentDto,
      gymId: new Types.ObjectId(createPaymentDto.gymId),
      coachId: new Types.ObjectId(createPaymentDto.coachId),
      referenceId: createPaymentDto.referenceId
        ? new Types.ObjectId(createPaymentDto.referenceId)
        : undefined,
    });
    return payment.save();
  }

  async findAll(
    coachId: string,
    gymId: string | undefined,
    query: {
      status?: GymCoachPaymentStatus;
      type?: GymCoachPaymentType;
      page?: number;
      limit?: number;
    },
  ) {
    const filter: any = {
      coachId: new Types.ObjectId(coachId),
    };

    if (gymId) {
      filter.gymId = new Types.ObjectId(gymId);
    }

    if (query.status) filter.status = query.status;
    if (query.type) filter.type = query.type;

    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.paymentModel
        .find(filter)
        .populate('gymId', 'name') // Populate gym name for listing
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.paymentModel.countDocuments(filter),
    ]);

    return { data, total, page, limit };
  }

  async getBalance(coachId: string, gymId?: string) {
    const matchStage: any = {
      coachId: new Types.ObjectId(coachId),
    };

    if (gymId) {
      matchStage.gymId = new Types.ObjectId(gymId);
    }

    const stats = await this.paymentModel.aggregate([
      {
        $match: matchStage,
      },
      {
        $group: {
          _id: null,
          totalEarned: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ['$type', GymCoachPaymentType.EARNING] },
                    { $eq: ['$status', GymCoachPaymentStatus.PAID] },
                  ],
                },
                '$amount',
                0,
              ],
            },
          },
          pendingBalance: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ['$type', GymCoachPaymentType.EARNING] },
                    { $eq: ['$status', GymCoachPaymentStatus.PENDING] },
                  ],
                },
                '$amount',
                0,
              ],
            },
          },
          totalPaidOut: {
            $sum: {
              $cond: [
                { $eq: ['$type', GymCoachPaymentType.PAYOUT] },
                '$amount', // Payouts usually recorded as negative or positive? Design says negative to balance?
                // Correction: Design said "amount: Negative value (or tracks total paid)".
                // If I store payouts as POSITIVE numbers with Type=PAYOUT, then:
                // Balance = Earnings(Pending+Paid) - Payouts(Paid).
                // But usually, PENDING earnings are not withdrawable.
                // So Withdrawable Balance = Earning(Paid/Cleared) - Payouts.
                // However, my system marks Earnings as PAID when Payout happens.
                // So...
                // Pending Balance = Sum of Listings where Status = PENDING.
                // Total Earned (Lifetime) = Sum of Listings where Status = PAID.
                // Wait, if I mark Earning as PAID, it means it's been paid out.
                // So "Total Paid Out" is also Sum of Earnings(PAID).
                // Let's stick to the simpler metric for now:
                // Pending = Money waiting to be paid.
                // Paid = Money already transferred.
                0,
              ],
            },
          },
        },
      },
    ]);

    return (
      stats[0] || {
        totalEarned: 0,
        pendingBalance: 0,
      }
    );
  }
}
