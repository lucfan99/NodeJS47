import express from "express";
import { buildSchema, graphql } from "graphql";
import { graphqlHTTP } from "express-graphql";

const app = express();
//khởi tạo đối tượng schema
//Quy tắc viết schema
//- Phải có Query or là Mutation trong schema
//-nếu query or mutation ko có function thì phải xóa đi
const schema = buildSchema(`
    type Video {
    id:String,
    name:String
    }
        type Query {
            getVideo(id: String, name: String): Video
            getListVideos:[String]
        }
    `);
const resolver = {
  getVideo: ({ id, name }) => {
    return { id, name };
  },
  getListVideos: () => {
    return ["videoA", "videoB"];
  },
};

//tọa URL để hiển thị graphQL UI

app.use(
  "/graph",
  graphqlHTTP({
    schema: schema,
    rootValue: resolver,
    graphiql: true, // kich hoat UI
  })
);
app.listen("8080", () => {
  console.log("BE is starting with port 8080");
});
