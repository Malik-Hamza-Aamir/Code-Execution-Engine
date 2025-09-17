import {
  IsString,
  IsInt,
  IsNotEmpty,
} from 'class-validator';

export class SubmitCodeDto {
  @IsInt()
  @IsNotEmpty()
  userId: number;

  @IsInt()
  @IsNotEmpty()
  problemId: number;

  @IsString()
  @IsNotEmpty()
  language: string;

  @IsString()
  @IsNotEmpty()
  code: string;
}
