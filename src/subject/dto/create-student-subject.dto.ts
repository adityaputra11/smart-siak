import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateStudentSubjectDto {
  @IsNotEmpty()
  @IsUUID()
  studentId: string;

  @IsNotEmpty()
  @IsUUID()
  subjectId: string;

  @IsOptional()
  @IsString()
  status?: string;
}
