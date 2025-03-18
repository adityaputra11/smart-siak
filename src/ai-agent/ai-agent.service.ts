import { Injectable, Logger } from '@nestjs/common';
import { StudentMotivationDto } from './dto/student-motivation.dto';
import { StudyPlanDto } from './dto/study-plan.dto';
import { PerplexityApiService } from './services/perplexity-api.service';
import { MotivationAnalyzerService } from './services/motivation-analyzer.service';

@Injectable()
export class AiAgentService {
  private readonly logger = new Logger(AiAgentService.name);

  constructor(
    private readonly perplexityApiService: PerplexityApiService,
    private readonly motivationAnalyzerService: MotivationAnalyzerService,
  ) {}

  async generateStudyPlan(
    studentMotivation: StudentMotivationDto,
  ): Promise<StudyPlanDto> {
    this.logger.log(
      `Generating study plan for student: ${studentMotivation.name}`,
    );

    // First analyze the student's motivation
    const motivationAnalysis =
      this.motivationAnalyzerService.analyzeMotivation(studentMotivation);

    // Create a detailed prompt for the AI that includes the motivation analysis
    const prompt = this.createStudyPlanPrompt(
      studentMotivation,
      motivationAnalysis,
    );

    try {
      // Get AI recommendation from Perplexity API
      const aiResponse =
        await this.perplexityApiService.generateCompletion(prompt);

      // Parse and structure the AI response
      const studyPlan = this.parseAiResponseToStudyPlan(
        aiResponse,
        studentMotivation,
        motivationAnalysis,
      );

      return studyPlan;
    } catch (error) {
      this.logger.error(`Failed to generate study plan: ${error.message}`);
      throw error;
    }
  }

  private createStudyPlanPrompt(
    studentMotivation: StudentMotivationDto,
    motivationAnalysis: ReturnType<
      MotivationAnalyzerService['analyzeMotivation']
    >,
  ): string {
    return `
    I need a detailed, personalized study plan for a student with the following profile:
    
    Name: ${studentMotivation.name}
    Academic Level: ${studentMotivation.academicLevel}
    Subjects: ${studentMotivation.subjects.join(', ')}
    Interests: ${studentMotivation.interests.join(', ')}
    Goals: ${studentMotivation.goals.join(', ')}
    Motivation Level (1-10): ${studentMotivation.motivationLevel}
    Motivation Description: ${studentMotivation.motivationDescription}
    Learning Style: ${studentMotivation.learningStyle}
    Time Availability: ${studentMotivation.timeAvailability} hours per week
    ${
      studentMotivation.previousPerformance
        ? `Previous Performance: ${studentMotivation.previousPerformance
            .map((p) => `${p.subject}: ${p.grade}`)
            .join(', ')}`
        : ''
    }
    
    Motivation Analysis:
    - Motivation Type: ${motivationAnalysis.motivationType}
    - Strengths: ${motivationAnalysis.strengths.join(', ')}
    - Challenges: ${motivationAnalysis.challenges.join(', ')}
    - Recommended Approaches: ${motivationAnalysis.recommendedApproaches.join(', ')}
    
    Please create a comprehensive study plan that includes:
    1. An overall assessment of the student's motivation and how it impacts their learning
    2. A recommended approach tailored to their motivation level and learning style
    3. A detailed weekly schedule with specific activities for each subject
    4. Long-term goals broken down by timeframe
    5. Recommended resources for each subject
    6. Specific strategies to maintain or improve motivation
    
    The response should be detailed, practical, and actionable. Format your response in a way that can be easily parsed into sections.
    `;
  }

