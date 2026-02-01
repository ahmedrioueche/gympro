export interface CreateEditorDto {
  email: string;
  password?: string;
  username: string;
  fullName: string;
  appPermissions?: string[];
}
