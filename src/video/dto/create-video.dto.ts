import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateVideoDto {
  @IsNotEmpty({ message: 'Video_name ko để trống ' })
  @ApiProperty() // show attribute ra ngoai giao dien cua swagger
  video_name: string;

  @IsNotEmpty({ message: 'Thumbnail ko để trống ' })
  @ApiProperty()
  thumbnail: string;
  @ApiProperty()
  description: string;
  @ApiProperty()
  views: number;
  @ApiProperty()
  source: string;
  //   @ApiProperty()
  user_id: number;
  @ApiProperty()
  type_id: number;
}
//DTO upload 1 hinh
export class FileUploadDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  hinhAnh: any;
}
//DTO upload nhieu hinh
export class FilesUploadDto {
  @ApiProperty({ type: 'array', items: { type: 'string', format: 'binary' } })
  hinhAnhs: any[];
}
