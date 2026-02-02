import { AppPermission as AppPermissionType } from '@ahmedrioueche/gympro-client';
import { SetMetadata } from '@nestjs/common';

export const AppPermission = (permission: AppPermissionType) =>
  SetMetadata('app_permission', permission);
