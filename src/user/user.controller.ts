import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/createUser.dto';
import { UserEntity } from './user.entity';
import { User } from './decorators/user.decorator';
import { TokenResponseDto } from './dto/token.response.dto';
import { AuthGuard } from './guards/auth.guard';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('user')
  async createUser(@Body() dto: CreateUserDto): Promise<TokenResponseDto> {
    const user = await this.userService.creteUser(dto);
    return user;
  }

  @Post('user/login')
  async loginUser(@Body() dto: CreateUserDto): Promise<TokenResponseDto> {
    return await this.userService.loginUser(dto);
  }

  @Get('user')
  @UseGuards(AuthGuard)
  async findOneUser(@User() user: UserEntity): Promise<UserEntity> {
    return user;
  }

  @Get('users')
  async findAllUsers(): Promise<UserEntity[]> {
    const users = await this.userService.findAllUser();
    return users;
  }
}
