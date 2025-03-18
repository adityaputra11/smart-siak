import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubjectService } from './subject.service';
import { SubjectController } from './subject.controller';
import { Subject } from './entities/subject.entity';
import { StudentSubject } from './entities/student-subject.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Subject, StudentSubject])],
  controllers: [SubjectController],
  providers: [SubjectService],
  exports: [SubjectService],
})
export class SubjectModule {}
