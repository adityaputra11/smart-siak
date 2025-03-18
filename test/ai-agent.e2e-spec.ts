import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { StudentMotivationDto } from '../src/ai-agent/dto/student-motivation.dto';

describe('AiAgentController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ai-agent/health (GET)', () => {
    return request(app.getHttpServer())
      .get('/ai-agent/health')
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('status', 'ok');
        expect(res.body).toHaveProperty('timestamp');
      });
  });

  it('/ai-agent/study-plan (POST)', () => {
    const studentMotivation: StudentMotivationDto = {
      studentId: 'test-123',
      name: 'Test Student',
      academicLevel: 'Undergraduate',
      subjects: ['Mathematics', 'Computer Science'],
      interests: ['Programming', 'Data Science'],
      goals: ['Improve grades', 'Learn new skills'],
      motivationLevel: 7,
      motivationDescription: 'Moderately motivated but needs structure',
      learningStyle: 'Visual',
      timeAvailability: 15,
    };

    return request(app.getHttpServer())
      .post('/ai-agent/study-plan')
      .send(studentMotivation)
      .expect(201)
      .expect((res) => {
        expect(res.body).toHaveProperty('studentId', 'test-123');
        expect(res.body).toHaveProperty('name', 'Test Student');
        expect(res.body).toHaveProperty('weeklySchedule');
        expect(res.body).toHaveProperty('motivationStrategies');
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
