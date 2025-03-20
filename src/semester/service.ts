import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { Semester } from './entities/semester.entity';
import { CreateSemesterDto } from './dto/create-semester.dto';
import { UpdateSemesterDto } from './dto/update-semester.dto';
import { StudentSubject } from '../subject/entities/student-subject.entity';
import { Subject } from '../subject/entities/subject.entity';

@Injectable()
export class SemesterService {
  constructor(
    @InjectRepository(Semester)
    private semesterRepository: Repository<Semester>,
    @InjectRepository(StudentSubject)
    private studentSubjectRepository: Repository<StudentSubject>,
    @InjectRepository(Subject)
    private subjectRepository: Repository<Subject>,
  ) {}

  async create(createSemesterDto: CreateSemesterDto): Promise<Semester> {
    // Check if semester with the same code already exists
    const existingSemester = await this.semesterRepository.findOne({
      where: { code: createSemesterDto.code },
    });

    if (existingSemester) {
      throw new ConflictException(`Semester with code ${createSemesterDto.code} already exists`);
    }

    // If isActive is true, set all other semesters to inactive
    if (createSemesterDto.isActive) {
      await this.semesterRepository.update({}, { isActive: false });
    }

    const semester = this.semesterRepository.create(createSemesterDto);
    return this.semesterRepository.save(semester);
  }

  async findAll(): Promise<Semester[]> {
    return this.semesterRepository.find({
      order: { startDate: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Semester> {
    const semester = await this.semesterRepository.findOne({
      where: { id },
      relations: ['subjects'],
    });

    if (!semester) {
      throw new NotFoundException(`Semester with ID ${id} not found`);
    }

    return semester;
  }

  async findActive(): Promise<Semester> {
    const semester = await this.semesterRepository.findOne({
      where: { isActive: true },
    });

    if (!semester) {
      throw new NotFoundException('No active semester found');
    }

    return semester;
  }

  async update(id: string, updateSemesterDto: UpdateSemesterDto): Promise<Semester> {
    const semester = await this.findOne(id);

    // If isActive is being set to true, set all other semesters to inactive
    if (updateSemesterDto.isActive) {
      await this.semesterRepository.update({ id: Not(id) }, { isActive: false });
    }

    Object.assign(semester, updateSemesterDto);
    return this.semesterRepository.save(semester);
  }

  async remove(id: string): Promise<void> {
    const semester = await this.findOne(id);
    await this.semesterRepository.remove(semester);
  }

  async getStudentSemesterDashboard(studentId: string, semesterId?: string): Promise<any> {
    // If semesterId is not provided, use the active semester
    let targetSemesterId = semesterId;
    if (!targetSemesterId) {
      const activeSemester = await this.findActive();
      targetSemesterId = activeSemester.id;
    }

    // Get all subjects for the semester
    const subjects = await this.subjectRepository.find({
      where: { semesterId: targetSemesterId },
      relations: ['lecturer'],
    });

    // Get student's enrolled subjects for the semester
    const studentSubjects = await this.studentSubjectRepository.find({
      where: { studentId },
      relations: ['subject', 'subject.lecturer', 'subject.lectures'],
    });

    // Filter student subjects that belong to the target semester
    const semesterStudentSubjects = studentSubjects.filter(
      ss => ss.subject.semesterId === targetSemesterId
    );

    // Calculate GPA and total credits
    let totalPoints = 0;
    let totalCredits = 0;
    let completedCredits = 0;

    semesterStudentSubjects.forEach(ss => {
      if (ss.status === 'completed' && ss.grade) {
        const credits = ss.subject.credits;
        totalCredits += credits;
        
        // Convert grade to points
        let points = 0;
        switch (ss.grade) {
          case 'A': points = 4.0; break;
          case 'A-': points = 3.7; break;
          case 'B+': points = 3.3; break;
          case 'B': points = 3.0; break;
          case 'B-': points = 2.7; break;
          case 'C+': points = 2.3; break;
          case 'C': points = 2.0; break;
          case 'C-': points = 1.7; break;
          case 'D+': points = 1.3; break;
          case 'D': points = 1.0; break;
          case 'F': points = 0.0; break;
          default: points = 0.0;
        }
        
        totalPoints += points * credits;
        completedCredits += credits;
      }
    });

    const gpa = totalCredits > 0 ? totalPoints / totalCredits : 0;

    // Get the semester details
    const semester = await this.findOne(targetSemesterId);

    return {
      semester,
      enrolledSubjects: semesterStudentSubjects.map(ss => ({
        id: ss.id,
        subject: {
          id: ss.subject.id,
          name: ss.subject.name,
          code: ss.subject.code,
          credits: ss.subject.credits,
          description: ss.subject.description,
          lecturer: ss.subject.lecturer ? {
            id: ss.subject.lecturer.id,
            name: ss.subject.lecturer.name,
          } : null,
        },
        grade: ss.grade,
        score: ss.score,
        status: ss.status,
      })),
      availableSubjects: subjects.filter(
        subject => !semesterStudentSubjects.some(ss => ss.subjectId === subject.id)
      ).map(subject => ({
        id: subject.id,
        name: subject.name,
        code: subject.code,
        credits: subject.credits,
        description: subject.description,
        lecturer: subject.lecturer ? {
          id: subject.lecturer.id,
          name: subject.lecturer.name,
        } : null,
      })),
      stats: {
        totalCredits,
        completedCredits,
        gpa: parseFloat(gpa.toFixed(2)),
        enrolledSubjectsCount: semesterStudentSubjects.length,
        completedSubjectsCount: semesterStudentSubjects.filter(ss => ss.status === 'completed').length,
      }
    };
  }
}
