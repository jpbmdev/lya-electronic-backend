import express from "express";
import { Express, Router } from "express";
import { body } from "express-validator";
import { AuthorizationController } from "../controllers/authorization.controller";

class AuthorizationRoutes {
  router: Router;
  authorizationController: AuthorizationController;

  constructor() {
    this.router = express.Router();
    this.authorizationController = new AuthorizationController();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.post("/", this.authorizationController.Login);
  }

  useAuthorizationRoutes(app: Express) {
    app.use("/authorization", this.router);
  }
}

export default AuthorizationRoutes;
