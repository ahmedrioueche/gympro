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
    I18nService,
    SmsService,
    MailerService,
    NotificationService,
  ],
  exports: [
    GeminiService,
    I18nService,
    SmsService,
    MailerService,
    NotificationService,
  ],
})
export class CommonModule {}
