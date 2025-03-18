import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LectureService } from './lecture.service';
import { LectureController } from './lecture.controller';
import { Lecture } from './entities/lecture.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Lecture])],
  controllers: [LectureController],
  providers: [LectureService],
  exports: [LectureService],
})
export class LectureModule {}
