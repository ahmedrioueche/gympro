import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GymSchema } from '../gym/gym.schema';
import { GymMembershipSchema } from '../gymMembership/membership.schema';
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
  ],
  controllers: [InventoryController],
  providers: [InventoryService],
  exports: [InventoryService],
})
export class InventoryModule {}
