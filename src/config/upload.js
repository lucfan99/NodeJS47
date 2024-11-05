import multer, { diskStorage } from "multer";
// define noi luu hinh trong soure BE
//=> / public/img
// process.cwd()  : tim duong dan tuyet doi toi soure BE
export const upload = multer({
  storage: diskStorage({
    destination: process.cwd() + "/public/img",
    filename: (req, file, callback) => {
      let newName = new Date().getTime() + "_" + file.originalname;
      callback(null, newName);
    },
  }),
});
