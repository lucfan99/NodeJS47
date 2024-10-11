import express from "express";
import userRoutes from "./userRoutes.js";
import videoRoutes from "./videoRoutes.js";
//define obj rootRoutes
const rootRoutes = express.Router();
// import userRoutes vao rootRoutes
rootRoutes.use("/user", userRoutes);
//import videoRouter vao root
rootRoutes.use("/video", videoRoutes);
export default rootRoutes;
