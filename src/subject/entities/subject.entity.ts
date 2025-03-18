import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';
import { StudentSubject } from './student-subject.entity';
import { Lecture } from '../../lecture/entities/lecture.entity';

@Entity()
export class Subject {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  code: string;

  @Column()
  credits: number;

  @Column({ nullable: true })
  description: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => StudentSubject, (studentSubject) => studentSubject.subject)
  studentSubjects: StudentSubject[];

  @OneToMany(() => Lecture, (lecture) => lecture.subject)
  lectures: Lecture[];
}
