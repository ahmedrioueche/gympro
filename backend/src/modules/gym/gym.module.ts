import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GymController } from './gym.controller';
import { GymModel, GymSchema } from './gym.schema';
import { GymService } from './gym.service';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: GymModel.name, schema: GymSchema }]),
    ],
    controllers: [GymController],
    providers: [GymService],
    exports: [GymService],
})
export class GymModule { }
