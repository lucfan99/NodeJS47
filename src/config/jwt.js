import dotenv from "dotenv";
import jwt from "jsonwebtoken";

//LOAD file env
dotenv.config();

const createToken = (payload) => {
  return jwt.sign({ payload }, process.env.SECRET_KEY, {
    algorithm: "HS256",
    expiresIn: "20s", //s-giây || m-phút || h-giờ || d-ngày
  });
};

const createRefToken = (payload) => {
  return jwt.sign({ payload }, process.env.SECRET_KEY, {
    algorithm: "HS256",
    expiresIn: "7d", //s-giây || m-phút || h-giờ || d-ngày
  });
};
//define function để verify token

const verifyToken = (token) => {
  try {
    jwt.verify(token, process.env.SECRET_KEY);
    return true;
  } catch (err) {
    return false;
  }
};
//define middleware để check token
const middlewareToken = (req, res, next) => {
  let { token } = req.headers;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  let checkToken = verifyToken(token);
  if (checkToken) {
    next(); //pass checkToken
  } else {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

export { createToken, middlewareToken, createRefToken };
