import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';
import { PaginationDto } from './pagination.dto';
import { sanitizeHtml } from '../utils/sanitizer';

export class SearchDto extends PaginationDto {
  // Define allowed fields for searching to prevent exposing sensitive data
  static readonly allowedFields: string[] = [
    'name',
    'email',
    'nim',
    'title',
    'description',
    'username',
  ];
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
      // Trim and sanitize input
      const sanitized = sanitizeHtml(value.trim());

      // Validate that all fields are in the allowed list
      const fieldsArray = sanitized.split(',').map((field) => field.trim());
      const validFields = fieldsArray.filter((field) =>
        SearchDto.allowedFields.includes(field),
      );

      // Return only valid fields joined as a string
      return validFields.join(',');
    }
    return value;
  })
  fields?: string;
}
