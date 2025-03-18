import { Injectable, Logger } from '@nestjs/common';
import { StudentMotivationDto } from '../dto/student-motivation.dto';

@Injectable()
export class MotivationAnalyzerService {
  private readonly logger = new Logger(MotivationAnalyzerService.name);

  /**
   * Analyzes student motivation and provides insights
   * @param studentMotivation Student motivation data
   * @returns Analysis of motivation factors
   */
  analyzeMotivation(studentMotivation: StudentMotivationDto): {
    motivationType: string;
    strengths: string[];
    challenges: string[];
    recommendedApproaches: string[];
  } {
    this.logger.log(
      `Analyzing motivation for student: ${studentMotivation.name}`,
    );

    // Determine motivation type based on motivation level and description
    const motivationType = this.determineMotivationType(studentMotivation);

    // Identify strengths based on motivation profile
    const strengths = this.identifyStrengths(studentMotivation);

    // Identify challenges based on motivation profile
    const challenges = this.identifyChallenges(studentMotivation);

    // Generate recommended approaches
    const recommendedApproaches = this.generateRecommendedApproaches(
      studentMotivation,
      motivationType,
      challenges,
    );

    return {
      motivationType,
      strengths,
      challenges,
      recommendedApproaches,
    };
  }

  private determineMotivationType(
    studentMotivation: StudentMotivationDto,
  ): string {
    const { motivationLevel, goals, interests } = studentMotivation;

    // Simple logic to determine motivation type
    if (motivationLevel >= 8) {
      return 'Intrinsically Motivated';
    } else if (motivationLevel >= 5) {
      // Check if goals and interests align
      const hasAlignedInterests = goals.some((goal) =>
        interests.some(
          (interest) =>
            goal.toLowerCase().includes(interest.toLowerCase()) ||
            interest.toLowerCase().includes(goal.toLowerCase()),
        ),
      );

      return hasAlignedInterests ? 'Goal-Oriented' : 'Extrinsically Motivated';
    } else {
      return 'Motivation Needs Development';
    }
  }

  private identifyStrengths(studentMotivation: StudentMotivationDto): string[] {
    const strengths: string[] = [];
    const {
      motivationLevel,
      interests,
      goals,
      learningStyle,
      timeAvailability,
    } = studentMotivation;

    if (motivationLevel >= 7) {
      strengths.push('High baseline motivation');
    }

    if (interests.length >= 3) {
      strengths.push('Diverse interests that can be leveraged for learning');
    }

    if (goals.length >= 2) {
      strengths.push('Clear goals that provide direction');
    }

    if (timeAvailability >= 15) {
      strengths.push('Sufficient time dedicated to studies');
    }

    if (learningStyle) {
      strengths.push(`Awareness of personal learning style (${learningStyle})`);
    }

    // Add default if no strengths identified
    if (strengths.length === 0) {
      strengths.push('Taking initiative to seek academic improvement');
    }

    return strengths;
  }

  private identifyChallenges(
    studentMotivation: StudentMotivationDto,
  ): string[] {
    const challenges: string[] = [];
    const { motivationLevel, motivationDescription, timeAvailability } =
      studentMotivation;

    if (motivationLevel <= 5) {
      challenges.push('Low baseline motivation that needs development');
    }

    if (timeAvailability < 10) {
      challenges.push('Limited time availability for studies');
    }

    // Look for keywords in motivation description
    const lowerDescription = motivationDescription.toLowerCase();
    if (lowerDescription.includes('procrast')) {
      challenges.push('Tendency to procrastinate');
    }

    if (lowerDescription.includes('distract')) {
      challenges.push('Vulnerability to distractions');
    }

    if (
      lowerDescription.includes('difficult') ||
      lowerDescription.includes('struggle')
    ) {
      challenges.push(
        'Difficulty maintaining motivation when facing challenges',
      );
    }

    // Add default if no challenges identified
    if (challenges.length === 0) {
      challenges.push('Maintaining consistent motivation across all subjects');
    }

    return challenges;
  }

  private generateRecommendedApproaches(
    studentMotivation: StudentMotivationDto,
    motivationType: string,
    challenges: string[],
  ): string[] {
    const approaches: string[] = [];
    const { learningStyle } = studentMotivation;

    // Based on motivation type
    switch (motivationType) {
      case 'Intrinsically Motivated':
        approaches.push(
          'Focus on deepening understanding rather than just completing tasks',
        );
        approaches.push(
          'Seek out advanced materials that maintain intellectual challenge',
        );
        break;
      case 'Goal-Oriented':
        approaches.push(
          'Break down long-term goals into measurable weekly objectives',
        );
        approaches.push('Use visual progress tracking to maintain motivation');
        break;
      case 'Extrinsically Motivated':
        approaches.push(
          'Establish a consistent reward system for achieving study milestones',
        );
        approaches.push('Find study groups or accountability partners');
        break;
      case 'Motivation Needs Development':
        approaches.push(
          'Start with very small, achievable daily goals to build confidence',
        );
        approaches.push(
          'Connect learning material directly to personal interests',
        );
        approaches.push(
          'Use the 5-minute rule: commit to just 5 minutes of study to overcome initial resistance',
        );
        break;
    }

    // Based on learning style
    if (learningStyle) {
      if (learningStyle.toLowerCase().includes('visual')) {
        approaches.push('Use mind maps, diagrams, and color-coding in notes');
        approaches.push('Watch educational videos that visualize concepts');
      } else if (learningStyle.toLowerCase().includes('auditory')) {
        approaches.push('Record and listen to summaries of study material');
        approaches.push(
          'Participate in study discussions and explain concepts aloud',
        );
      } else if (
        learningStyle.toLowerCase().includes('kinesthetic') ||
        learningStyle.toLowerCase().includes('hands-on')
      ) {
        approaches.push('Use physical flashcards that can be manipulated');
        approaches.push(
          'Take breaks for physical activity between study sessions',
        );
        approaches.push(
          'Create physical models or demonstrations of concepts when possible',
        );
      }
    }

    // Based on specific challenges
    if (challenges.includes('Tendency to procrastinate')) {
      approaches.push('Use the Pomodoro technique (25 min work, 5 min break)');
      approaches.push('Set up a distraction-free study environment');
    }

    if (challenges.includes('Limited time availability for studies')) {
      approaches.push(
        'Focus on high-efficiency study techniques like spaced repetition',
      );
      approaches.push(
        'Prioritize subjects based on goals and upcoming deadlines',
      );
    }

    return approaches;
  }
}
