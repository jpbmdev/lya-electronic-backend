import { Request, Response } from "express";

import User from "../models/user.model";

export class UserController {
  async createUser(req: Request, res: Response) {
    const newUser = new User({
      email: "jpmbdev@gmail.com",
      password: "12324",
      active: false,
    });

    await newUser.save();
    res.json("success");
  }
}
