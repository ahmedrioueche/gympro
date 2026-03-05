import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GymMembershipSchema } from '../gym-membership/membership.schema';
import { GymSchema } from '../gym/gym.schema';
import { UsersModule } from '../users/users.module';
import { InventoryController } from './inventory.controller';
import { EquipmentItemModel, EquipmentItemSchema } from './inventory.schema';
import { InventoryService } from './inventory.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: EquipmentItemModel.name, schema: EquipmentItemSchema },
      { name: 'GymMembership', schema: GymMembershipSchema },
      { name: 'GymModel', schema: GymSchema },
    ]),
    UsersModule,
  ],
  controllers: [InventoryController],
  providers: [InventoryService],
  exports: [InventoryService],
})
export class InventoryModule {}
