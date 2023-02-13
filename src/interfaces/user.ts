import { user_user as User } from "@prisma/client";

export interface ICreateUserPayload {
  first_name: string;
  last_name: string;
  username: string;
  phone: string;
  country_code: string;
  email: string;
  password: string;
  user_referral_code?: string
}

export interface ICompleteProfilePayload {
  username: string;
  interest?: string[];
}

export interface IUser extends User { }

export interface IRequestPhoneNumberVerification {
  email: string;
  phone: string;
}

export interface IVerifyUserPhoneNumber {
  email: string;
  phoneOtpCode: string;
}
export interface ISetProfilePicture {
  imageUrl: string;
}

export interface ISetTransactionPin {
  pin: string;
}

export interface IUpdateTransactionPin {
  oldPin: string;
  newPin: string;
}

export interface IForgotPinReset {
  otpCode: string;
  pin: string;
}

export interface IUpdatePassword {
  newPassword: string;
  oldPassword: string;
}

export interface IUpdateUser {
  interests?: string[];
  imageUrl?: string;
  username?: string;
}

export interface IUpdateUserAddress {
  line1?: string;
  city?: string;
  state?: string;
  country?: string;
}

export interface IGetUser {
  id: number;
}

export interface ISuspendUser extends IGetUser { }
export interface IUnsuspendUser extends IGetUser { }

export interface IPagination {
  pageSize?: string;
  pageNumber?: string;
}