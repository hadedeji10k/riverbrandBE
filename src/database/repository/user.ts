import { Prisma } from "@prisma/client";
import { Service } from "typedi";
import { prisma } from "..";
import { ICreateUserPayload } from "../../interfaces";

interface IFindOptions {
  select?: Prisma.UserSelect;
  include?: Prisma.UserInclude;
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

    return await prisma.user.create({ data });
  }

  async findOne(where: Prisma.UserWhereInput, options?: IFindOptions) {
    return await prisma.user.findFirst({ where: { ...where }, ...options });
  }

  public async findByEmail(email: string, options?: IFindOptions) {
    return await this.findOne({ email }, options);
  }

  public async findById(id: string, options?: IFindOptions) {
    return await this.findOne({ id }, options);
  }

  public async findByUsername(username: string, options?: IFindOptions) {
    return await this.findOne({ username }, options);
  }

  public async findByPhoneNumber(phone: string, options?: IFindOptions) {
    return await this.findOne({ phone }, options);
  }

  public async updateUser(where: Prisma.UserWhereUniqueInput, data: Prisma.UserUpdateInput) {
    return await prisma.user.update({ where: { ...where }, data: { ...data } });
  }

  public async findMany(where: Prisma.UserWhereUniqueInput, data: Prisma.UserFindManyArgs) {
    return await prisma.user.findMany({ where: { ...where }, ...data });
  }

  public async totalUsers(where?: Prisma.UserWhereInput) {
    return await prisma.user.count({
      where: {
        ...where,
      },
    });
  }

  async totalUserReferrals(id: string) {
    const result = await this.findOne(
      { id },
      {
        select: {
          _count: {
            select: {
              referrals: true,
            },
          },
        },
      }
    );

    // @ts-expect-error
    return result ? <number>result._count.referrals : 0;
  }
}
