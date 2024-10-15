import express from "express";
import { signUp, login } from "../controllers/authController.js";
const authRoutes = express.Router();
//defint API register (sign-up)
authRoutes.post("/sign-up", signUp);
//defint API signIn (sign-in)
authRoutes.post("/login", login);
export default authRoutes;
