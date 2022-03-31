import { BeforeInsert, Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { BaseEntity } from '../entitys/base.entity';
import { hash } from 'bcrypt';
import { TokenEntity } from '../entitys/token.entity';

@Entity({ name: 'users' })
export class UserEntity extends BaseEntity {
  @Column()
  email: string;

  @Column()
  password: string;

  @OneToOne(() => TokenEntity, (tokens) => tokens.id)
  tokens: TokenEntity;

  @BeforeInsert()
  async hashPassword() {
    this.password = await hash(this.password, 10);
  }
}