  private parseAiResponseToStudyPlan(
    aiResponse: string,
    studentMotivation: StudentMotivationDto,
    motivationAnalysis: ReturnType<
      MotivationAnalyzerService['analyzeMotivation']
    >,
  ): StudyPlanDto {
    // In a real implementation, you might want to use more sophisticated parsing
    // or have the AI return structured JSON directly

    // For now, we'll create a structure with the AI response embedded
    const studyPlan: StudyPlanDto = {
      studentId: studentMotivation.studentId,
      name: studentMotivation.name,
      generatedDate: new Date(),
      overview:
        this.extractSection(aiResponse, 'overview') ||
        'Study plan overview based on your motivation profile.',
      motivationAssessment:
        this.extractSection(aiResponse, 'motivation assessment') ||
        `As a ${motivationAnalysis.motivationType} student, you have strengths in ${motivationAnalysis.strengths.join(', ')}. 
        Areas to work on include ${motivationAnalysis.challenges.join(', ')}.`,
      recommendedApproach:
        this.extractSection(aiResponse, 'recommended approach') ||
        motivationAnalysis.recommendedApproaches.join('\n'),
      weeklySchedule: this.extractWeeklySchedule(aiResponse, studentMotivation),
      longTermGoals: this.extractLongTermGoals(aiResponse),
      recommendedResources: this.extractRecommendedResources(
        aiResponse,
        studentMotivation,
      ),
      motivationStrategies:
        this.extractMotivationStrategies(aiResponse) ||
        motivationAnalysis.recommendedApproaches,
    };

    return studyPlan;
  }

  private extractSection(text: string, sectionName: string): string | null {
    // Simple extraction logic - in a real app, use more robust parsing
    const regex = new RegExp(
      `(?:${sectionName}|${sectionName.toUpperCase()})[:\\s]+(.*?)(?=\\n\\n|$)`,
      'is',
    );
    const match = text.match(regex);
    return match ? match[1].trim() : null;
  }

  private extractWeeklySchedule(
    text: string,
    studentMotivation: StudentMotivationDto,
  ): StudyPlanDto['weeklySchedule'] {
    // Try to extract schedule from AI response
    const scheduleSection =
      this.extractSection(text, 'weekly schedule') ||
      this.extractSection(text, 'schedule');

    if (scheduleSection) {
      // Try to parse the AI's schedule format
      // This is a simplified implementation
      const days = [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday',
      ];
      const schedule = [];

      for (const day of days) {
        const dayRegex = new RegExp(
          `${day}[:\\s]+(.*?)(?=(?:\\n(?:${days.join('|')}))|$)`,
          'is',
        );
        const dayMatch = scheduleSection.match(dayRegex);

        if (dayMatch) {
          const activities = [];
          const dayContent = dayMatch[1];

          // Try to extract activities for each subject
          for (const subject of studentMotivation.subjects) {
            const subjectRegex = new RegExp(
              `${subject}[:\\s]+(.*?)(?=\\n|$)`,
              'i',
            );
            const subjectMatch = dayContent.match(subjectRegex);

            if (subjectMatch) {
              activities.push({
                subject,
                duration: 60, // Default 60 minutes
                activityType: 'Study',
                description: subjectMatch[1].trim(),
                resources: [],
              });
            }
          }

          schedule.push({
            day,
            activities:
              activities.length > 0
                ? activities
                : [
                    {
                      subject: 'General',
                      duration: 60,
                      activityType: 'Planning',
                      description: 'Review goals and plan detailed activities',
                      resources: [],
                    },
                  ],
          });
        } else {
          // If day not found in AI response, create a default entry
          schedule.push({
            day,
            activities: [],
          });
        }
      }

      return schedule;
    }

    // Fallback to basic implementation if parsing fails
    const days = [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
    ];

    return days.map((day) => {
      // Distribute subjects across days
      const daySubjects = studentMotivation.subjects.filter(
        (_, index) => index % days.length === days.indexOf(day),
      );

      return {
        day,
        activities: daySubjects.map((subject) => ({
          subject,
          duration: Math.floor(
            (studentMotivation.timeAvailability * 60) /
              (7 * studentMotivation.subjects.length),
          ),
          activityType: 'Study',
          description: `Focus on ${subject} concepts and practice problems`,
          resources: [],
        })),
      };
    });
  }

