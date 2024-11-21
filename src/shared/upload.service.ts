import { diskStorage } from 'multer'; // lib để define nơi lưu trữ file
import { extname } from 'path'; // lib để lấy đuôi file


// dèine functional
export const storage = (destination : string): any =>{
    return diskStorage({
        destination:`./public/imgs/${destination}`,
        filename:(req,file,callback)=>{
            const uniqueName = Date.now();
            //
            callback(null,`${uniqueName}${extname(file.originalname)}`)
        }
    })
}