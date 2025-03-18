import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subject } from './entities/subject.entity';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { StudentSubject } from './entities/student-subject.entity';
import { CreateStudentSubjectDto } from './dto/create-student-subject.dto';
import { UpdateStudentSubjectDto } from './dto/update-student-subject.dto';

@Injectable()
export class SubjectService {
  constructor(
    @InjectRepository(Subject)
    private subjectRepository: Repository<Subject>,
    @InjectRepository(StudentSubject)
    private studentSubjectRepository: Repository<StudentSubject>,
  ) {}

  // Subject methods
  async createSubject(createSubjectDto: CreateSubjectDto): Promise<Subject> {
    const subject = this.subjectRepository.create(createSubjectDto);
    return this.subjectRepository.save(subject);
  }

  async findAllSubjects(): Promise<Subject[]> {
    return this.subjectRepository.find();
  }

  async findSubjectById(id: string): Promise<Subject> {
    const subject = await this.subjectRepository.findOne({
      where: { id },
      relations: ['lectures', 'studentSubjects', 'studentSubjects.student'],
    });

    if (!subject) {
      throw new NotFoundException(`Subject with ID ${id} not found`);
    }

    return subject;
  }

  async findSubjectByCode(code: string): Promise<Subject> {
    const subject = await this.subjectRepository.findOne({
      where: { code },
      relations: ['lectures', 'studentSubjects', 'studentSubjects.student'],
    });

    if (!subject) {
      throw new NotFoundException(`Subject with code ${code} not found`);
    }

    return subject;
  }

  async updateSubject(
    id: string,
    updateSubjectDto: UpdateSubjectDto,
  ): Promise<Subject> {
    const subject = await this.findSubjectById(id);
    Object.assign(subject, updateSubjectDto);
    return this.subjectRepository.save(subject);
  }

  async removeSubject(id: string): Promise<void> {
    const result = await this.subjectRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Subject with ID ${id} not found`);
    }
  }

  // StudentSubject methods
  async enrollStudent(
    createStudentSubjectDto: CreateStudentSubjectDto,
  ): Promise<StudentSubject> {
    const studentSubject = this.studentSubjectRepository.create(
      createStudentSubjectDto,
    );
    return this.studentSubjectRepository.save(studentSubject);
  }

  async findStudentSubject(
    studentId: string,
    subjectId: string,
  ): Promise<StudentSubject> {
    const studentSubject = await this.studentSubjectRepository.findOne({
      where: { studentId, subjectId },
      relations: ['student', 'subject'],
    });

    if (!studentSubject) {
      throw new NotFoundException(
        `Enrollment for student ${studentId} in subject ${subjectId} not found`,
      );
    }

    return studentSubject;
  }

  async updateStudentSubject(
    studentId: string,
    subjectId: string,
    updateStudentSubjectDto: UpdateStudentSubjectDto,
  ): Promise<StudentSubject> {
    const studentSubject = await this.findStudentSubject(studentId, subjectId);
    Object.assign(studentSubject, updateStudentSubjectDto);
    return this.studentSubjectRepository.save(studentSubject);
  }

  async removeStudentSubject(
    studentId: string,
    subjectId: string,
  ): Promise<void> {
    const result = await this.studentSubjectRepository.delete({
      studentId,
      subjectId,
    });

    if (result.affected === 0) {
      throw new NotFoundException(
        `Enrollment for student ${studentId} in subject ${subjectId} not found`,
      );
    }
  }

  async findStudentsBySubject(subjectId: string): Promise<StudentSubject[]> {
    return this.studentSubjectRepository.find({
      where: { subjectId },
      relations: ['student'],
    });
  }

  async findSubjectsByStudent(studentId: string): Promise<StudentSubject[]> {
    return this.studentSubjectRepository.find({
      where: { studentId },
      relations: ['subject'],
    });
  }
}
