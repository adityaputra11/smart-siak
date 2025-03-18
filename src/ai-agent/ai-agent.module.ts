import { Module } from '@nestjs/common';
import { AiAgentService } from './ai-agent.service';
import { AiAgentController } from './ai-agent.controller';
import { PerplexityApiService } from './services/perplexity-api.service';
import { MotivationAnalyzerService } from './services/motivation-analyzer.service';

@Module({
  providers: [AiAgentService, PerplexityApiService, MotivationAnalyzerService],
  controllers: [AiAgentController],
  exports: [AiAgentService],
})
export class AiAgentModule {}
