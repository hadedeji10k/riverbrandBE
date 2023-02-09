import { Service } from "typedi";
import sanitize from "sanitize-html";
import { Config, User } from "../database/repository";
import {
  ICompleteProfilePayload,
  IUnsuspendUser,
  IPagination,
  ISuspendUser,
  IUpdatePassword,
  IUser,
} from "../interfaces";
import {
  IRequestPhoneNumberVerification,
  ISetProfilePicture,
  IUpdateUser,
  IUpdateUserAddress,
  IVerifyUserPhoneNumber,
} from "../interfaces";
import { ApiError, generateOTP, Message, password, Sms } from "../utils";
import { environment } from "../config/environment";
import { addMinutes, isFuture, startOfDay } from "date-fns";
import { dateInterval } from "../utils/dateInterval";

@Service()
export class UserService {
  constructor(
    private readonly user: User,
    private readonly sms: Sms,
    private readonly config: Config
  ) { }

  public async completeProfile(payload: ICompleteProfilePayload, user: IUser) {
    const foundUser = await this.user.findByUsername(payload.username.toLowerCase());

    if (foundUser && foundUser.id !== user.id) {
      throw new ApiError(Message.usernameAlreadyInUse, 409);
    }

    await this.user.updateUser(
      { id: user.id },
      {
        username: payload.username.toLowerCase(),
      }
    );
    return;
  }

  public async setProfilePicture(payload: ISetProfilePicture, user: IUser) {
    await this.user.updateUser({ id: user.id }, { avatar: payload.imageUrl });
    return { profilePicture: payload.imageUrl };
  }

  public async requestPhoneNumberVerification(user: IUser) {
    if (user.phone) {
      throw new ApiError(Message.phoneVerified, 409);
    }

    const otpCode = generateOTP({ type: "num", length: 6 });

    const body = `Your One Time Password (OTP) for RiverBrand phone number verification is ${otpCode}. Expires in 10 mins. If you did not request for this, kindly ignore this message. NOTE: Do not share your OTP with anyone.`;

    await this.sms.send({
      body,
      to: user.phone!,
      service: "twilio",
    });

    const data = {
      phone: user.phone!,
      phoneOtpCode: otpCode,
      phoneConfirmed: false,
      otpExpiryDate: addMinutes(new Date(), 10),
    };

    await this.user.updateUser({ id: user.id }, data);

    return { otpCode: environment.isTestEnv ? otpCode : undefined };
  }

  public async resendPhoneNumberOtp(payload: IRequestPhoneNumberVerification) {
    const user = await this.user.findByEmail(payload.email);

    if (!user) {
      throw new ApiError(Message.userNotFound);
    }

    if (user.phone) {
      throw new ApiError(Message.phoneVerified, 409);
    }

    if (user.phone) {
      const otpCode = generateOTP({ type: "num", length: 6 });

      const body = `Your One Time Password (OTP) for RiverBrand phone number verification is ${otpCode}. Expires in 10 mins. If you did not request for this, kindly ignore this message. NOTE: Do not share your OTP with anyone.`;

      await this.sms.send({
        body,
        to: user.phone,
        service: "twilio",
      });

      const data = {
        // phoneOtpCode: otpCode,
        // phoneConfirmed: false,
        // otpExpiryDate: addMinutes(new Date(), 10),
      };

      await this.user.updateUser({ id: user.id }, data);

      return { otpCode: environment.isTestEnv ? otpCode : undefined };
    }

    return;
  }

  public async verifyPhoneNumber(payload: IVerifyUserPhoneNumber) {
    const user = await this.user.findByEmail(payload.email);

    if (!user) {
      throw new ApiError(Message.userNotFound);
    }

    if (user.phone) {
      throw new ApiError(Message.phoneVerified, 409);
    }

    // if (!isFuture(user.otpExpiryDate || new Date())) {
    //   throw new ApiError(Message.otpExpired, 400);
    // }

    // if (user.phoneOtpCode !== payload.phoneOtpCode) {
    //   throw new ApiError(Message.invalidOtp, 400);
    // }

    const data = {
      // lastDayStreak: startOfDay(new Date()),
      // currentDayStreak: 1,
      // phoneConfirmed: true,
      // phoneOtpCode: null,
      // otpExpiryDate: null,
    };

    await this.user.updateUser({ id: user.id }, data);

    return;
  }

