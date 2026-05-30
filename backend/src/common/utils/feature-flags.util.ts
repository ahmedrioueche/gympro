import { ENABLE_PHONE_FEATURES } from '@ahmedrioueche/gympro-client';
import { BadRequestException } from '@nestjs/common';

const PHONE_FEATURES_DISABLED = 'AUTH_021';

export function isPhoneEnabled(): boolean {
  return ENABLE_PHONE_FEATURES;
}

export function assertPhoneEnabled(): void {
  if (!ENABLE_PHONE_FEATURES) {
    throw new BadRequestException({
      message: 'Phone features are disabled',
      errorCode: PHONE_FEATURES_DISABLED,
    });
  }
}
