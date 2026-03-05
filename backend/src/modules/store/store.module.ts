import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GymMembershipSchema } from '../gym-membership/membership.schema';
import { GymSchema } from '../gym/gym.schema';
import { UsersModule } from '../users/users.module';
import { ProductModel, ProductSchema } from './product.schema';
import { StoreController } from './store.controller';
import { StoreService } from './store.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ProductModel.name, schema: ProductSchema },
      { name: 'GymModel', schema: GymSchema },
      { name: 'GymMembership', schema: GymMembershipSchema },
    ]),
    UsersModule,
  ],
  controllers: [StoreController],
  providers: [StoreService],
  exports: [StoreService],
})
export class StoreModule {}
