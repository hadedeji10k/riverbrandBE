import { Service } from "typedi";
import axios from "axios";
import { ApiError, generateOTP, jwt, Message, password } from "../utils";
import { User } from "../database/repository";
import {
  EmailOptions,
  EmailType,
  IChangePassword,
  IConfirmEmailPayload,
  IContactUsPayload,
  IForgotPasswordReset,
  IRequestEmailConfirmationPayload,
  IRequestForgotPassword,
  ISignInPayload,
  ISignUpPayload,
  IUser,
} from "../interfaces";
import { Mailer } from "../utils/mailing";
import { environment } from "../config/environment";
import { startOfDay } from "date-fns";

@Service()
export class AuthService {
  constructor(
    private readonly user: User,
    private readonly mail: Mailer,
  ) { }

  public async signUp(payload: ISignUpPayload) {
    const emailExists = await this.user.findByEmail(payload.email);
    if (emailExists) {
      throw new ApiError(Message.emailAlreadyRegistered, 409);
    }

    const phoneExists = await this.user.findByPhoneNumber(payload.phone);
    if (phoneExists) {
      throw new ApiError(Message.phoneAlreadyRegistered, 409);
    }

    const passwordHash = await password.hash(payload.password);
    const otpCode = generateOTP({ type: "num", length: 6 });

    const user = await this.user.create({
      ...payload,
      isReferred: payload.referralCode?.toLowerCase() ? true : false,
      password: passwordHash,
      emailOtpCode: otpCode,
      lastDayStreak: startOfDay(new Date()),
    });

    await this._sendEmailConfirmation(user, user.emailOtpCode);

    return {
      token: await jwt.sign({ id: user.id }),
    };
  }

  public async adminSignIn(payload: ISignInPayload) {

    const user = await this.user.findByEmail(payload.email);
    if (!user) {
      throw new ApiError(Message.userNotFound, 401);
    }

    if (user.isSuspended) {
      throw new ApiError(Message.userSuspended, 401);
    }

    if (!user.emailConfirmed) {
      throw new ApiError(Message.emailNotVerified, 403);
    }

    const isValidPassword = await password.verify(payload.password, user.password);
    if (!isValidPassword) {
      throw new ApiError(Message.invalidPassword, 400);
    }

    if (user.role !== "ADMIN") {
      throw new ApiError(Message.signInUserNotAdmin, 401);
    }

    return {
      token: await jwt.sign({ id: user.id }),
    };
  }

  public async signIn(payload: ISignInPayload) {
    const user = await this.user.findByEmail(payload.email);
    if (!user) {
      throw new ApiError(Message.userNotFound, 401);
    }

    if (user.isSuspended) {
      throw new ApiError(Message.userSuspended, 401);
    }

    if (!user.emailConfirmed) {
      throw new ApiError(Message.emailNotVerified, 403);
    }

    const isValidPassword = await password.verify(payload.password, user.password);
    if (!isValidPassword) {
      throw new ApiError(Message.invalidPassword, 400);
    }

    return {
      token: await jwt.sign({ id: user.id }),
    };
  }

  public async requestForgotPassword(payload: IRequestForgotPassword) {
    const user = await this.user.findByEmail(payload.email);
    if (!user) {
      throw new ApiError(Message.userNotFound, 404);
    }

    const otpCode = generateOTP({ type: "num", length: 6 });
    await this.user.updateUser({ id: user.id }, { passwordOtpCode: otpCode });

    const options: EmailOptions = {
      recipient: user.email,
      context: {
        name: user.fullName.split(" ")[0],
        activationCode: parseInt(otpCode),
      },
    };

    await this.mail.sendEmail(EmailType.USER_FORGET_PASSWORD, options);

    return { otpCode };
  }

  public async resetForgotPassword(payload: IForgotPasswordReset) {
    const user = await this.user.findByEmail(payload.email);

    if (!user) {
      throw new ApiError(Message.userNotFound, 404);
    }

    if (user.passwordOtpCode !== payload.otpCode) {
      throw new ApiError(Message.invalidOtp, 400);
    }

    if (await password.verify(payload.password, user.password)) {
      throw new ApiError(Message.passwordIsSameAsOld, 400);
    }

    const passwordHash = await password.hash(payload.password);
    await this.user.updateUser(
      { id: user.id },
      {
        password: passwordHash,
        passwordOtpCode: null,
      }
    );

    const options: EmailOptions = {
      recipient: user.email,
      context: {
        name: user.fullName.split(" ")[0],
      },
    };

    await this.mail.sendEmail(EmailType.PASSWORD_CHANGE, options);

    return;
  }

  public async changePassword(payload: IChangePassword) {
    const user = await this.user.findByEmail(payload.email);

    if (!user) {
      throw new ApiError(Message.userNotFound, 404);
    }

    if (await password.verify(payload.newPassword, user.password)) {
      throw new ApiError(Message.passwordIsSameAsOld, 400);
    }

    if (!(await password.verify(payload.oldPassword, user.password))) {
      throw new ApiError(Message.oldPasswordNotCorrect, 400);
    }

    const passwordHash = await password.hash(payload.newPassword);
    await this.user.updateUser(
      { id: user.id },
      {
        password: passwordHash,
        passwordOtpCode: null,
      }
    );

    const options: EmailOptions = {
      recipient: user.email,
      context: {
        name: user.fullName.split(" ")[0],
      },
    };

    await this.mail.sendEmail(EmailType.PASSWORD_CHANGE, options);

    return;
  }

  public async requestEmailConfirmation(payload: IRequestEmailConfirmationPayload) {
    const user = await this.user.findByEmail(payload.email);

    if (!user) {
      throw new ApiError("Email has not been registered", 404);
    }
    if (user.emailConfirmed) {
      throw new ApiError("Email has already been confirmed", 409);
    }

    await this._sendEmailConfirmation(user);
  }

  public async completeEmailConfirmation(payload: IConfirmEmailPayload) {
    const user = await this.user.findByEmail(payload.email);

    if (!user) {
      throw new ApiError("User does not exists", 404);
    }
    if (!user.emailOtpCode) {
      throw new ApiError("Email confirmation token is invalid", 400);
    }

    if (payload.otpCode !== user.emailOtpCode) {
      throw new ApiError("Email confirmation token is invalid", 400);
    }

    await this.user.updateUser(
      { id: user.id },
      {
        emailConfirmed: true,
        emailOtpCode: null,
      }
    );
  }

  private async _sendEmailConfirmation(user: IUser, otpCode?: string | null) {
    if (!otpCode) {
      otpCode = generateOTP({ type: "num", length: 6 });
      await this.user.updateUser({ id: user.id }, { emailOtpCode: otpCode });
    }

    const options: EmailOptions = {
      recipient: user.email,
      context: {
        name: user.fullName.split(" ")[0],
        activationCode: parseInt(otpCode),
      },
    };

    await this.mail.sendEmail(EmailType.ACCOUNT_CREATION, options);
  }

  public async contactUsForm(payload: IContactUsPayload) {
    const options: EmailOptions = {
      recipient: "info@gatewayapp.co",
      context: {
        name: payload.name.split(" ")[0],
        message: payload.message,
        email: payload.email,
      },
    };

    await this.mail.sendEmail(EmailType.CONTACT_US, options);
  }
}
