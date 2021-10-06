import { Request, Response } from "express";

export class UserController {
  createUser(req: Request, res: Response) {
    res.json("hello");
  }
}
