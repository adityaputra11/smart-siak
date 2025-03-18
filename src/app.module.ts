import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AiAgentModule } from './ai-agent/ai-agent.module';
import { ConfigModule } from './config/config.module';
import { StudentModule } from './student/student.module';
import { SubjectModule } from './subject/subject.module';
import { LectureModule } from './lecture/lecture.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    ConfigModule,
    DatabaseModule,
    AiAgentModule,
    StudentModule,
    SubjectModule,
    LectureModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
