import { Prisma } from "@prisma/client";
import { Service } from "typedi";
import { prisma } from "..";
import { ICreateUserPayload } from "../../interfaces";

interface IFindOptions {
  select?: Prisma.user_userSelect;
  include?: Prisma.user_userInclude;
}

@Service()
export class User {
  async create(payload: ICreateUserPayload) {
    let data: any = {
      fullName: payload.fullName,
      email: payload.email,
      phone: payload.phone,
      password: payload.password,
      emailOtpCode: payload.emailOtpCode,
      lastDayStreak: payload.lastDayStreak,
      isReferred: payload.isReferred,
    };

    if (payload.referrerId) {
      data.referrer = {
        connect: {
          id: payload.referrerId,
        },
      };
    }

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
}
