export interface ISignUpPayload {
  first_name: string;
  last_name: string;
  username: string;
  phone: string;
  country_code: string;
  email: string;
  password: string;
  user_referral_code?: string
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
