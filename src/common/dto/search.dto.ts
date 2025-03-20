import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';
import { PaginationDto } from './pagination.dto';
import { sanitizeHtml } from '../utils/sanitizer';

export class SearchDto extends PaginationDto {

  @ApiProperty({
    description: 'Search query string',
    required: false,
    maxLength: 100,
  })
  @IsString({ message: 'Query must be a string' })
  @IsOptional()
  @MaxLength(100, { message: 'Query cannot exceed 100 characters' })
  @Transform(({ value }) => {
    if (value) {
      // Trim and sanitize input
      return sanitizeHtml(value.trim());
    }
    return value;
  })
  query?: string;

  @ApiProperty({
    description: 'Fields to search in (comma-separated)',
    required: false,
    example: 'name,email,nim',
  })
  @IsString({ message: 'Fields must be a comma-separated string' })
  @IsOptional()
  @Transform(({ value }) => {
    if (value) {
      return sanitizeHtml(value.trim());
    }
    return value;
  })
  fields?: string;
}
