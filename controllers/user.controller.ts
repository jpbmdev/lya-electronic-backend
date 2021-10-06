import { Request, Response } from "express";
import { validationResult } from "express-validator";
import User from "../models/user.model";
import * as bcrypt from "bcrypt";

export class UserController {
  async createUser(req: Request, res: Response) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422);
      res.json("Inpust invalidos");
      return;
    }

    const { email, password } = req.body;
    let existingUser;

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

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      email,
      password: hashedPassword,
      active: false,
    });

    try {
      await newUser.save();
    } catch (err) {
      res.status(500);
      res.json("Server Internal Error");
      return;
    }

    res.json({ userId: newUser.id });
  }
}
