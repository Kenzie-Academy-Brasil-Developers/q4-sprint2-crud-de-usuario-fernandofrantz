import { UserInterface } from "../repositories/user/interface";
import UserRepository from "../repositories";
import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { config } from "../server";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const createUser = async (req: Request, res: Response) => {
  const data = req.body;

  data.createdOn = new Date();
  data.updatedOn = new Date();
  data.id = uuidv4();

  const hashedPassword = await bcrypt.hash(data.password, 10);
  data.password = hashedPassword;

  const user: UserInterface = await new UserRepository().createUser(data);
  const { password, ...userData } = user;

  return res.status(201).json(userData);
};

export const loginUser = async (req: Request, res: Response) => {
  const data = req.body;
  const users: UserInterface[] = await new UserRepository().retrieveUsers();

  const user = users.find((user) => user.email === data.email);
  const match = await bcrypt.compare(data.password, user.password);

  if (!match || !user) {
    return res.status(401).json({ message: "wrong credentials" });
  }

  const token = jwt.sign({ email: data.email }, config.secret, {
    expiresIn: config.expiresIn,
  });

  const { password, ...userData } = user;

  return res.status(200).json({ token, userData });
};

export const getUsers = async (_: Request, res: Response) => {
  const users: UserInterface[] = await new UserRepository().retrieveUsers();
  const filterUsers = users.map((user) => {
    const { password, ...userData } = user;
    return { userData };
  });

  return res.status(200).json(filterUsers);
};

export const getProfile = async (req: Request, res: Response) => {
  const user: UserInterface = await new UserRepository().profileUser(
    req.body.id
  );

  const { password, ...userData } = user;
  return res.status(200).json(userData);
};

export const updateUser = async (req: Request, res: Response) => {
  const data = req.body;
  let user: UserInterface = await new UserRepository().profileUser(
    req.params.uuid
  );

  user = { ...user, ...data };

  if (data.password) {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    user.password = hashedPassword;
  }

  user.updatedOn = new Date();

  const userUpdated: UserInterface = await new UserRepository().updateUser(
    req.body.id,
    user
  );

  const { password, ...userData } = user;
  return res.status(200).json(userData);
};

export const deleteUser = async (req: Request, res: Response) => {
  const data = req.body;
  const user: UserInterface = await new UserRepository().profileUser(
    req.params.uuid
  );

  if (!user) {
    return res.status(404).json({ message: "user not found" });
  }
  if (req.body.isAdm || user.id === req.body.id) {
    const deletedUser: UserInterface = await new UserRepository().deleteUser(
      req.params.uuid
    );

    return res.status(204).json({ message: "user deleted" });
  } else {
    return res.status(401).json({ message: "missing permission" });
  }
};
