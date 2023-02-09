import { FastifyReply, FastifyRequest } from "fastify";
import { Service } from "typedi";
import { ISignInPayload } from "../../interfaces";
import { UserService, AuthService, AdminService } from "../../services";
import { Message, response } from "../../utils";

@Service()
export class AdminController {
  public constructor(
    private readonly adminService: AdminService,
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) { }

  public async adminDashboard(request: FastifyRequest, reply: FastifyReply) {
    const userStat = await this.userService.getUserStatistics();

    const data = {
      userStat,
    };

    return response.success(reply, {
      message: Message.userDashboardFetched,
      data,
    });
  }

  public async adminSignIn(request: FastifyRequest, reply: FastifyReply) {
    const { body }: { [key: string]: any } = request;

    const payload: ISignInPayload = {
      email: body.email,
      password: body.password,
      captchaToken: body.captchaToken,
    };

    const data = await this.authService.adminSignIn(payload);
    return response.success(reply, { message: Message.signInSuccessful, data });
  }

  public async getSingleUser(request: FastifyRequest, reply: FastifyReply) {
    const { params }: { [key: string]: any } = request;

    const data = await this.userService.getUserData(params.id);
    return response.success(reply, { message: Message.userFetchedSuccess, data });
  }

  public async getConfig(request: FastifyRequest, reply: FastifyReply) {
    const { query }: { [key: string]: any } = request;

    const data = await this.adminService.getConfig(query.keys || "");
    return response.success(reply, { message: Message.configFetchedSuccessfully, data });
  }

  public async setConfig(request: FastifyRequest, reply: FastifyReply) {
    const { body }: { [key: string]: any } = request;

    const data = await this.adminService.setConfig(body);
    return response.success(reply, { message: Message.configSetSuccessfully, data });
  }
}
