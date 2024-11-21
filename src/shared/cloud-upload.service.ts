import { Inject, Injectable } from '@nestjs/common';
import { UploadApiResponse } from 'cloudinary';

@Injectable()
export class CloudinaryUploadService {
  constructor(@Inject('CLOUDINARY') private cloudinary) {}
  async uploadImage(
    file: Express.Multer.File,
    desination: string,
  ): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const uploadStream = this.cloudinary.uploader.upload_stream(
        { folder: desination }, //define folder trên cloudinary. Nếu ko có trên cloudinary thì sẽ tạo folder mới
        (error: any, result: UploadApiResponse) => {
          // upload hình lên cloudinary
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        },
      );
      uploadStream.end(file.buffer); // sau khi config xong thì gửi file lên network
    });
  }
}
