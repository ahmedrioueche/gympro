# SMS Service - Vonage Integration

## Overview

The SMS service provides a clean, reusable interface for sending SMS messages using the Vonage API.

## Setup

### 1. Environment Variables

Add the following to your `.env` file:

```env
VONAGE_API_KEY=40bcc92e
VONAGE_API_SECRET=your_actual_secret_here
VONAGE_FROM_NUMBER=Vonage APIs
```

### 2. Module Registration

The `SmsModule` is already registered in `app.module.ts` and available globally.

## Usage

### Basic Usage

Inject the `SmsService` into any service or controller:

```typescript
import { Injectable } from '@nestjs/common';
import { SmsService } from '../sms/sms.service';

@Injectable()
export class YourService {
  constructor(private readonly smsService: SmsService) {}

  async sendWelcomeSMS(phoneNumber: string) {
    const result = await this.smsService.send(
      phoneNumber, // to: recipient phone number (E.164 format: +213556452962)
      'Vonage APIs', // from: sender name or number
      'Welcome to GymPro!', // text: message content
    );

    if (result.success) {
      console.log('SMS sent successfully:', result.messageId);
    } else {
      console.error('Failed to send SMS:', result.error);
    }

    return result;
  }
}
```

### Using DTO

For better type safety and validation:

```typescript
import { SmsService } from '../sms/sms.service';
import { SendSmsDto } from '../sms/sms.dto';

async sendSMS() {
  const smsData: SendSmsDto = {
    to: '+213556452962',
    from: 'Vonage APIs',
    text: 'Your verification code is: 123456'
  };

  const result = await this.smsService.sendSMS(smsData);
  return result;
}
```

## API Reference

### `SmsService.send(to, from, text)`

Convenience method for sending SMS with individual parameters.

**Parameters:**

- `to` (string): Recipient phone number in E.164 format (e.g., `+213556452962`)
- `from` (string): Sender name or number
- `text` (string): Message content

**Returns:** `Promise<SmsResponse>`

### `SmsService.sendSMS(smsData)`

Send SMS using a DTO object.

**Parameters:**

- `smsData` (SendSmsDto): Object containing `to`, `from`, and `text` fields

**Returns:** `Promise<SmsResponse>`

### `SmsResponse`

```typescript
interface SmsResponse {
  success: boolean;
  messageId?: string; // Present on success
  error?: string; // Present on failure
}
```

## Phone Number Format

For best results, use E.164 format for phone numbers:

- Include country code with `+` prefix
- No spaces or special characters
- Example: `+213556452962` (Algeria)

## Error Handling

The service handles errors gracefully:

- Returns `success: false` with error message if sending fails
- Logs errors for debugging
- Warns if API credentials are not configured

## Example: OTP Verification

```typescript
@Injectable()
export class AuthService {
  constructor(private readonly smsService: SmsService) {}

  async sendOTP(phoneNumber: string, otp: string) {
    const result = await this.smsService.send(
      phoneNumber,
      'GymPro',
      `Your verification code is: ${otp}. Valid for 5 minutes.`,
    );

    if (!result.success) {
      throw new Error(`Failed to send OTP: ${result.error}`);
    }

    return result.messageId;
  }
}
```
