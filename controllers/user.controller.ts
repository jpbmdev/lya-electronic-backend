import { Request, Response } from "express";
import { validationResult } from "express-validator";
import User from "../models/user.model";

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

    const newUser = new User({
      email,
      password,
      active: false,
    });

    await newUser.save();
    res.json({ userId: newUser.id });
  }
}
