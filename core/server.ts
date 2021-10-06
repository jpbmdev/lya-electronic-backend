import express from "express";
import { Express } from "express";
import UserRoutes from "../routes/users.routes";
import AuthorizationRoutes from "../routes/authorization.routes";
import MqttRoutes from "../routes/mqtt.routes";
import mongoose from "mongoose";

//Esta clase va a ser el servidor de la aplicacion
class Server {
  //Definimos todos los atributos del servidor
  app: Express;
  port: string;
  userRoutes: UserRoutes;
  authorizationRoutes: AuthorizationRoutes;
  mqttRoutes: MqttRoutes;

  //Funcion para construir el servidor
  constructor() {
    this.app = express();
    this.port = process.env.PORT || "8080";
    this.userRoutes = new UserRoutes();
    this.authorizationRoutes = new AuthorizationRoutes();
    this.mqttRoutes = new MqttRoutes();
  }

  //Funcion para correr middlewares deseados
  useMiddlewares() {
    this.app.use(express.json());

    this.userRoutes.useRoutes(this.app);

    this.authorizationRoutes.useAuthorizationRoutes(this.app);

    this.mqttRoutes.useRoutes(this.app);
  }

  //Funcion para poner a correr el servidor
  execute() {
    this.useMiddlewares();

    //Si la conexion a la base de datos es exitosa corremos el servidor
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
