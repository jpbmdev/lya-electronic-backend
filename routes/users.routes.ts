import express from "express";
import { Express, Router } from "express";
import { UserController } from "../controllers/user.controller";
import { body } from "express-validator";

class UsersRoutes {
  router: Router;
  userController: UserController;

  constructor() {
    this.router = express.Router();
    this.userController = new UserController();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.post(
      "/",
      [
        body("email").isEmail(),
        body("password").isLength({ min: 5 }),
        body("name").not().isEmpty(),
      ],
      this.userController.createUser
    );
  }

  useRoutes(app: Express) {
    app.use("/users", this.router);
  }
}

export default UsersRoutes;
