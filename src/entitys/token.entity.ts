import { Column, Entity, OneToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { UserEntity } from '../user/user.entity';

@Entity()
export class TokenEntity extends BaseEntity {
  @Column()
  accessToken: string;

  @Column()
  refreshToken: string;

  @OneToOne(() => UserEntity, (user) => user.id)
  userId: string;
}
