import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';
import { Subject } from '../../subject/entities/subject.entity';

@Entity()
export class Lecture {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'timestamp', name: 'start_time' })
  startTime: Date;

  @Column({ type: 'timestamp', name: 'end_time' })
  endTime: Date;

  @Column({ nullable: true })
  location: string;

  @Column({ nullable: true, name: 'meeting_link' })
  meetingLink: string;

  @ManyToOne(() => Subject, (subject) => subject.lectures)
  @JoinColumn({ name: 'subject_id' })
  subject: Subject;

  @Column({ name: 'subject_id' })
  subjectId: string;

  @Column({ default: 'scheduled' })
  status: string; // scheduled, ongoing, completed, cancelled

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
