import express from "express";
import { Express } from "express";
import userRoutes from "../routes/users.routes";

class Server {
  app: Express;
  port: number;

  constructor() {
    this.app = express();
    this.port = 8080;
  }

  useUserRoutes() {
    this.app.use("/users", userRoutes);
  }

  execute() {
    this.useUserRoutes();
    this.app.listen(this.port, () => {
      console.log("Server corriendo en el puerto:", this.port);
    });
  }
}

export default Server;
