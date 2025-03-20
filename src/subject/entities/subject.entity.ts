import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  UpdateDateColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { StudentSubject } from './student-subject.entity';
import { Lecture } from '../../lecture/entities/lecture.entity';
import { Lecturer } from '../../lecture/entity/lecturer.entity';
import { Semester } from '../../semester/entities/semester.entity';

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

  @Column({ default: true, name: 'is_active' })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => StudentSubject, (studentSubject) => studentSubject.subject)
  studentSubjects: StudentSubject[];

  @OneToMany(() => Lecture, (lecture) => lecture.subject)
  lectures: Lecture[];

  @ManyToOne(() => Lecturer, (lecturer) => lecturer.subjects, {
    nullable: true,
  })
  @JoinColumn({ name: 'lecturer_id' })
  lecturer: Lecturer;

  @Column({ nullable: true })
  lecturerId: string;

  @ManyToOne(() => Semester, (semester) => semester.subjects, {
    nullable: true,
  })
  @JoinColumn({ name: 'semester_id' })
  semester: Semester;

  @Column({ nullable: true })
  semesterId: string;
}
