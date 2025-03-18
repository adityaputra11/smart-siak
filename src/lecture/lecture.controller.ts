import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { LectureService } from './lecture.service';
import { CreateLectureDto } from './dto/create-lecture.dto';
import { UpdateLectureDto } from './dto/update-lecture.dto';

@Controller('lectures')
export class LectureController {
  constructor(private readonly lectureService: LectureService) {}

  @Post()
  create(@Body() createLectureDto: CreateLectureDto) {
    return this.lectureService.create(createLectureDto);
  }

  @Get()
  findAll() {
    return this.lectureService.findAll();
  }

  @Get('subject/:subjectId')
  findBySubject(@Param('subjectId') subjectId: string) {
    return this.lectureService.findBySubject(subjectId);
  }

  @Get('date-range')
  findByDateRange(
    @Query('start') startDate: string,
    @Query('end') endDate: string,
  ) {
    return this.lectureService.findByDateRange(startDate, endDate);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.lectureService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLectureDto: UpdateLectureDto) {
    return this.lectureService.update(id, updateLectureDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.lectureService.remove(id);
  }
}
