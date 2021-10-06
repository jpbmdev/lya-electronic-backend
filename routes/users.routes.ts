import express from "express";
import { Express, Router } from "express";
import { UserController } from "../controllers/user.controller";
import { body } from "express-validator";
import { checkAuth } from "../middlewares/auth.middleware";

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
    //Todas las rutas debajo van a requerir un token
    this.router.use(checkAuth);

    this.router.put(
      "/:id",
      [body("name").not().isEmpty()],
      this.userController.editUser
    );

    this.router.delete("/:id", this.userController.deleteUser);

    this.router.patch("/:id/active", this.userController.activateUser);

    this.router.get("/:id", this.userController.getUser);
  }

  useRoutes(app: Express) {
    app.use("/users", this.router);
  }
}

export default UsersRoutes;
