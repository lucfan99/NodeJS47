import initModels from "../models/init-models.js";
import sequelize from "../models/connect.js";
import { Op, where } from "sequelize";
import bcrypt from "bcrypt"; // lib mã hóa password
import transporter from "../config/transporter.js";
import jwt from "jsonwebtoken"; //lib tạo token
import { createRefToken, createToken } from "../config/jwt.js";
import crypto from "crypto";

import { PrismaClient } from "@prisma/client";
//tạo obj model đại diện cho tất cả model của orm
const model = initModels(sequelize);
const prisma = new PrismaClient();

const signUp = async (req, res) => {
  try {
    //lấy input từ body req(email,full_name,pass_word)
    let { full_name, email, pass_word } = req.body;
    //ktra xem email có tồn tại trong db ko?
    // let checkUser = await model.users.findOne({
    //   where: {
    //     email,
    //   },
    // });

    let checkUser = await prisma.users.findFirst({ where: { email } });

    //code theo hướng fail_first
    //Nếu user tồn tại thì báo lỗi
    if (checkUser) {
      return res.status(400).json({ message: "email is wrong" });
    }

    //create new user
    // await model.users.create({
    //   full_name,
    //   email,
    //   pass_word: bcrypt.hashSync(pass_word, 10),
    // });

    await prisma.users.create({
      data: {
        full_name,
        email,
        pass_word,
      },
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
  let accessToken = createToken(payload);
  //tạo refresh token
  let refreshToken = createRefToken(payload);
  //Lưu refresh Token vào table users
  await model.users.update(
    {
      refresh_token: refreshToken,
    },
    {
      where: { user_id: checkUser.user_id },
    }
  );
  // gắn refresh token cho cookie của response
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: false, // dùng riêng cho localhost
    sameSite: "Lax", //đảm bảo cookie đc gửi trong nhiều domain
    maxAge: 7 * 24 * 60 * 60 * 1000, // thời gian tồn tại là 7 day
  });
  return res
    .status(200)
    .json({ message: "Login successfully", token: accessToken });
};

const loginFacebook = async (req, res) => {
  try {
    let { id, email, name } = req.body;
    //lấy info user từ db
    let checkUser = await model.users.findOne({ where: { email } });

    //nếu email ko tồn tại trong db => tạo user mới, send mail và return access token
    if (!checkUser) {
      await model.users.create({
        full_name: name,
        email,
        face_app_id: id,
      });
      ///send email welcome
      //send email
      //b1:cấu hình email
      const mailOption = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "welcome to Our service",
        html: `
        <h1>Welcome ${name} to Our service</h1>
      `,
      };
      //B2:  gửi email
      return transporter.sendMail(mailOption, (err, info) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ message: "send mail fail" });
        }
        //tạo access token

        //tạo payload để lưu vào access token
        let payload = { userId: checkUser.user_id };
        //tạo access token bằng khoắ đối xứng
        let accessToken = createToken(payload);
        return res
          .status(200)
          .json({ message: "Login Successfully", token: accessToken });
      });
    }
    // nếu user tồn tại
    //tạo access token

    //tạo payload để lưu vào access token
    let payload = { userId: checkUser.user_id };
    //tạo access token bằng khoắ đối xứng
    let accessToken = createToken(payload);
    return res
      .status(201)
      .json({ message: "Login Successfully", token: accessToken });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "error API login facebook" });
  }
};

const forgotPassword = async (req, res) => {
  try {
    let { email } = req.body;

    //ktra email có tồn tại trong db ko
    let checkUser = await model.users.findOne({ where: { email } });
    if (!checkUser) {
      return res.status(400).json({ message: "Email is wrong" });
    }

    //tạo code
    let randomCode = crypto.randomBytes(6).toString("hex");
    //tạo biến để lưu expire code
    let expired = new Date(new Date().getTime() + 2 * 60 * 60 * 1000); // expire 2 hour
    //Lưu code vào db
    await model.code.create({
      code: randomCode,
      expired,
    });
    //send mail gửi code forgot pass
    //send email
    //b1:cấu hình email
    const mailOption = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Code xác thực của bạn là :",
      html: `
        <h1>${randomCode} </h1>
      `,
    };
    //B2:  gửi email
    return transporter.sendMail(mailOption, (err, info) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ message: "send mail fail" });
      }

      return res
        .status(200)
        .json({ message: "Send forgot password Successfully" });
    });
  } catch (err) {
    return res.status(500).json({ message: "error api forgot password" });
  }
};

const changePassword = async (req, res) => {
  try {
    let { email, code, newPass } = req.body;

    //check email có tồn tại trong db ko
    let checkEmail = await model.users.findOne({
      where: { email },
    });

    if (!checkEmail) {
      return res.status(400).json({ message: "User Email is wrong" });
    }

    if (!code) {
      return res.status(400).json({ message: "Code is wrong" });
    }

    let checkCode = await model.code.findOne({
      where: { code },
    });

    if (!checkCode) {
      return res.status(400).json({ message: "Code is Undefine" });
    }

    let hashNewPass = bcrypt.hashSync(newPass, 10);
    //cách 1:
    checkEmail.pass_word = hashNewPass;
    checkEmail.save();
    //cách 2 : dùng function update

    //Hủy code sau khi đã change pass
    await model.code.destroy({
      where: { code },
    });
    return res.status(200).json({ message: "Change pass successfully" });
  } catch (error) {
    return res.status(500).json({ message: "error API change password" });
  }
};

const extendToken = async (req, res) => {
  try {
    // lấy refresh token từ cookie của req
    let refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ message: "error 401" });
    }
    //check refreshToken trong db
    let userRefToken = await model.users.findOne({
      where: { refresh_token: refreshToken },
    });
    if (!userRefToken || userRefToken == null) {
      return res.status(401).json({ message: "error 401" });
    }

    //create new access token

    let newAccessToken = createToken({ userId: userRefToken.user_id });
    return res.status(200).json({ message: "Success", token: newAccessToken });
  } catch (error) {
    return res.status(500).json({ message: "Error API extend token" });
  }
};

export {
  signUp,
  login,
  loginFacebook,
  forgotPassword,
  changePassword,
  extendToken,
};
