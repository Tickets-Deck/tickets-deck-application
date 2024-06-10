export interface PasswordResetLinkRequest {
  email: string;
  // hostUrl: string
}

export interface PasswordResetRequest {
  token: string;
  newPassword: string;
}