import connect from "../../db.js";
import initModels from "../models/init-models.js";
import sequelize from "../models/connect.js";
import { Op } from "sequelize";

//tạo obj model đại diện cho tất cả model của orm
const model = initModels(sequelize);
const getUsers = (req, res) => {
  res.status(200).json({ message: "get-users" });
};

const createUser = (req, res) => {
  let body = req.body;
  res.send(body);
};
const getUsersDb = async (req, res) => {
  const [data] = await connect.query(" select * from users ");
  res.send(data);
};
const getUsersOrm = async (req, res) => {
  try {
    // select * from ussers
    //where full_name like '%John%'
    let data = await model.users.findAll({
      where: {
        full_name: {
          [Op.like]: "%John%",
        },
      },
      attributes: ["user_id", "full_name", "email"],
      include: [
        {
          model: model.video, // join vs table video
          as: "videos",
          required: true, // jion table theo inner join , defalt la left join
          //   attributes: ["video_name"],
        },
      ],
    });
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: "error from ORM" });
  }
};

const getUsersOrmById = async (req, res) => {
  try {
    let { id } = req.params;
    let data = await model.users.findOne({
      where: {
        user_id: id,
      },
    });
    res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: "error API get user by Id" });
  }
};
const createUserOrm = async (req, res) => {
  try {
    let { full_name, email } = req.body;
    await model.users.create({ full_name, email });
  } catch (error) {
    return res.status(500).json({ message: "error API create user ORM" });
  }
  res.status(201).json({ message: "create user Succesfully" });
};
export {
  getUsers,
  createUser,
  getUsersDb,
  getUsersOrm,
  getUsersOrmById,
  createUserOrm,
};
