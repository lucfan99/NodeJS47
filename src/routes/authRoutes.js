import express from "express";
import {
  signUp,
  login,
  loginFacebook,
  forgotPassword,
  changePassword,
} from "../controllers/authController.js";
const authRoutes = express.Router();
//defint API register (sign-up)
authRoutes.post("/sign-up", signUp);
//defint API signIn (sign-in)
authRoutes.post("/login", login);
//definr API signIn facebook
authRoutes.post("/login-facebook", loginFacebook);

//B1:define api forgot password
authRoutes.post("/forgot-password", forgotPassword);

// b2 define api change pass
authRoutes.post("/change-password", changePassword);
export default authRoutes;
