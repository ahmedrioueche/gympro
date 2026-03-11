export interface CreateEditorDto {
  email: string;
  password?: string;
  username: string;
  fullName: string;
  appPermissions?: import("../constants/permissions").AppPermission[];
}

export interface UpdateEditorDto {
  email?: string;
  password?: string;
  username?: string;
  fullName?: string;
  appPermissions?: import("../constants/permissions").AppPermission[];
}
