import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { JWT_PAYLOAD } from "../interfaces/jwt-payload";
import User from "../models/user.model";

//Middleware para validar que un usuario este autenticado
export const checkAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.headers.authorization) {
    return res.status(403).json({ error: "No posees credenciales" });
  }
  const token = req.headers.authorization.split(" ")[1]; //Authorization: 'Bearer TOKEN'

  //Verificamos que haya una llave en las variables de entorno
  const JWT_KEY = process.env.JWT_KEY;
  if (!JWT_KEY) {
    console.log("No hay una llave para poder utilizar jwt");
    process.exit(1);
  }

  let decodedToken;
  //Intentamos validar la firma del token
  try {
    decodedToken = jwt.verify(token, JWT_KEY) as JWT_PAYLOAD;
  } catch (err) {
    return res.status(403).json({ error: "Credenciales Invalidas" });
  }
  const userId = decodedToken.userId;

  //Miramos si efectivamente el usuario dentro del token existe
  let existingUser;
  try {
    existingUser = await User.findOne({ id: userId });
  } catch (err) {
    return res.status(500).json({ error: "Server Internal Error" });
  }

  if (!existingUser) {
    return res.status(403).json({ error: "Credenciales Invalidas" });
  }

  //Verificamos si el token que vino en el request si esta en una sesion activa dentor del usuario
  const validSession = existingUser.sessions.find(
    (session) => session.jwt === token
  );

  if (!validSession) {
    return res.status(403).json({ error: "Credenciales Invalidas" });
  }

  //Pasamos informacion a los siguentes middlewares
  req.userId = userId;
  req.token = token;

  //Abrimos paso al siguiente middleware si todo salio bien
  next();
};
