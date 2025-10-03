import {
  IsString,
  IsInt,
  IsNotEmpty,
  IsArray,
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

  @IsString()
  @IsNotEmpty()
  functionSignature: string;

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  args: string[];
}
