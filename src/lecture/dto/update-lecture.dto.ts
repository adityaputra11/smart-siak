import { PartialType } from '@nestjs/mapped-types';
import { CreateLectureDto } from './create-lecture.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateLectureDto extends PartialType(CreateLectureDto) {
  @IsOptional()
  @IsString()
  status?: string;
}
