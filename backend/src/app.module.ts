import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonModule } from './common/common.module';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { PlatformMiddleware } from './common/middleware/platform.middleware';
import { AdminModule } from './modules/admin/admin.module';
import { AiModule } from './modules/ai/ai.module';
import { AlertsModule } from './modules/alerts/alerts.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { AppBillingModule } from './modules/app-billing/appBilling.module';
import { AttendanceModule } from './modules/attendance/attendance.module';
import { AuthModule } from './modules/auth/auth.module';
import { ChargilyModule } from './modules/chargily/chargily.module';
import { CoachModule } from './modules/coach/coach.module';
import { CompetitionModule } from './modules/competition/competition.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { ExercisesModule } from './modules/exercises/exercises.module';
import { GymAnnouncementModule } from './modules/gym-announcement/gym-announcement.module';
import { GymClassModule } from './modules/gym-class/gymClass.module';
import { GymCoachPaymentModule } from './modules/gym-coach-payment/gym-coach-payment.module';
import { GymCoachModule } from './modules/gym-coach/gym-coach.module';
import { MembershipModule } from './modules/gym-membership/membership.module';
import { GymSubscriptionModule } from './modules/gym-subscription/gymSubscription.module';
import { GymModule } from './modules/gym/gym.module';
import { InventoryModule } from './modules/inventory/inventory.module';
import { MemberAnalyticsModule } from './modules/member-analytics/member-analytics.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { PaddleModule } from './modules/paddle/paddle.module';
import { ProgressModule } from './modules/progress/progress.module';
import { ReportsModule } from './modules/reports/reports.module';
import { SessionsModule } from './modules/sessions/sessions.module';
import { SettingsModule } from './modules/settings/settings.module';
import { SmsModule } from './modules/sms/sms.module';
import { StoreModule } from './modules/store/store.module';
import { SystemAlertsModule } from './modules/system-alerts/system-alerts.module';
import { TrainingModule } from './modules/training/training.module';
import { UploadModule } from './modules/upload/upload.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    // Load environment variables
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000, // 1 second
        limit: 5, // 5 requests per second
      },
      {
        name: 'medium',
        ttl: 60000, // 1 minute
        limit: 100, // 100 requests per minute
      },
      {
        name: 'long',
        ttl: 900000, // 15 minutes
        limit: 1000, // 1000 requests per 15 minutes
      },
    ]),

    // Connect to MongoDB
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri:
          configService.get<string>('MONGODB_URI') ||
          'mongodb://localhost:27017/gympro',
      }),
      inject: [ConfigService],
    }),

    ScheduleModule.forRoot(),
    EventEmitterModule.forRoot(),

    AuthModule,
    UsersModule,
    GymModule,
    SmsModule,
    MembershipModule,
    AppBillingModule,
    SettingsModule,
    CommonModule,
    ChargilyModule,
    PaddleModule,
    NotificationsModule,
    AnalyticsModule,
    AttendanceModule,
    TrainingModule,
    ExercisesModule,
    AiModule,
    ProgressModule,
    GymSubscriptionModule,
    DashboardModule,
    CoachModule,
    SessionsModule,
    GymCoachModule,
    GymCoachPaymentModule,
    GymAnnouncementModule,
    AdminModule,
    ReportsModule,
    AlertsModule,
    UploadModule,
    InventoryModule,
    CompetitionModule,
    StoreModule,
    GymClassModule,
    MemberAnalyticsModule,
    SystemAlertsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(PlatformMiddleware, LoggerMiddleware).forRoutes('*');
  }
}
