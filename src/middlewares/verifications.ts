import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "../server";
import UserRepository from "../repositories";
import { UserInterface } from "../repositories/user/interface";

export const verifyEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email } = req.body;

  const users: UserInterface[] = await new UserRepository().retrieveUsers();
  const user = users.find((user) => user.email == email);

  if (user) {
    return res.status(422).json({ message: "e-mail already registered." });
  }

  return next();
};

export const verifyKeys = (req: Request, res: Response, next: NextFunction) => {
  const received_keys = Object.keys(req.body);
  const required_keys = ["name", "email", "password", "isAdm"];

  if (
    !received_keys.every((key) => required_keys.includes(key)) ||
    !required_keys.every((key) => received_keys.includes(key))
  ) {
    return res
      .status(400)
      .json({ received_keys: received_keys, required_keys: required_keys });
  }

  return next();
};

export const verifyPatcinghKeys = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const received_keys = Object.keys(req.body);
  const valid_keys = ["name", "email", "password"];

  if (!received_keys.every((key) => valid_keys.includes(key))) {
    return res
      .status(400)
      .json({ received_keys: received_keys, valid_keys: valid_keys });
  }

  return next();
};

export const verifyLoginKeys = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const received_keys = Object.keys(req.body);
  const required_keys = ["email", "password"];

  if (
    !received_keys.every((key) => required_keys.includes(key)) ||
    !required_keys.every((key) => received_keys.includes(key))
  ) {
    return res
      .status(400)
      .json({ received_keys: received_keys, required_keys: required_keys });
  }

  return next();
};

export const authenticateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

    jwt.verify(token, config.secret, async (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "invalid token" });
      }
      const users: UserInterface[] = await new UserRepository().retrieveUsers();
      const user = users.find(({ email }) => {
        return email === decoded.email;
      });
      req.body.email = user.email;
      req.body.id = user.id;
      req.body.isAdm = user.isAdm;
      return next();
    });
  } catch (err: any) {
    res.status(400).json({ message: "missing authorization." });
  }
};

export const authenticatePatch = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

    jwt.verify(token, config.secret, async (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "invalid token" });
      }
      const users: UserInterface[] = await new UserRepository().retrieveUsers();
      const user = users.find(({ email }) => {
        return email === decoded.email;
      });

      req.body.isAdm = user.isAdm;
      return next();
    });
  } catch (e: any) {
    res.status(400).json({ message: "missing authorization." });
  }
};

export const verifyAdministrator = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.body.isAdm) {
    return res.status(401).json({ message: "unauthorized" });
  }

  delete req.body.isAdm;
  return next();
};
