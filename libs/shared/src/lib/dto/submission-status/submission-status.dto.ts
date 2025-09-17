import { IsInt, IsString, IsOptional } from 'class-validator';

export class SubmissionStatusDto {
  @IsInt()
  id: number;

  @IsString()
  status: string;

  @IsOptional()
  exec_time_ms?: number;

  @IsOptional()
  memory_kb?: number;

  @IsOptional()
  result_summary?: any;

  @IsString()
  created_at: string;

  @IsString()
  updated_at: string;
}
