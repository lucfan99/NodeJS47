import express from "express";
import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import dotenv from "dotenv";

dotenv.config();

//cau hinh cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
// cấu hình multer với cloudinary
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "avatar", //define folder lưu hình nêú cloudinary ko có sẽ tạo folder mới
    format: async (req, file) => {
      //define những format file cho phép up lên cloud
      const validFormats = ["jpeg", "png", "gif", "webp", "jpg"];

      //lấy định dạng file upload
      //mimetype : image/png, image/jbeg...
      const fileFormat = file.mimetype.split("/")[1];

      //kiểm tra định dạng file có hợp lệ hay ko
      if (validFormats.includes(fileFormat)) {
        return fileFormat;
      }
      return "png"; // return defaul định dạng của file ảnh
    },
    public_id: (req, file) => {
      const newName =
        new Date().getTime() + "_" + file.originalname.split(".")[0];
      return newName;
    },
  },
});

// define middleware uploadCloud
export const uploadCloud = multer({ storage });
