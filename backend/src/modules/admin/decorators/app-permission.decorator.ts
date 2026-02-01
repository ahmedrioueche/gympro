import { SetMetadata } from '@nestjs/common';

export const AppPermission = (permission: string) =>
  SetMetadata('app_permission', permission);
