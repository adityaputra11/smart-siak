import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Lecture } from './entities/lecture.entity';
import { CreateLectureDto } from './dto/create-lecture.dto';
import { UpdateLectureDto } from './dto/update-lecture.dto';
import { PaginationDto, PaginatedResponse, paginate } from '../common';

@Injectable()
export class LectureService {
  constructor(
    @InjectRepository(Lecture)
    private lectureRepository: Repository<Lecture>,
  ) {}

  async create(createLectureDto: CreateLectureDto): Promise<Lecture> {
    const lecture = this.lectureRepository.create({
      ...createLectureDto,
      startTime: new Date(createLectureDto.startTime),
      endTime: new Date(createLectureDto.endTime),
    });
    return this.lectureRepository.save(lecture);
  }

  async findAll(
    paginationDto?: PaginationDto,
  ): Promise<PaginatedResponse<Lecture> | Lecture[]> {
    if (paginationDto) {
      const queryBuilder = this.lectureRepository
        .createQueryBuilder('lecture')
        .leftJoinAndSelect('lecture.subject', 'subject')
        .orderBy('lecture.startTime', 'ASC');

      return paginate<Lecture>(queryBuilder, paginationDto);
    }

    return this.lectureRepository.find({
      relations: ['subject'],
      order: { startTime: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Lecture> {
    const lecture = await this.lectureRepository.findOne({
      where: { id },
      relations: ['subject'],
    });

    if (!lecture) {
      throw new NotFoundException(`Lecture with ID ${id} not found`);
    }

    return lecture;
  }

  async findBySubject(
    subjectId: string,
    paginationDto?: PaginationDto,
  ): Promise<PaginatedResponse<Lecture> | Lecture[]> {
    if (paginationDto) {
      const queryBuilder = this.lectureRepository
        .createQueryBuilder('lecture')
        .leftJoinAndSelect('lecture.subject', 'subject')
        .where('lecture.subjectId = :subjectId', { subjectId })
        .orderBy('lecture.startTime', 'ASC');

      return paginate<Lecture>(queryBuilder, paginationDto);
    }

    return this.lectureRepository.find({
      where: { subjectId },
      relations: ['subject'],
      order: { startTime: 'ASC' },
    });
  }

  async findByDateRange(
    startDate: string,
    endDate: string,
    paginationDto?: PaginationDto,
  ): Promise<PaginatedResponse<Lecture> | Lecture[]> {
    const startDateTime = new Date(startDate);
    const endDateTime = new Date(endDate);

    if (paginationDto) {
      const queryBuilder = this.lectureRepository
        .createQueryBuilder('lecture')
        .leftJoinAndSelect('lecture.subject', 'subject')
        .where('lecture.startTime BETWEEN :startDateTime AND :endDateTime', {
          startDateTime,
          endDateTime,
        })
        .orderBy('lecture.startTime', 'ASC');

      return paginate<Lecture>(queryBuilder, paginationDto);
    }

    return this.lectureRepository.find({
      where: {
        startTime: Between(startDateTime, endDateTime),
      },
      relations: ['subject'],
      order: { startTime: 'ASC' },
    });
  }

  async update(
    id: string,
    updateLectureDto: UpdateLectureDto,
  ): Promise<Lecture> {
    const lecture = await this.findOne(id);

    // Create a new object without date fields to avoid type conflicts
    const { startTime, endTime, ...otherFields } = updateLectureDto;

    // Apply non-date fields first
    Object.assign(lecture, otherFields);

    // Handle date fields separately with proper type conversion
    if (startTime) {
      lecture.startTime = new Date(startTime);
    }

    if (endTime) {
      lecture.endTime = new Date(endTime);
    }

    return this.lectureRepository.save(lecture);
  }

  async remove(id: string): Promise<void> {
    const result = await this.lectureRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Lecture with ID ${id} not found`);
    }
  }
}
