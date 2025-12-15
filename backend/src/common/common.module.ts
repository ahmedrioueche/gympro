import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SmsService } from 'src/modules/sms/sms.service';
import { I18nService } from './i18n/i18n.service';
import { GeminiService } from './services/gemini.service';
import { MailerService } from './services/mailer.service';
import { NotificationService } from './services/notification.service';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    GeminiService,
    NotificationService,
    I18nService,
    SmsService,
    MailerService,
  ],
  exports: [
    GeminiService,
    NotificationService,
    I18nService,
    SmsService,
    MailerService,
  ],
})
export class CommonModule {}
