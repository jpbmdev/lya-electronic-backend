import { Request, Response } from "express";
import MqttHandler from "../core/mqtt";
import axios from "axios";
import { ServerResponse } from "../interfaces/cat-fact";

//Intente declarar esto como atributos de la clase
//Pero no me sirvio, por lo que lo tuve que declarar asi
const mqttClient = new MqttHandler();
mqttClient.connect();

//Controlador para gestionar todo lo relacionado con mqtt
export class MqttController {
  async sendMessage(req: Request, res: Response) {
    try {
      const response = await axios.get<ServerResponse>(
        "https://catfact.ninja/fact"
      );
      const { data } = response;
      const message = { message: data.fact, user: req.userId };
      mqttClient.sendMessage(JSON.stringify(message));
      res.json(`Mensaje ${message} enviado exitosamente`);
    } catch (e) {
      res.status(500);
      res.json("Server Internal Error");
    }
  }
}
