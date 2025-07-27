import { Expose } from 'class-transformer';
import { Role } from '@leet-code-clone/types';

export class UserResponseDto {
  @Expose()
  id: string;

  @Expose()
  username: string;

  @Expose()
  email: string;

  @Expose()
  imgURL: string;

  @Expose()
  role: Role;
}
