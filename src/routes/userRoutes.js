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
import { upload } from "../config/upload.js";
import { uploadCloud } from "../config/upload.cloud.js";

const userRoutes = express.Router();

//define API get list users
userRoutes.get("/get-users", getUsers);
userRoutes.post("/create-user", createUser);
userRoutes.get("/get-user-db", getUsersDb);
userRoutes.get("/get-users-orm", getUsersOrm);
userRoutes.get("/get-users-orm/:id", getUsersOrmById);
userRoutes.post("/create-user-orm", middlewareToken, createUserOrm);

userRoutes.post("/upload-avatar", upload.single("hinhAnh"), (req, res) => {
  let file = req.file;
  return res.status(200).json(file);
});

userRoutes.post(
  "/upload-multiple-avatar",
  upload.array("hinhAnhs"),
  (req, res) => {
    let files = req.files;
    return res.status(200).json(files);
  }
);
// upload cloud avatar 1 hình
userRoutes.post(
  "/upload-cloud-avatar",
  uploadCloud.single("hinhAnh"),
  async (req, res) => {
    let file = req.file;
    return res.status(200).json(file);
  }
);

//upload multiple
userRoutes.post(
  "/upload-multiple-cloud",
  uploadCloud.array("hinhAnhs"),
  (req, res) => {
    let files = req.files;
    return res.status(200).json(files);
  }
);

export default userRoutes;
