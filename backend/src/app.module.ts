import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { PlatformMiddleware } from './common/middleware/platform.middleware';
import { AppBillingModule } from './modules/appBilling/appBilling.module';
import { AuthModule } from './modules/auth/auth.module';
import { GymModule } from './modules/gym/gym.module';
import { MembershipModule } from './modules/gymMembership/membership.module';
import { SmsModule } from './modules/sms/sms.module';
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

    AuthModule,
    UsersModule,
    GymModule,
    SmsModule,
    MembershipModule,
    AppBillingModule,
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
