import {
  Body,
  Controller,
  Post,
  Get,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AiAgentService } from './ai-agent.service';
import { StudentMotivationDto } from './dto/student-motivation.dto';
import { StudyPlanDto } from './dto/study-plan.dto';

@Controller('ai-agent')
export class AiAgentController {
  constructor(private readonly aiAgentService: AiAgentService) {}

  @Post('study-plan')
  async generateStudyPlan(
    @Body() studentMotivation: StudentMotivationDto,
  ): Promise<StudyPlanDto> {
    try {
      return await this.aiAgentService.generateStudyPlan(studentMotivation);
    } catch (error) {
      throw new HttpException(
        `Failed to generate study plan: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('health')
  healthCheck(): { status: string; timestamp: Date } {
    return {
      status: 'ok',
      timestamp: new Date(),
    };
  }
}
