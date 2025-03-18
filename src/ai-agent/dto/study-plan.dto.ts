export class StudyPlanDto {
  studentId: string;
  name: string;
  generatedDate: Date;
  overview: string;
  motivationAssessment: string;
  recommendedApproach: string;
  weeklySchedule: {
    day: string;
    activities: {
      subject: string;
      duration: number; // in minutes
      activityType: string; // e.g., "Study", "Practice", "Review"
      description: string;
      resources?: string[];
    }[];
  }[];
  longTermGoals: {
    timeframe: string;
    goals: string[];
  }[];
  recommendedResources: {
    subject: string;
    resources: {
      type: string; // e.g., "Book", "Online Course", "Video"
      name: string;
      url?: string;
      description: string;
    }[];
  }[];
  motivationStrategies: string[];
}
