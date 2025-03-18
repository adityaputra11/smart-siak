import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lecturer } from './entity/lecturer.entity';
import { CreateLecturerDto } from './dto/create-lecturer.dto';
import { UpdateLecturerDto } from './dto/update-lecturer.dto';
import { CreateLecturerWithUserDto } from './dto/create-lecturer-with-user.dto';
import { AuthService } from '../auth/auth.service';
import { UserRole } from '../auth/entities/user.entity';

@Injectable()
export class LecturerService {
  constructor(
    @InjectRepository(Lecturer)
    private lecturerRepository: Repository<Lecturer>,
    private authService: AuthService,
  ) {}

  async create(createLecturerDto: CreateLecturerDto): Promise<Lecturer> {
    const existingLecturer = await this.lecturerRepository.findOne({
      where: [
        { nip: createLecturerDto.nip },
        { email: createLecturerDto.email },
      ],
    });

    if (existingLecturer) {
      throw new ConflictException(
        'Lecturer with this NIP or email already exists',
      );
    }

    const lecturer = this.lecturerRepository.create(createLecturerDto);
    return this.lecturerRepository.save(lecturer);
  }

  async createWithUser(
    createLecturerWithUserDto: CreateLecturerWithUserDto,
  ): Promise<Lecturer> {
    // First, create the user account
    const { username, password, ...lecturerData } = createLecturerWithUserDto;

    const user = await this.authService.register({
      username,
      password,
      email: lecturerData.email,
      role: UserRole.LECTURER,
      fullName: lecturerData.name,
    });

    // Then create the lecturer profile linked to the user
    const lecturer = await this.create({
      ...lecturerData,
      userId: user.id,
    });

    return lecturer;
  }

  async findAll(): Promise<Lecturer[]> {
    return this.lecturerRepository.find({
      relations: ['user', 'subjects'],
    });
  }

  async findOne(id: string): Promise<Lecturer> {
    const lecturer = await this.lecturerRepository.findOne({
      where: { id },
      relations: ['user', 'subjects'],
    });

    if (!lecturer) {
      throw new NotFoundException(`Lecturer with ID ${id} not found`);
    }

    return lecturer;
  }

  async findByNip(nip: string): Promise<Lecturer> {
    const lecturer = await this.lecturerRepository.findOne({
      where: { nip },
      relations: ['user', 'subjects'],
    });

    if (!lecturer) {
      throw new NotFoundException(`Lecturer with NIP ${nip} not found`);
    }

    return lecturer;
  }

  async findByUserId(userId: string): Promise<Lecturer> {
    const lecturer = await this.lecturerRepository.findOne({
      where: { userId },
      relations: ['user', 'subjects'],
    });

    if (!lecturer) {
      throw new NotFoundException(`Lecturer with User ID ${userId} not found`);
    }

    return lecturer;
  }

  async update(
    id: string,
    updateLecturerDto: UpdateLecturerDto,
  ): Promise<Lecturer> {
    const lecturer = await this.findOne(id);

    // Check if NIP or email is being updated and if they already exist
    if (updateLecturerDto.nip && updateLecturerDto.nip !== lecturer.nip) {
      const existingWithNip = await this.lecturerRepository.findOne({
        where: { nip: updateLecturerDto.nip },
      });
      if (existingWithNip) {
        throw new ConflictException(
          `Lecturer with NIP ${updateLecturerDto.nip} already exists`,
        );
      }
    }

    if (updateLecturerDto.email && updateLecturerDto.email !== lecturer.email) {
      const existingWithEmail = await this.lecturerRepository.findOne({
        where: { email: updateLecturerDto.email },
      });
      if (existingWithEmail) {
        throw new ConflictException(
          `Lecturer with email ${updateLecturerDto.email} already exists`,
        );
      }
    }

    Object.assign(lecturer, updateLecturerDto);
    return this.lecturerRepository.save(lecturer);
  }

  async remove(id: string): Promise<void> {
    const lecturer = await this.findOne(id);
    await this.lecturerRepository.remove(lecturer);
  }
}
