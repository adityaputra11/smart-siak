export class StudentMotivationDto {
  studentId: string;
  name: string;
  academicLevel: string;
  subjects: string[];
  interests: string[];
  goals: string[];
  motivationLevel: number; // 1-10 scale
  motivationDescription: string;
  learningStyle: string;
  timeAvailability: number; // hours per week
  previousPerformance?: {
    subject: string;
    grade: string;
  }[];
}
