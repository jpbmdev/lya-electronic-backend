import express from "express";
import { Express, Router } from "express";
import { body } from "express-validator";
import { AuthorizationController } from "../controllers/authorization.controller";
import { checkAuth } from "../middlewares/auth.middleware";

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

    //Todas las rutas debajo van a requerir un token
    this.router.use(checkAuth);
    this.router.delete("/", this.authorizationController.killSesion);
  }

  useAuthorizationRoutes(app: Express) {
    app.use("/authorization", this.router);
  }
}

export default AuthorizationRoutes;