  // public async updateUserAddress(payload: IUpdateUserAddress, user: IUser) {
  //   const userObj = {
  //     line1: payload.line1 ? sanitize(payload.line1) : user.line1,
  //     city: payload.city ? sanitize(payload.city) : user.city,
  //     state: payload.state ? sanitize(payload.state) : user.state,
  //     country: payload.country ? sanitize(payload.country) : user.country,
  //   };

  //   await this.user.updateUser({ id: user.id }, userObj);

  //   return;
  // }

  public async updateUser(payload: IUpdateUser, user: IUser) {
    const userObj = {
      avatar: payload.imageUrl ? payload.imageUrl : user.avatar,
      username: payload.username?.toLowerCase(),
    };

    await this.user.updateUser({ id: user.id }, userObj);
    return;
  }

  public async updateUserPassword(payload: IUpdatePassword, user: IUser) {
    const isValidPassword = await password.verify(payload.oldPassword, user.password);

    if (!isValidPassword) {
      throw new ApiError(`${Message.invalidPassword} or incorrect`, 400);
    }

    if (await password.verify(payload.newPassword, user.password)) {
      throw new ApiError(Message.passwordIsSameAsOld, 400);
    }

    const passwordHash = await password.hash(payload.newPassword);

    const userObj = {
      password: passwordHash,
    };

    await this.user.updateUser({ id: user.id }, userObj);
    return;
  }

  public async makeUserAdmin(payload: { email: string }) {
    const user = await this.user.findByEmail(payload.email);
    if (!user) {
      throw new ApiError(Message.userNotFound, 404);
    }
    // await this.user.updateUser({ id: user.id }, { role: "ADMIN" });
    return;
  }

  public async makeAdminUser(payload: { email: string }) {
    const user = await this.user.findByEmail(payload.email);
    if (!user) {
      throw new ApiError(Message.userNotFound, 404);
    }
    // await this.user.updateUser({ id: user.id }, { role: "USER" });
    return;
  }

  public async getUserData(userId: number) {

    return await this.user.findById(userId);
  }

  public async getUserStatistics() {
    const date = new Date();
    const dateObj = dateInterval(date);

    const allUsers = await this.user.totalUsers();

    // const referredUsers = await this.user.totalUsers({ referral_code: null  });

    // const normalUsers = await this.user.totalUsers({ isReferred: false });

    // const totalUsersLastMonth = await this.user.totalUsers({
    //   createdAt: {
    //     gte: new Date(dateObj.startOfLastMonth),
    //     lt: new Date(dateObj.startOfThisMonth),
    //   },
    // });

    // const referredUsersPercentage = ((referredUsers / allUsers) * 100).toFixed(2);
    // const normalUsersPercentage = ((normalUsers / allUsers) * 100).toFixed(2);

    // const totalUsersThisMonth = await this.user.totalUsers({
    //   createdAt: {
    //     gte: new Date(dateObj.startOfThisMonth),
    //     lt: date,
    //   },
    // });

    return {
      allUsers,
      // referredUsers,
      // normalUsers,
      // referredUsersPercentage,
      // normalUsersPercentage,
      // totalUsersLastMonth,
      // totalUsersThisMonth,
    };
  }

  public async suspendUser(payload: ISuspendUser) {
    {
      const user = await this.user.findById(payload.id);
      if (!user) throw new ApiError(Message.userNotFound, 404);

      if (!user.access) throw new ApiError(Message.userAlreadySuspended, 400);
    }

    await this.user.updateUser(
      { id: payload.id },
      {
        access: false,
      }
    );
  }

  public async unsuspendUser(payload: IUnsuspendUser) {
    {
      const user = await this.user.findById(payload.id);
      if (!user) throw new ApiError(Message.userNotFound, 404);

      if (user.access) throw new ApiError(Message.userAlreadyEnabled, 400);
    }

    await this.user.updateUser(
      { id: payload.id },
      {
        access: true,
      }
    );
  }

  public async getUsers(payload: IPagination) {
    const currentPage = parseInt(payload?.pageNumber || "1");
    const limit = parseInt(payload?.pageSize || "20");
    const skip = limit * (currentPage - 1);

    const totalCount = await this.user.totalUsers();

    const totalPages = Math.ceil(totalCount / limit);
    const hasPrevious = currentPage > 1 && totalPages > 1;
    const hasNext = currentPage < totalPages;

    const users = await this.user.findMany({}, { orderBy: { id: "desc" }, take: limit, skip });

    return {
      result: users,
      currentPage,
      pageSize: limit,
      totalPages,
      totalCount,
      hasPrevious,
      hasNext,
    };
  }
}
