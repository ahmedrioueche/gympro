import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppFeaturePackageController } from './feature-package.controller';
import {
  AppFeaturePackageModel,
  AppFeaturePackageSchema,
} from './feature-package.schema';
import { AppFeaturePackageService } from './feature-package.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AppFeaturePackageModel.name, schema: AppFeaturePackageSchema },
    ]),
  ],
  providers: [AppFeaturePackageService],
  controllers: [AppFeaturePackageController],
  exports: [AppFeaturePackageService],
})
export class AppFeaturePackageModule {}
