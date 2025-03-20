import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SemesterService } from './semester.service';
import { SemesterController } from './semester.controller';
import { Semester } from './entities/semester.entity';
import { StudentSubject } from '../subject/entities/student-subject.entity';
import { Subject } from '../subject/entities/subject.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Semester, StudentSubject, Subject])],
  controllers: [SemesterController],
  providers: [SemesterService],
  exports: [SemesterService],
})
export class SemesterModule {}
