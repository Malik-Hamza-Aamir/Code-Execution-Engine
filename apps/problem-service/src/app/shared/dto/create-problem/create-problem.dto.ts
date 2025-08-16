import {
  IsString,
  IsEnum,
  IsArray,
  IsInt,
  IsOptional,
  IsNotEmpty,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Difficulty } from '@leet-code-clone/types';

class TestCaseDto {
  @IsString()
  @IsNotEmpty()
  input: string;

  @IsString()
  @IsNotEmpty()
  output: string;
}

export class CreateProblemDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  inputFormat: string;

  @IsString()
  @IsNotEmpty()
  outputFormat: string;

  @IsString()
  @IsNotEmpty()
  constraints: string;

  @IsEnum(Difficulty)
  difficulty: Difficulty;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @IsInt()
  @IsOptional()
  acceptanceCount?: number;

  @IsInt()
  @IsOptional()
  submissionCount?: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TestCaseDto)
  @IsOptional()
  testCases?: TestCaseDto[];

  @IsOptional()
  starterCode?: Record<string, string>;
}
