import { Request, Response } from "express";
import User from "../models/user.model";
import { session } from "../models/user.model";
import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export class AuthorizationController {
  async Login(req: Request, res: Response) {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(500);
      res.json("Error al iniciar sesion");
      return;
    }

    let existingUser;

    try {
      existingUser = await User.findOne({ email: email });
    } catch (err) {
      res.status(500);
      res.json("Server Internal Error");
      return;
    }

    if (
      !existingUser ||
      !(await bcrypt.compare(password, existingUser.password))
    ) {
      res.status(403);
      res.json("Credenciales invalidas");
      return;
    }

    const JWT_KEY = process.env.JWT_KEY;
    if (!JWT_KEY) {
      console.log("No hay una llave para poder utilizar jwt");
      process.exit(1);
    }

    //No voy a hacer que el token expire ya que como se solicito que haya una ruta para borrarlos
    //Signica que tengo que guardarlos, y si guardo tokens que vencen hay que añadir mas logica pero por tiempo no lo hare
    const token = jwt.sign(
      {
        userId: existingUser.id,
        email: existingUser.email,
      },
      JWT_KEY
    );

    const currentSession: session = {
      jwt: token,
      active: true,
      date_created: new Date(),
    };

    //Si se van a guarder tokens lo ideal es que haya una coleccion donde se guarnden
    //Y se hagan reglas para guarndar un numero limitado por usuairo, pero por temas de simplicidad
    //Yo voy a guardarlos en el usuario directamente
    //Tambien voy a guardar un maximo de 4 sesiones
    //SI hay 4 sesiones ya y el usuiaro se vuelve a lograr la sesion mas antigua se elimina
    if (existingUser.sessions.length < 4) {
      existingUser.sessions.push(currentSession);
    } else {
      existingUser.sessions.shift();
      existingUser.sessions.push(currentSession);
    }

    try {
      await existingUser.save();
    } catch (err) {
      res.status(500);
      res.json("Server Internal Error");
      return;
    }

    res.json({ token: token });
  }
}
