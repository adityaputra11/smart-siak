import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { Student } from '../../student/entities/student.entity';
import { Subject } from './subject.entity';

@Entity()
export class StudentSubject {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Student, (student) => student.studentSubjects)
  @JoinColumn({ name: 'student_id' })
  student: Student;

  @Column({ name: 'student_id' })
  studentId: string;

  @ManyToOne(() => Subject, (subject) => subject.studentSubjects)
  @JoinColumn({ name: 'subject_id' })
  subject: Subject;

  @Column({ name: 'subject_id' })
  subjectId: string;

  @Column({ nullable: true })
  grade: string;

  @Column({ type: 'float', nullable: true })
  score: number;

  @Column({ default: 'enrolled' })
  status: string; // enrolled, completed, dropped

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;
}
