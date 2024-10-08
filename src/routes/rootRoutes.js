import express from "express";
import userRoutes from "./userRoutes.js";
//define obj rootRoutes
const rootRoutes = express.Router();
// import userRoutes vao rootRoutes
rootRoutes.use("/user", userRoutes);
export default rootRoutes;
