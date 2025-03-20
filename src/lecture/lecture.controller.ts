import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { LectureService } from './lecture.service';
import { CreateLectureDto } from './dto/create-lecture.dto';
import { UpdateLectureDto } from './dto/update-lecture.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../auth/entities/user.entity';
import { PaginationDto } from '../common';

@Controller('lectures')
export class LectureController {
  constructor(private readonly lectureService: LectureService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.LECTURER)
  @Post()
  create(@Body() createLectureDto: CreateLectureDto) {
    return this.lectureService.create(createLectureDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.lectureService.findAll(paginationDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('subject/:subjectId')
  findBySubject(
    @Param('subjectId') subjectId: string,
    @Query() paginationDto: PaginationDto,
  ) {
    return this.lectureService.findBySubject(subjectId, paginationDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('date-range')
  findByDateRange(
    @Query('start') startDate: string,
    @Query('end') endDate: string,
    @Query() paginationDto: PaginationDto,
  ) {
    return this.lectureService.findByDateRange(
      startDate,
      endDate,
      paginationDto,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.lectureService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.LECTURER)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLectureDto: UpdateLectureDto) {
    return this.lectureService.update(id, updateLectureDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.LECTURER)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.lectureService.remove(id);
  }
}
