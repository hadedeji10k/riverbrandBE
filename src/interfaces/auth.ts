export interface ISignUpPayload {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  referralCode?: string;
}

export interface ISignInPayload {
  captchaToken: string;
  email: string;
  password: string;
}

export interface IRequestForgotPassword {
  email: string;
}

export interface IForgotPasswordReset {
  email: string;
  otpCode: string;
  password: string;
}

export interface IChangePassword {
  email: string;
  newPassword: string;
  oldPassword: string;
}

export interface IRequestEmailConfirmationPayload {
  email: string;
}

export interface IConfirmEmailPayload {
  email: string;
  otpCode: string;
}

export interface IContactUsPayload {
  email: string;
  name: string;
  message: string;
}
