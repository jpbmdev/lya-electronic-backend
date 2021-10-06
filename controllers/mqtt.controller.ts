import { Request, Response } from "express";
import MqttHandler from "../core/mqtt";

const mqttClient = new MqttHandler();
mqttClient.connect();

//Controlador para gestionar todo lo relacionado con mqtt
export class MqttController {
  async sendMessage(req: Request, res: Response) {
    try {
      mqttClient.sendMessage("hello i dit it");
      res.json("ok");
    } catch (e) {
      console.log(e);
      res.json("F");
    }
  }
}
