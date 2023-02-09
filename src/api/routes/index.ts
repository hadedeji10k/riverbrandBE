import { FastifyInstance } from "fastify";
import { admin } from "./admin";
import { auth } from "./auth";
import { user } from "./user";

export async function routes(app: FastifyInstance) {
  app.get("/", () => ({ message: "Hmmm... RiverBrand API server" }));

  app.register(admin, { prefix: "admin" });
  app.register(auth, { prefix: "auth" });
  app.register(user, { prefix: "user" });
}