  private extractLongTermGoals(text: string): StudyPlanDto['longTermGoals'] {
    const goalsSection =
      this.extractSection(text, 'long-term goals') ||
      this.extractSection(text, 'goals');

    if (goalsSection) {
      const timeframes = ['short-term', 'medium-term', 'long-term'];
      const goals = [];

      for (const timeframe of timeframes) {
        const timeframeRegex = new RegExp(
          `${timeframe}[:\\s]+(.*?)(?=(?:\\n(?:${timeframes.join('|')}))|$)`,
          'is',
        );
        const timeframeMatch = goalsSection.match(timeframeRegex);

        if (timeframeMatch) {
          const timeframeContent = timeframeMatch[1];
          const goalsList = timeframeContent
            .split(/[\n•-]/)
            .map((goal) => goal.trim())
            .filter((goal) => goal.length > 0);

          goals.push({
            timeframe: timeframe.charAt(0).toUpperCase() + timeframe.slice(1),
            goals: goalsList,
          });
        }
      }

      if (goals.length > 0) {
        return goals;
      }
    }

    // Fallback to basic implementation
    return [
      {
        timeframe: 'Short-term (1 month)',
        goals: [
          'Master fundamental concepts',
          'Complete all assigned homework',
          'Improve study habits',
        ],
      },
      {
        timeframe: 'Medium-term (3 months)',
        goals: [
          'Achieve target grades in all subjects',
          'Complete personal projects',
          'Develop deeper understanding',
        ],
      },
      {
        timeframe: 'Long-term (6+ months)',
        goals: [
          'Prepare for advanced courses',
          'Build portfolio of work',
          'Achieve academic goals',
        ],
      },
    ];
  }

  private extractRecommendedResources(
    text: string,
    studentMotivation: StudentMotivationDto,
  ): StudyPlanDto['recommendedResources'] {
    const resourcesSection =
      this.extractSection(text, 'recommended resources') ||
      this.extractSection(text, 'resources');

    if (resourcesSection) {
      const resources = [];

      for (const subject of studentMotivation.subjects) {
        const subjectRegex = new RegExp(
          `${subject}[:\\s]+(.*?)(?=(?:\\n(?:${studentMotivation.subjects.join('|')}))|$)`,
          'is',
        );
        const subjectMatch = resourcesSection.match(subjectRegex);

        if (subjectMatch) {
          const subjectContent = subjectMatch[1];
          const resourcesList = subjectContent
            .split(/[\n•-]/)
            .map((resource) => resource.trim())
            .filter((resource) => resource.length > 0);

          resources.push({
            subject,
            resources: resourcesList.map((resource) => {
              // Try to extract resource type
              const typeMatch = resource.match(
                /^(book|video|course|online|website|app):/i,
              );
              const type = typeMatch
                ? typeMatch[1].charAt(0).toUpperCase() + typeMatch[1].slice(1)
                : 'Resource';

              // Try to extract URL if present
              const urlMatch = resource.match(/https?:\/\/[^\s]+/);
              const url = urlMatch ? urlMatch[0] : undefined;

              return {
                type,
                name: resource
                  .replace(/^(book|video|course|online|website|app):/i, '')
                  .trim(),
                url,
                description: resource,
              };
            }),
          });
        }
      }

      if (resources.length > 0) {
        return resources;
      }
    }

    // Fallback to basic implementation
    return studentMotivation.subjects.map((subject) => ({
      subject,
      resources: [
        {
          type: 'Online Course',
          name: `${subject} Fundamentals`,
          url: `https://example.com/${subject.toLowerCase().replace(' ', '-')}`,
          description: `Comprehensive ${subject} course tailored to your learning style`,
        },
        {
          type: 'Book',
          name: `${subject} Made Simple`,
          description: 'Beginner-friendly resource with practical examples',
        },
      ],
    }));
  }

  private extractMotivationStrategies(text: string): string[] {
    const strategiesSection =
      this.extractSection(text, 'motivation strategies') ||
      this.extractSection(text, 'strategies');

    if (strategiesSection) {
      return strategiesSection
        .split(/[\n•-]/)
        .map((strategy) => strategy.trim())
        .filter((strategy) => strategy.length > 0);
    }

    // Fallback to basic implementation
    return [
      'Set small, achievable daily goals to build momentum',
      'Use the Pomodoro technique (25 min work, 5 min break)',
      'Create a dedicated study environment free from distractions',
      'Reward yourself after completing challenging tasks',
      'Join or form a study group for accountability',
      'Track your progress visually to see improvements',
      'Connect learning material to your personal interests',
    ];
  }
}
