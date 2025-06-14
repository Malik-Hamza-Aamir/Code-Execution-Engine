import { OmitType } from '@nestjs/mapped-types';
import { CreateUserDto } from '../create-user.dto/create-user.dto';

export class UpdateProfileDto extends OmitType(CreateUserDto, ['password'] as const) {}