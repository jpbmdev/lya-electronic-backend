import { Request, Response } from "express";

export class AuthorizationController {
  async signUp(req: Request, res: Response) {
    res.json("ok");
  }
}
