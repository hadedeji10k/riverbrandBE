import { Prisma } from "@prisma/client";
import { addMinutes } from "date-fns";
import { Service } from "typedi";
import { prisma } from "..";
import { ICreateUserPayload, IUser } from "../../interfaces";

interface IFindOptions {
  select?: Prisma.user_userSelect;
  include?: Prisma.user_userInclude;
}

@Service()
export class User {
  async create(payload: ICreateUserPayload) {
    let data: any = {
      first_name: payload.first_name,
      last_name: payload.last_name,
      email: payload.email,
      phone: payload.phone,
      password: payload.password,
      username: payload.username || payload.first_name,
      user_type: "user"
    };

    // if (payload.referrerId) {
    //   data.referrer = {
    //     connect: {
    //       id: payload.referrerId,
    //     },
    //   };
    // }

    return await prisma.user_user.create({ data });
  }

  async findOne(where: Prisma.user_userWhereInput, options?: IFindOptions) {
    return await prisma.user_user.findFirst({ where: { ...where }, ...options });
  }

  public async findByEmail(email: string, options?: IFindOptions) {
    return await this.findOne({ email }, options);
  }

  public async findById(id: number, options?: IFindOptions) {
    return await this.findOne({ id }, options);
  }

  public async findByUsername(username: string, options?: IFindOptions) {
    return await this.findOne({ username }, options);
  }

  public async findByPhoneNumber(phone: string, options?: IFindOptions) {
    return await this.findOne({ phone }, options);
  }

  public async updateUser(where: Prisma.user_userWhereUniqueInput, data: Prisma.user_userUpdateInput) {
    return await prisma.user_user.update({ where: { ...where }, data: { ...data } });
  }

  public async findMany(where: Prisma.user_userWhereUniqueInput, data: Prisma.user_userFindManyArgs) {
    return await prisma.user_user.findMany({ where: { ...where }, ...data });
  }

  public async totalUsers(where?: Prisma.user_userWhereInput) {
    return await prisma.user_user.count({
      where: {
        ...where,
      },
    });
  }

  async totalUserReferrals(id: number) {
    const result = await this.findOne(
      { id },
      {
        select: {
          _count: {
          },
        },
      }
    );

    // @ts-expect-error
    return result ? <number>result._count : 0;
  }

  async createOrUpdateVerificationCode(user: IUser, type: "email" | "password" | "phone" | "pin", code: string, valid: boolean) {
    let data: any = {
      user_user: { connect: { id: user.id } },
      code,
      validity: addMinutes(new Date(), 10),
      valid
    };

    let updateData = {
      code,
      validity: addMinutes(new Date(), 10),
      valid
    }

    if (type === "email" || type === "phone") {
      const findUser = await prisma.user_usersverification.findFirst({ where: { user_id: user.id } })

      if (findUser) {
        return await prisma.user_usersverification.update({ where: { id: findUser.id }, data: updateData })
      } else {
        return await prisma.user_usersverification.create({ data });
      }
    } else if (type === "password") {
      const findUser = await prisma.user_userpasswordverification.findFirst({ where: { user_id: user.id } })

      if (findUser) {
        return await prisma.user_userpasswordverification.update({ where: { id: findUser.id }, data: updateData })
      } else {
        return await prisma.user_userpasswordverification.create({ data });
      }
    } else if (type === "pin") {
      const findUser = await prisma.user_userspinverification.findFirst({ where: { user_id: user.id } })

      if (findUser) {
        return await prisma.user_userspinverification.update({ where: { id: findUser.id }, data: updateData })
      } else {
        return await prisma.user_userspinverification.create({ data });
      }
    }

  }

  async findVerificationCode(user: IUser, type: "email" | "password" | "phone" | "pin") {
    let data: {
      code: string,
      valid: boolean,
      validity: Date
    } | null = null;
    if (type === "email" || type === "phone") {
      data = await prisma.user_usersverification.findFirst({ where: { user_id: user.id } })
    } else if (type === "password") {
      data = await prisma.user_userpasswordverification.findFirst({ where: { user_id: user.id } })
    } else if (type === "pin") {
      data = await prisma.user_userspinverification.findFirst({ where: { user_id: user.id } })
    }

    return data
  }

  async findUserPin(where: Prisma.user_transaction_pinWhereInput, options?: any) {
    return await prisma.user_transaction_pin.findFirst({ where: { ...where }, ...options });
  }

  async createOrUpdateTransactionPin(user: IUser, pin: string) {
    let data: any = {
      user_user: { connect: { id: user.id } },
      pin,
    };

    let updateData = {
      pin
    }

    const findUser = await this.findUserPin({ user_id: user.id })

    if (findUser) {
      return await prisma.user_transaction_pin.update({ where: { id: findUser.id }, data: updateData })
    } else {
      return await prisma.user_transaction_pin.create({ data });
    }
  }
}
