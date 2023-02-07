import { user_user as User } from "@prisma/client";

export interface ICreateUserPayload {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  emailOtpCode: string;
  lastDayStreak: Date;
  isReferred?: boolean;
  referrerId?: string;
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