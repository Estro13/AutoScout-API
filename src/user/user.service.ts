import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { CreateUserDto } from './dto/createUser.dto';
import { jwtSecret, secondJwtSecret } from '../config';
import { plainToClass } from 'class-transformer';
import { TokenEntity } from '../entitys/token.entity';
import { sign } from 'jsonwebtoken';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import { compare } from 'bcrypt';
import { TokenResponseDto } from './dto/token.response.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
    @InjectRepository(TokenEntity)
    private readonly tokensRepository: Repository<TokenEntity>,
  ) {}

  async creteUser(dto: CreateUserDto): Promise<TokenResponseDto> {
    const user = await this.userRepository.createUser(dto);

    const tokens = await this.createAndSaveTokens(user);
    delete tokens.userId;
    return tokens;
  }

  async loginUser(dto: CreateUserDto): Promise<TokenResponseDto> {
    const user = await this.userRepository.findUserByEmail(dto);

    if (!user) {
      throw new HttpException(
        'Credentials are not valid',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const isPasswordCorrect = await compare(dto.password, user.password);

    if (!isPasswordCorrect) {
      throw new HttpException(
        'Credentials are not valid',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const tokens = await this.tokensRepository.findOne(user.id);
    delete tokens.id;
    return tokens;
  }

  async findUserById(id: number): Promise<UserEntity> {
    const user = await this.userRepository.findUserById(id);
    delete user.password;
    return user;
  }

  async findAllUser(): Promise<UserEntity[]> {
    const usersFromDB = await this.userRepository.findAllUsers();
    usersFromDB.forEach((el) => {
      el.password = undefined;
    });
    return usersFromDB;
  }

  async createAndSaveTokens(user: UserEntity): Promise<TokenResponseDto> {
    const accessToken = sign(
      {
        email: user.email,
        password: user.password,
        id: user.id,
      },
      jwtSecret,
    );

    const refreshToken = sign(
      {
        email: user.email,
        password: user.password,
        id: user.id,
      },
      secondJwtSecret,
    );

    const tokenModel = plainToClass(TokenEntity, {
      accessToken: accessToken,
      refreshToken: refreshToken,
      userId: user.id,
    });

    const tokenEntity = await this.tokensRepository.save(tokenModel);
    delete tokenEntity.id;
    return tokenEntity;
  }
}
