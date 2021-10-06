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
    this.router.post("/", this.authorizationController.signUp);
  }

  useAuthorizationRoutes(app: Express) {
    app.use(
      "/authorization",
      [body("email").isEmail(), body("password").isLength({ min: 5 })],
      this.router
    );
  }
}

export default AuthorizationRoutes;
