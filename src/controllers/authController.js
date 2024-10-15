import initModels from "../models/init-models.js";
import sequelize from "../models/connect.js";
import { Op, where } from "sequelize";
import bcrypt from "bcrypt"; // lib mã hóa password
import transporter from "../config/transporter.js";
import jwt from "jsonwebtoken"; //lib tạo token
//tạo obj model đại diện cho tất cả model của orm
const model = initModels(sequelize);

const signUp = async (req, res) => {
  try {
    //lấy input từ body req(email,full_name,pass_word)
    let { full_name, email, pass_word } = req.body;
    //ktra xem email có tồn tại trong db ko?
    let checkUser = await model.users.findOne({
      where: {
        email,
      },
    });
    //code theo hướng fail_first
    //Nếu user tồn tại thì báo lỗi
    if (checkUser) {
      return res.status(400).json({ message: "email is wrong" });
    }

    //create new user
    await model.users.create({
      full_name,
      email,
      pass_word: bcrypt.hashSync(pass_word, 10),
    });

    //send email
    //b1:cấu hình email
    const mailOption = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "welcome to Our service",
      html: `
        <h1>Welcome ${full_name} to Our service</h1>
      `,
    };
    //B2:  gửi email
    transporter.sendMail(mailOption, (err, info) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ message: "send mail fail" });
      }
      return res.status(201).json({ message: "create user successfully" });
    });
  } catch (err) {
    return res.status(500).json({ message: "error API sign-up" });
  }
};

const login = async (req, res) => {
  try {
    // lấy email và pass từ body req
    let { email, pass_word } = req.body;
    //ktra email có tồn tại trong db
    //nếu ko có email => return err
    let checkUser = await model.users.findOne({
      where: { email },
    });
    if (!checkUser) {
      return res.status(400).json({ message: "email is wrong" });
    }

    // nếu tồn tại => check pass
    //param 1 là password chưa mã hóa
    // param 2 là pass đã mã hóa
    let checkPass = bcrypt.compareSync(pass_word, checkUser.pass_word);
    if (!checkPass) {
      return res.status(400).json({ message: "password is wrong" });
    }
    // dùng lib jsonwebtoken để tạo token

    //tạo payload để lưu vào access token
    let payload = { userId: checkUser.user_id };
    //tạo access token bằng khoắ đối xứng
    let accessToken = jwt.sign({ payload }, "NODE47", {
      algorithm: "HS256",
      expiresIn: "30m",
    });
    return res
      .status(200)
      .json({ message: "Login successfully", token: accessToken });
  } catch (err) {
    return res.status(500).json({ message: "error API login" });
  }
};
export { signUp, login };
