import { EntityRepository, getRepository, Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import { CreateUserDto } from './dto/createUser.dto';
import { HttpException, HttpStatus } from '@nestjs/common';

@EntityRepository(UserEntity)
export class UserRepository extends Repository<UserEntity> {
  constructor() {
    super();
  }

  async createUser(dto: CreateUserDto): Promise<UserEntity> {
    const userInDB = await this.findUserByEmail(dto);
    if (userInDB) {
      throw new HttpException('Email is taken', HttpStatus.BAD_REQUEST);
    }

    const newUser = new UserEntity();
    Object.assign(newUser, dto);

    const user = await this.save(newUser);
    return user;
  }

  async findUserByEmail(dto: CreateUserDto): Promise<UserEntity> {
    const user = getRepository(UserEntity)
      .createQueryBuilder('user')
      .where('user.email = :email', { email: dto.email })
      .getOne();

    return user;
  }

  async findUserById(id: number): Promise<UserEntity> {
    const user = getRepository(UserEntity)
      .createQueryBuilder('user')
      .where('user.id = :id', { id: id })
      .getOne();
    return user;
  }

  async findAllUsers(): Promise<UserEntity[]> {
    const users = getRepository(UserEntity)
      .createQueryBuilder('users')
      .getMany();

    return users;
  }
}
