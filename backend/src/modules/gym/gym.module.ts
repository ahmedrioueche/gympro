import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../../common/schemas/user.schema';
import { GymController } from './gym.controller';
import { GymModel, GymSchema } from './gym.schema';
import { GymService } from './gym.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: GymModel.name, schema: GymSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [GymController],
  providers: [GymService],
  exports: [GymService],
})
export class GymModule {}
