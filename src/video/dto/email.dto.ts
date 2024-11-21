import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, isEmpty, IsNotEmpty } from 'class-validator';

export class EmailDto {
  @IsEmail()
  @ApiProperty() // decorator  để swagger biết và show lên UI
  emailTo: string;
  @ApiProperty()
  @IsNotEmpty()
  subject: string;
  @ApiProperty()
  @IsNotEmpty()
  text: string;
}
