import { Service } from "typedi";
import { UserService } from "../../services";
import { Message, response } from "../../utils";
import { FastifyReply, FastifyRequest } from "fastify";
import {
  ICompleteProfilePayload,
  IRequestPhoneNumberVerification,
  ISetProfilePicture,
  IUpdatePassword,
  IUpdateUser,
  IUpdateUserAddress,
  IPagination,
  IVerifyUserPhoneNumber,
} from "../../interfaces";

@Service()
export class UserController {
  constructor(
    private readonly userService: UserService,
  ) { }

  public async completeProfile(request: FastifyRequest, reply: FastifyReply) {
    const { body, user }: { [key: string]: any } = request;

    const payload: ICompleteProfilePayload = {
      username: body.username,
      interest: body.interest,
    };

    const data = await this.userService.completeProfile(payload, user);
    return response.success(reply, {
      message: "Profile completed successfully",
      data,
    });
  }

  public async getCurrentUser(request: FastifyRequest, reply: FastifyReply) {
    const { user }: { [key: string]: any } = request;

    const data = {
      id: user.id,
      fullName: user.fullName,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      interests: user.interests,
      referralCode: user.myReferralCode,
      phoneNumberVerified: user.phoneConfirmed,
    };

    return response.success(reply, {
      message: "User fetched successfully",
      data,
    });
  }

  public async getUserDashboard(request: FastifyRequest, reply: FastifyReply) {
    const { user }: { [key: string]: any } = request;


    const data = {
      currentDayStreak: user.currentDayStreak,
      joinedAt: user.createdAt,
    };

    return response.success(reply, {
      message: Message.userDashboardFetched,
      data,
    });
  }

  public async setProfilePicture(request: FastifyRequest, reply: FastifyReply) {
    const { body, user }: { [key: string]: any } = request;

    const payload: ISetProfilePicture = {
      imageUrl: body.imageUrl,
    };

    const data = await this.userService.setProfilePicture(payload, user);
    return response.success(reply, {
      message: Message.profilePicUpdated,
      data,
    });
  }

  public async requestPhoneNumberVerification(request: FastifyRequest, reply: FastifyReply) {
    const { user }: { [key: string]: any } = request;

    const data = await this.userService.requestPhoneNumberVerification(user);
    return response.success(reply, { message: Message.phoneOtpSent, data });
  }

  public async resendPhoneNumberOtp(request: FastifyRequest, reply: FastifyReply) {
    const { body, user }: { [key: string]: any } = request;

    const payload: IRequestPhoneNumberVerification = {
      email: body.email,
      phone: body.phone,
    };

    const data = await this.userService.resendPhoneNumberOtp(payload);
    return response.success(reply, { message: Message.phoneOtpSent, data });
  }

  public async verifyPhoneNumber(request: FastifyRequest, reply: FastifyReply) {
    const { body }: { [key: string]: any } = request;

    const payload: IVerifyUserPhoneNumber = {
      email: body.email,
      phoneOtpCode: body.phoneOtpCode,
    };

    const data = await this.userService.verifyPhoneNumber(payload);
    return response.success(reply, {
      message: Message.phoneNumberVerified,
      data,
    });
  }

  // public async updateUserAddress(request: FastifyRequest, reply: FastifyReply) {
  //   const { body, user }: { [key: string]: any } = request;

  //   const payload: IUpdateUserAddress = {
  //     line1: body.line1,
  //     city: body.city,
  //     state: body.state,
  //     country: body.country,
  //   };

  //   const data = await this.userService.updateUserAddress(payload, user);
  //   return response.success(reply, {
  //     message: Message.userAddressUpdated,
  //     data,
  //   });
  // }

  public async updateUser(request: FastifyRequest, reply: FastifyReply) {
    const { body, user }: { [key: string]: any } = request;

    const payload: IUpdateUser = {
      interests: body.interests,
      username: body.username,
      imageUrl: body.imageUrl,
    };

    const data = await this.userService.updateUser(payload, user);
    return response.success(reply, {
      message: Message.userProfileUpdated,
      data,
    });
  }

  public async updateUserPassword(request: FastifyRequest, reply: FastifyReply) {
    const { body, user }: { [key: string]: any } = request;

    const payload: IUpdatePassword = {
      newPassword: body.newPassword,
      oldPassword: body.oldPassword,
    };

    const data = await this.userService.updateUserPassword(payload, user);
    return response.success(reply, {
      message: Message.userProfileUpdated,
      data,
    });
  }

  public async makeUserAdmin(request: FastifyRequest, reply: FastifyReply) {
    const { body, user }: { [key: string]: any } = request;

    const payload = {
      email: body.email,
    };

    const data = await this.userService.makeUserAdmin(payload);
    return response.success(reply, {
      message: Message.userProfileUpdated,
      data,
    });
  }

  public async makeAdminUser(request: FastifyRequest, reply: FastifyReply) {
    const { body, user }: { [key: string]: any } = request;

    const payload = {
      email: body.email,
    };

    const data = await this.userService.makeAdminUser(payload);
    return response.success(reply, {
      message: Message.userProfileUpdated,
      data,
    });
  }

  public async suspendUser(request: FastifyRequest, reply: FastifyReply) {
    const { body, user }: { [key: string]: any } = request;

    const payload = {
      id: body.userId,
    };

    const data = await this.userService.suspendUser(payload, user);
    return response.success(reply, { message: Message.userSuspendedSuccess, data });
  }

  public async unsuspendUser(request: FastifyRequest, reply: FastifyReply) {
    const { body, user }: { [key: string]: any } = request;

    const payload = {
      id: body.userId,
    };

    const data = await this.userService.unsuspendUser(payload, user);
    return response.success(reply, { message: Message.userEnableSuccess, data });
  }

  public async getUsers(request: FastifyRequest, reply: FastifyReply) {
    const { query }: { [key: string]: any } = request;

    const payload: IPagination = {
      pageSize: query.pageSize,
      pageNumber: query.pageNumber,
    };

    const data = await this.userService.getUsers(payload);
    return response.success(reply, { message: Message.usersFetchedSuccess, data });
  }
}
