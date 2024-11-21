import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { LoginDto } from './dto/login.dto';
import { PrismaClient } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrybt from 'bcrypt';
@Injectable()
export class AuthService {
  prisma = new PrismaClient();
  constructor(
    private readonly jwtService: JwtService, // dung de tao token
    private readonly configService: ConfigService,
  ) {}
  async login(body: LoginDto): Promise<string> {
    try {
      const { email, pass_word } = body;
      // get user = email
      const user = await this.prisma.users.findFirst({
        where: { email },
      });
      //kiểm tra user có tồn tại ko
      if (!user) {
        throw new BadRequestException('Email is wrong');
      }
      //Kiểm tra password có trùng ko
      const checkPass = bcrybt.compareSync(pass_word, user.pass_word);
      // cheat password
      const hashPassword = bcrybt.hashSync(pass_word, 10);
      if (!checkPass) {
        throw new BadRequestException('password is wrong');
      }

      // tạo token
      const token = this.jwtService.sign(
        { data: { userId: user.user_id } }, // define payload muon luu vao token
        {
          expiresIn: this.configService.get('JWT_EXPRIRES_IN'),
          secret: 'node47',
        },
      );
      return token;
    } catch (error) {
      console.log(error);
      throw new Error(error.message);
    }
  }
}
