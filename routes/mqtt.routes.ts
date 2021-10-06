import express from "express";
import { Express, Router } from "express";
import { checkAuth } from "../middlewares/auth.middleware";
import { MqttController } from "../controllers/mqtt.controller";
import { MqttClient } from "mqtt";
import { Request, Response } from "express";

class MqttRoutes {
  router: Router;
  mqttController: MqttController;

  constructor() {
    this.router = express.Router();
    this.mqttController = new MqttController();
    this.initializeRoutes();
  }

  initializeRoutes() {
    //Todas las rutas debajo van a requerir un token
    this.router.use(checkAuth);
    this.router.post("/send", this.mqttController.sendMessage);
  }

  useRoutes(app: Express) {
    app.use("/messages", this.router);
  }
}

export default MqttRoutes;
