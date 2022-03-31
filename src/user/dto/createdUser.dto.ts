import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreatedUserDto {

  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  id: string;
}
