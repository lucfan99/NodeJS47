import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Email ko đúng' })
  @ApiProperty()
  email: string;
  @ApiProperty()
  @IsNotEmpty({ message: 'Email ko để trống' })
  pass_word: string;
}
