import express from "express";
import connect from "./db.js";

// tạo object tổng của express

const app = express();

app.use(express.json());

// Thêm middleware để convert string về JSON với API post và put

//viết API  hello world !!

app.get("/hello-world", (rep, res) => {
  res.send("Hello World");
});
app.get("/1", (rep, res) => {
  res.send("hú hồn chưa");
});

//Lấy thông tin dât từ params , query string, headers, body
// http://localhost:8080/get-user/1
// define API get-user
app.get("/get-user/:id/:ten", (req, res) => {
  //lấy id từ URL
  let { id, ten } = req.params;
  let { queryString } = req.query;
  let { token, auth } = req.headers;
  res.send({ id, ten, queryString, token, auth });
});

// lấy body từ API POST (create) và PUT (update)
app.post("/create-user", (req, res) => {
  let body = req.body;
  res.send(body);
});

app.get("/get-user-db", async (req, res) => {
  const [data] = await connect.query(" select * from users ");
  res.send(data);
});

app.post("/create-user-db", async (req, res) => {
  const query = "INSERT INTO users(full_name,email,pass_word) VALUES (?,?,?)";
  let body = req.body;
  let { full_name, email, pass_word } = body;
  const [data] = await connect.execute(query, [full_name, email, pass_word]);
  return res.send(data);
});

// define port cho BE
app.listen(8080, () => {
  console.log("BE starting with port 8080");
});
