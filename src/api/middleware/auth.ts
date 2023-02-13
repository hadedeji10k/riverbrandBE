import { differenceInDays, startOfDay } from "date-fns";
import { FastifyReply, FastifyRequest, HookHandlerDoneFunction } from "fastify";
import { Container } from "typedi";
import { environment } from "../../config";
import { User } from "../../database/repository";
import { IUser } from "../../interfaces";
import { ApiError, Message, password, response } from "../../utils";

interface IOptions {
  optional?: boolean;
}

const user = Container.get(User);

function userAuth(options: IOptions = {}) {
  return async (request: FastifyRequest, reply: FastifyReply, done: HookHandlerDoneFunction) => {
    try {
      const data: { id: number } = await request.jwtVerify();

      const userId = Number(data.id)
      const userExists = await user.findById(userId);
      if (!userExists) {
        throw new ApiError(Message.userNotFound, 404);
      }

      request.user = userExists;
    } catch (e) {
      if (!options.optional) {
        done(e as Error);
      }
    }
  };
}

function ensureEmailConfirmed() {
  return async (request: FastifyRequest, reply: FastifyReply, done: HookHandlerDoneFunction) => {
    try {
      const user = request.user as IUser;
      if (!user) {
        throw new ApiError(Message.authenticationRequired, 401);
      }

      if (!user.is_active) {
        throw new ApiError(Message.emailConfirmationRequired, 403);
      }
    } catch (e) {
      done(e as Error);
    }
  };
}

function ensurePhoneConfirmed() {
  return async (request: FastifyRequest, reply: FastifyReply, done: HookHandlerDoneFunction) => {
    try {
      const user = request.user as IUser;
      if (!user) {
        throw new ApiError(Message.authenticationRequired, 401);
      }

      if (!user.phone) {
        throw new ApiError(Message.phoneConfirmationRequired, 403);
      }
    } catch (e) {
      done(e as Error);
    }
  };
}

function ensureUserNotSuspended() {
  return async (request: FastifyRequest, reply: FastifyReply, done: HookHandlerDoneFunction) => {
    try {
      const user = request.user as IUser;
      if (!user) {
        throw new ApiError(Message.authenticationRequired, 401);
      }

      if (!user.is_active) {
        throw new ApiError(Message.userSuspended, 401);
      }
    } catch (e) {
      done(e as Error);
    }
  };
}

function isAdmin(options: IOptions = {}) {
  return async (request: FastifyRequest, _reply: FastifyReply, done: HookHandlerDoneFunction) => {
    try {
      const user = request.user as IUser;
      if (!user) {
        throw new ApiError(Message.authenticationRequired, 401);
      }

      // if (user.role != "ADMIN") {
      //   throw new ApiError(Message.notAuthorized, 401);
      // }
    } catch (e) {
      if (!options.optional) {
        done(e as Error);
      }
    }
  };
}

function clientAuth() {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    if (environment.appStage === "PROD") {
      try {
        const clientType = <string>request.headers["x-client-type"];
        const accessToken = Buffer.from(<string>request.headers["x-access-token"] || "", "base64").toString("utf8");

        if (!clientType || !accessToken) {
          throw new ApiError(Message.notAuthorized, 401);
        }

        if (!environment.clients.includes(clientType.toLowerCase())) {
          throw new ApiError(Message.notAuthorized, 401);
        }

        // we currently have mobile and local clients only
        const platformAccessToken =
          clientType === "web" ? environment.webAccessToken : clientType === "local" ? environment.localAccessToken : "";
        let authenticated = await password.verify(platformAccessToken, accessToken);

        if (!authenticated) {
          throw new ApiError(Message.notAuthorized, 401);
        }
      } catch (e: any) {
        console.log(e.message);
        return response.error(reply, { statusCode: 401, message: Message.notAuthorized });
      }
    }
  };
}

export const auth = { user: userAuth, isAdmin, ensureEmailConfirmed, ensurePhoneConfirmed, ensureUserNotSuspended, clientAuth };
