import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PaginationDto } from './pagination.dto';

export class SearchDto extends PaginationDto {
  @ApiProperty({
    description: 'Search query string',
    required: false,
  })
  @IsString()
  @IsOptional()
  query?: string;

  @ApiProperty({
    description: 'Fields to search in (comma-separated)',
    required: false,
    example: 'name,email,nim',
  })
  @IsString()
  @IsOptional()
  fields?: string;
}
