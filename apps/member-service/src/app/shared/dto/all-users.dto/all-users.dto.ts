import { Role } from '@leet-code-clone/types';
import { IsDefined, IsEnum, IsInt, IsNotEmpty, IsString } from 'class-validator';

export class AllUsersDto {
  @IsDefined()
  @IsInt()
  @IsNotEmpty({ message: 'Id cannot be empty' })
  id: number;

  @IsDefined()
  @IsString()
  @IsNotEmpty({ message: 'Username cannot be empty' })
  username: string;

  @IsDefined()
  @IsEnum(Role)
  role: Role;

  constructor(id: number, username: string, role: Role) {
    this.id = id;
    this.username = username;
    this.role = role;
  }
}
