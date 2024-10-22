import express from "express";
const videoRoutes = express.Router();
import {
  getVideos,
  getTypes,
  getVideosTypeId,
  getVideoById,
} from "../controllers/videoController.js";
import { middlewareToken } from "../config/jwt.js";
//define API get list video
videoRoutes.get("/get-videos", getVideos);
// define Api get type video
videoRoutes.get("/get-types", middlewareToken, getTypes); // apply authentication
//define api get list video by video type
videoRoutes.get("/get-videos/:typeId", getVideosTypeId);

//define API get detail video
videoRoutes.get("/get-video/:videoId", getVideoById);
export default videoRoutes;
