import express from "express";
import {
  createUser,
  getUsers,
  getUsersDb,
  getUsersOrm,
  getUsersOrmById,
  createUserOrm,
} from "../controllers/userController.js";
import { middlewareToken } from "../config/jwt.js";

const userRoutes = express.Router();

//define API get list users
userRoutes.get("/get-users", getUsers);
userRoutes.post("/create-user", createUser);
userRoutes.get("/get-user-db", getUsersDb);
userRoutes.get("/get-users-orm", getUsersOrm);
userRoutes.get("/get-users-orm/:id", getUsersOrmById);
userRoutes.post("/create-user-orm", middlewareToken, createUserOrm);
export default userRoutes;
