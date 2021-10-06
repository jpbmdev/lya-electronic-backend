import express from "express";
import { Express } from "express";
import UserRoutes from "../routes/users.routes";

class Server {
  app: Express;
  port: string | undefined;
  userRoutes: UserRoutes;

  constructor() {
    this.app = express();
    this.port = process.env.PORT;
    this.userRoutes = new UserRoutes();
  }

  execute() {
    this.userRoutes.useRoutes(this.app);

    this.app.listen(this.port, () => {
      console.log("Server corriendo en el puerto:", this.port);
    });
  }
}

export default Server;
