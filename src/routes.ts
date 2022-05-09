import {
  createUser,
  getUsers,
  loginUser,
  getProfile,
  updateUser,
  deleteUser,
} from "./controllers/userController";
import {
  verifyEmail,
  verifyKeys,
  verifyLoginKeys,
  verifyPatcinghKeys,
  authenticateUser,
  authenticatePatch,
  verifyAdministrator,
} from "./middlewares/verifications";
import express, { Express, Request, Response } from "express";
import { Router } from "express";

const route = Router();

export const usersRoutes = (app: Express) => {
  route.post("/users", verifyKeys, verifyEmail, createUser);
  route.post("/login", verifyLoginKeys, loginUser);
  route.get("/users", authenticateUser, verifyAdministrator, getUsers);
  route.get("/users/profile", authenticateUser, getProfile);
  route.patch(
    "/users/:uuid",
    authenticatePatch,
    verifyAdministrator,
    verifyPatcinghKeys,
    verifyEmail,
    updateUser
  );
  route.delete("/users/:uuid", authenticateUser, deleteUser);

  app.use("/", route);
};

export const routes = (app: Express) => {
  app.use(express.json());
  usersRoutes(app);
};
