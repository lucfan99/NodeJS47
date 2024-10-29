import { expect } from "chai";
import Sinon from "sinon";
import initModels from "../../models/init-models.js";
import sequelize from "../../models/connect.js";
import { getVideos } from "../../controllers/videoController.js";
import { it } from "mocha";

const model = initModels(sequelize);

//define bộ test case cho function getvideo
//test case 1: get video thành công
//test case 2: get video thất bại (kết nối database fail)

describe("getVideos", () => {
  // define bộ test case
  // giả lập req, res, findAll
  let req, res, findAllStub;

  //thiết lập môi trường cho testing
  beforeEach(() => {
    req = {};
    // res.status().json() => sinon để giả lập res
    res = {
      status: Sinon.stub().returnsThis(),
      json: Sinon.stub(),
    };
    //giả lập function findAll của ORM => sinon
    findAllStub = Sinon.stub(model.video, "findAll");
  });

  afterEach(() => {
    //khôi phục lại findAllStub
    findAllStub.restore();
  });
  //define từng test case cụ thể
  //case 1: getVideo success
  it("getVideos successfully!!!", async () => {
    //chuẩn bị list videos
    const mockVideos = [
      {
        video_id: 5,
        video_name: "Introduction to Cryptocurrency",
        thumbnail: "deadpool.jpg",
        description: "Understanding the basics of cryptocurrency",
        views: 300,
        source: "youtube.com",
        user_id: 5,
        type_id: 9,
      },
      {
        video_id: 6,
        video_name: "Full Stack Web Development Tutorial",
        thumbnail:
          "http://res.cloudinary.com/dghvdbogx/image/upload/v1722343917/node43/qos3uy7t4tbdp5vknys0.jpg",
        description: "Complete guide to full stack web development",
        views: 1200,
        source: "youtube.com",
        user_id: 1,
        type_id: 2,
      },
      //   {
      //     video_id: 7,
      //     video_name: "Acoustic Guitar Performance",
      //     thumbnail: "",
      //     description: "Soulful acoustic guitar performance",
      //     views: 650,
      //     source: "vimeo.com",
      //     user_id: 2,
      //     type_id: 3,
      //   },
      {
        video_id: 10,
        video_name: "Epic Gaming Moments Compilation",
        thumbnail: "gaming_compilation.jpg",
        description: "Compilation of epic gaming moments",
        views: 3500,
        // source: "twitch.tv",
        user_id: 3,
        type_id: 5,
      },
    ];

    // gán list video giả lập vào findAllStub
    //do kết quả findAll là promise => stub dùng resolves
    findAllStub.resolves(mockVideos);
    //call function getVideos để ra happy case (list videos)
    await getVideos(req, res);
    //mong đợi status code là 200 => true
    expect(res.status.calledOnceWith(200)).to.be.true;
    expect(res.json.calledOnceWith(mockVideos)).to.be.true;
  });
  //case2: get video fail
  it("getVideos fail", async () => {
    //giả lập kết nối tới db fail
    findAllStub.rejects(new Error("Database error"));
    //call function getVideos
    await getVideos(req, res);
    //expect kết quả
    expect(res.status.calledOnceWith(500)).to.be.true;
    expect(
      res.json.calledOnceWith({ message: "error for api get list videos" })
    ).to.be.true;
  });
});
