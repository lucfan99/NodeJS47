import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Req,
  Headers,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiHeader, ApiQuery } from '@nestjs/swagger';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get('/list-user/:id')
  @ApiQuery({ name: 'keyword', required: false, type: String }) // config query tren swagger
  @ApiHeader({ name: 'token', required: false }) // config header tren swagger
  findAll(
    @Param('id') id: string, // lay param theo kieu cua nestjs
    @Query('keyword') keyword: string, // lay querry theo kieu nestjs
    @Headers('token') token: string, // lay info header theo kieu nestjs
    @Req() req: Request,
  ): any {
    let id1 = req.params.id; //lay param theo kieu express
    let keyword1 = req.query.keyword; // lay query theo express
    let token1 = req.headers['token']; // lay info header theo kieu express

    return { id, id1, keyword, keyword1, token, token1 };
    //return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Get('/env/get-env')
  getENV() {
    return this.configService.get<number>('PORT');
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
