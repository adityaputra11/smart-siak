import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { SubjectService } from './subject.service';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { CreateStudentSubjectDto } from './dto/create-student-subject.dto';
import { UpdateStudentSubjectDto } from './dto/update-student-subject.dto';
import { PaginationDto } from '../common';

@Controller('subjects')
export class SubjectController {
  constructor(private readonly subjectService: SubjectService) {}

  // Subject endpoints
  @Post()
  createSubject(@Body() createSubjectDto: CreateSubjectDto) {
    return this.subjectService.createSubject(createSubjectDto);
  }

  @Get()
  findAllSubjects(@Query() paginationDto: PaginationDto) {
    return this.subjectService.findAllSubjects(paginationDto);
  }

  @Get('code/:code')
  findByCode(@Param('code') code: string) {
    return this.subjectService.findSubjectByCode(code);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.subjectService.findSubjectById(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSubjectDto: UpdateSubjectDto) {
    return this.subjectService.updateSubject(id, updateSubjectDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.subjectService.removeSubject(id);
  }

  // Student enrollment endpoints
  @Post('enrollment')
  enrollStudent(@Body() createStudentSubjectDto: CreateStudentSubjectDto) {
    return this.subjectService.enrollStudent(createStudentSubjectDto);
  }

  @Get('enrollment/:studentId/:subjectId')
  findStudentSubject(
    @Param('studentId') studentId: string,
    @Param('subjectId') subjectId: string,
  ) {
    return this.subjectService.findStudentSubject(studentId, subjectId);
  }

  @Patch('enrollment/:studentId/:subjectId')
  updateStudentSubject(
    @Param('studentId') studentId: string,
    @Param('subjectId') subjectId: string,
    @Body() updateStudentSubjectDto: UpdateStudentSubjectDto,
  ) {
    return this.subjectService.updateStudentSubject(
      studentId,
      subjectId,
      updateStudentSubjectDto,
    );
  }

  @Delete('enrollment/:studentId/:subjectId')
  removeStudentSubject(
    @Param('studentId') studentId: string,
    @Param('subjectId') subjectId: string,
  ) {
    return this.subjectService.removeStudentSubject(studentId, subjectId);
  }

  @Get(':id/students')
  findStudentsBySubject(
    @Param('id') subjectId: string,
    @Query() paginationDto: PaginationDto,
  ) {
    return this.subjectService.findStudentsBySubject(subjectId, paginationDto);
  }

  @Get('student/:studentId')
  findSubjectsByStudent(
    @Param('studentId') studentId: string,
    @Query() paginationDto: PaginationDto,
  ) {
    return this.subjectService.findSubjectsByStudent(studentId, paginationDto);
  }
}
