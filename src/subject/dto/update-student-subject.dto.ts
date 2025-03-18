import { IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class UpdateStudentSubjectDto {
  @IsOptional()
  @IsString()
  grade?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  score?: number;

  @IsOptional()
  @IsString()
  status?: string;
}
