import express from "express";
import { Express } from "express";
import UserRoutes from "../routes/users.routes";
import mongoose from "mongoose";

class Server {
  app: Express;
  port: string;
  userRoutes: UserRoutes;

  constructor() {
    this.app = express();
    this.port = process.env.PORT || "8080";
    this.userRoutes = new UserRoutes();
  }

  execute() {
    this.userRoutes.useRoutes(this.app);

    mongoose
      .connect(
        `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.9pzaj.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
      )
      .then(() => {
        this.app.listen(this.port, () => {
          console.log("Server corriendo en el puerto:", this.port);
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }
}

export default Server;
