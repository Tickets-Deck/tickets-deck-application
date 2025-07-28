export interface PasswordResetLinkRequest {
  email: string;
}

export interface PasswordResetRequest {
  userId: string;
  password: string;
  token: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}
