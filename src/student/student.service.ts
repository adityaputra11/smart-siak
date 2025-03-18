import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from './entities/student.entity';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { CreateStudentWithUserDto } from './dto/create-student-with-user.dto';
import { AuthService } from '../auth/auth.service';
import { UserRole } from '../auth/entities/user.entity';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
    private authService: AuthService,
  ) {}

  async create(createStudentDto: CreateStudentDto): Promise<Student> {
    const existingStudent = await this.studentRepository.findOne({
      where: [{ nim: createStudentDto.nim }, { email: createStudentDto.email }],
    });

    if (existingStudent) {
      throw new ConflictException(
        'Student with this NIM or email already exists',
      );
    }

    const student = this.studentRepository.create(createStudentDto);
    return this.studentRepository.save(student);
  }

  async createWithUser(
    createStudentWithUserDto: CreateStudentWithUserDto,
  ): Promise<Student> {
    // First, create the user account
    const { username, password, ...studentData } = createStudentWithUserDto;

    const user = await this.authService.register({
      username,
      password,
      email: studentData.email,
      role: UserRole.STUDENT,
      fullName: studentData.name,
    });

    // Then create the student profile linked to the user
    const student = await this.create({
      ...studentData,
      userId: user.id,
    });

    // Return the student with user relation
    return student;
  }

  async findAll(): Promise<Student[]> {
    return this.studentRepository.find({
      relations: ['user', 'studentSubjects', 'studentSubjects.subject'],
    });
  }

  async findOne(id: string): Promise<Student> {
    const student = await this.studentRepository.findOne({
      where: { id },
      relations: ['user', 'studentSubjects', 'studentSubjects.subject'],
    });

    if (!student) {
      throw new NotFoundException(`Student with ID ${id} not found`);
    }

    return student;
  }

  async findByNim(nim: string): Promise<Student> {
    const student = await this.studentRepository.findOne({
      where: { nim },
      relations: ['user', 'studentSubjects', 'studentSubjects.subject'],
    });

    if (!student) {
      throw new NotFoundException(`Student with NIM ${nim} not found`);
    }

    return student;
  }

  async findByUserId(userId: string): Promise<Student> {
    const student = await this.studentRepository.findOne({
      where: { userId },
      relations: ['user', 'studentSubjects', 'studentSubjects.subject'],
    });

    if (!student) {
      throw new NotFoundException(`Student with User ID ${userId} not found`);
    }

    return student;
  }

  async update(
    id: string,
    updateStudentDto: UpdateStudentDto,
  ): Promise<Student> {
    const student = await this.findOne(id);

    // Check if NIM or email is being updated and if they already exist
    if (updateStudentDto.nim && updateStudentDto.nim !== student.nim) {
      const existingWithNim = await this.studentRepository.findOne({
        where: { nim: updateStudentDto.nim },
      });
      if (existingWithNim) {
        throw new ConflictException(
          `Student with NIM ${updateStudentDto.nim} already exists`,
        );
      }
    }

    if (updateStudentDto.email && updateStudentDto.email !== student.email) {
      const existingWithEmail = await this.studentRepository.findOne({
        where: { email: updateStudentDto.email },
      });
      if (existingWithEmail) {
        throw new ConflictException(
          `Student with email ${updateStudentDto.email} already exists`,
        );
      }
    }

    Object.assign(student, updateStudentDto);
    return this.studentRepository.save(student);
  }

  async remove(id: string): Promise<void> {
    const student = await this.findOne(id);
    await this.studentRepository.remove(student);
  }
}
