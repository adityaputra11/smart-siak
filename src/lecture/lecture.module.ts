import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LectureService } from './lecture.service';
import { LectureController } from './lecture.controller';
import { Lecture } from './entities/lecture.entity';
import { LecturerService } from './lecturer.service';
import { LecturerController } from './lecturer.controller';
import { Lecturer } from './entity/lecturer.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Lecture, Lecturer]),
    AuthModule,
  ],
  controllers: [LectureController, LecturerController],
  providers: [LectureService, LecturerService],
  exports: [LectureService, LecturerService],
})
export class LectureModule {}
