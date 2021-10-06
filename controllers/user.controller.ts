import { Request, Response } from "express";
import { validationResult } from "express-validator";
import User from "../models/user.model";
import * as bcrypt from "bcrypt";

export class UserController {
  //Fucion para crar un usuario
  async createUser(req: Request, res: Response) {
    //Para crear un usuairo tenemos que validar los datos
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422);
      res.json("Inpust invalidos");
      return;
    }

    const { email, password, name } = req.body;
    let existingUser;

    //Verificamos que no exista un usuario con ese correo
    try {
      existingUser = await User.findOne({ email: email });
    } catch (err) {
      res.status(500);
      res.json("Server Internal Error");
      return;
    }

    if (existingUser) {
      res.status(422);
      res.json("Ya existe un usuario con ese Email");
      return;
    }

    //Encriptamos ya contraseña
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      email,
      password: hashedPassword,
      name,
      active: false,
    });

    //Creamos el nuevo usuario
    try {
      await newUser.save();
    } catch (err) {
      res.status(500);
      res.json("Server Internal Error");
      return;
    }

    res.json({ userId: newUser.id });
  }

  //Funcion para poder activar a un usuairo
  async activateUser(req: Request, res: Response) {
    //req.params.id Id no necesariametne es el mismo que esta en el token
    //Se puede comparar para ver si es el mismo del token (req.userId) y garantizar que un usario solo pueda editar su usuario
    //Pero como se quiso dejar este id supuse que era porque se queria que un usuairo pueda editar otros usuarios o a el mismo
    const paramId = req.params.id;
    console.log(paramId);
    console.log(req.params.id);

    let existingUser;
    try {
      existingUser = await User.findById(paramId);
    } catch (err) {
      res.status(500);
      res.json("Server Internal Error");
      return;
    }

    //Verificamos si efectivamene el usuario a activar existe
    if (!existingUser) {
      res.status(404);
      res.json("El usuario no existe");
      return;
    }

    console.log(existingUser.id);

    //Actualizamos el estado del usuario
    existingUser.active = true;
    try {
      await existingUser.save();
    } catch (err) {
      res.status(500);
      res.json("Server Internal Error2");
      return;
    }

    res.json("User updated succesfully");
  }
}
