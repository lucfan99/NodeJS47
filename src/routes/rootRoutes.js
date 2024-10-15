import express from "express";
import userRoutes from "./userRoutes.js";
import videoRoutes from "./videoRoutes.js";
import authRoutes from "./authRoutes.js";
//define obj rootRoutes
const rootRoutes = express.Router();
// import userRoutes vao rootRoutes
rootRoutes.use("/user", userRoutes);
//import videoRoutes vao root
rootRoutes.use("/video", videoRoutes);
//import authRoutes vao root
rootRoutes.use("/auth", authRoutes);
export default rootRoutes;
