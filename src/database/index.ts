import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

prisma.$use(async (params, next) => {
  switch (params.action) {
    case "findFirst":
    case "findMany":
    case "findRaw":
      {
        const where = params.args["where"] || {};
        params.args["where"] = {
          ...where,
          isDeleted: false,
          deletedAt: null,
        };
      }
      break;

    case "delete":
      {
        params.action = "update";
        const data = params.args["data"] || {};
        params.args["data"] = {
          ...data,
          isDeleted: true,
          deletedAt: new Date(),
        };
      }
      break;

    case "deleteMany":
      {
        params.action = "updateMany";
        const data = params.args["data"] || {};
        params.args["data"] = {
          ...data,
          isDeleted: true,
          deletedAt: new Date(),
        };
      }
      break;
  }

  return await next(params);
});
