import { Request, Response } from "express";
import User from "../models/user.model";
import { session } from "../models/user.model";
import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_PAYLOAD } from "../interfaces/jwt-payload";

export class AuthorizationController {
  //Funcion para iniciar una sesion
  async Login(req: Request, res: Response) {
    const { email, password } = req.body;

    //Verificamos que hayan ingresado datos
    if (!email || !password) {
      res.status(500);
      res.json("Error al iniciar sesion");
      return;
    }

    //Consultamos si hay un usuario con ese email
    let existingUser;
    try {
      existingUser = await User.findOne({ email: email });
    } catch (err) {
      res.status(500);
      res.json("Server Internal Error");
      return;
    }

    //Verificamos que el usuario exista y que la contraseña sea correcta
    if (
      !existingUser ||
      !(await bcrypt.compare(password, existingUser.password))
    ) {
      res.status(403);
      res.json("Credenciales invalidas");
      return;
    }

    //Verificamos que haya una llave en las variables de entorno
    const JWT_KEY = process.env.JWT_KEY;
    if (!JWT_KEY) {
      console.log("No hay una llave para poder utilizar jwt");
      process.exit(1);
    }

    //No voy a hacer que el token expire ya que como se solicito que haya una ruta para borrarlos
    //Signica que tengo que guardarlos, y si guardo tokens que vencen hay que añadir mas logica pero por tiempo no lo hare
    const jwt_payload: JWT_PAYLOAD = {
      userId: existingUser.id,
      email: existingUser.email,
    };

    const token = jwt.sign(jwt_payload, JWT_KEY);

    //Creamos la sesion
    const currentSession: session = {
      jwt: token,
      date_created: new Date(),
    };

    //Si se van a guarder tokens lo ideal es que haya una coleccion donde se guarnden
    //Y se hagan reglas para guarndar un numero limitado por usuairo, pero por temas de simplicidad
    //Yo voy a guardarlos en el usuario directamente
    //Tambien voy a guardar un maximo de 4 sesiones (Y si esto implica que el usuario solo puede tener 4 sesiones activas)
    //SI hay 4 sesiones ya y el usuiaro se vuelve a lograr la sesion mas antigua se elimina
    if (existingUser.sessions.length < 4) {
      existingUser.sessions.push(currentSession);
    } else {
      existingUser.sessions.shift();
      existingUser.sessions.push(currentSession);
    }

    //Actualizamos el usuario
    try {
      await existingUser.save();
    } catch (err) {
      res.status(500);
      res.json("Server Internal Error");
      return;
    }

    res.json({ token: token });
  }

  async killSesion(req: Request, res: Response) {
    res.json(req.userId);
  }
}
