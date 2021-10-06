import express from "express";
import { Express, Router } from "express";
import { UserController } from "../controllers/user.controller";

class UsersRoutes {
  router: Router;
  userController: UserController;
  
  constructor() {
    this.router = express.Router();
    this.userController = new UserController();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.get("/", this.userController.createUser);
  }

  useRoutes(app: Express) {
    app.use("/users", this.router);
  }
}

export default UsersRoutes;
