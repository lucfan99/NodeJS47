import initModels from "../models/init-models.js";
import sequelize from "../models/connect.js";
import { Op, where } from "sequelize";

//tạo obj model đại diện cho tất cả model của orm
const model = initModels(sequelize);
const getVideos = async (req, res) => {
  let page = 2;
  let size = 4;
  let index = (page - 1) * size;

  let data = await model.video.findAll({
    offset: index,
    limit: size,
  });
  return res.status(200).json(data);
};

const getTypes = async (req, res) => {
  try {
    let data = await model.video_type.findAll();
    return res.status(200).json(data);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "error call api type video" });
  }
};
const getVideosTypeId = async (req, res) => {
  try {
    let { typeId } = req.params;
    let data = await model.video.findAll({
      where: {
        type_id: typeId,
      },
    });
    return res.status(200).json(data);
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: "error for api get list video by type id" });
  }
};

const getVideoById = async (req, res) => {
  try {
    let { videoId } = req.params;
    let data = await model.video.findOne({
      where: {
        video_id: videoId,
      },
      include: {
        model: model.users,
        as: "user",
      },
    });
    return res.status(200).json(data);
  } catch (err) {
    console.log("error for api  get video by id");
    return res.status(500).json({ message: "error call api video by id" });
  }
};
export { getVideos, getTypes, getVideosTypeId, getVideoById };
