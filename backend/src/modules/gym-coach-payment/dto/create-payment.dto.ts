import {
  GymCoachPaymentCategory,
  GymCoachPaymentStatus,
  GymCoachPaymentType,
} from '../schemas/gym-coach-payment.schema';

export class CreateGymCoachPaymentDto {
  gymId: string;
  coachId: string;
  amount: number;
  currency: string;
  type: GymCoachPaymentType;
  category: GymCoachPaymentCategory;
  status?: GymCoachPaymentStatus;
  referenceId?: string;
  referenceType?: string;
  description?: string;
  metadata?: Record<string, any>;
}
