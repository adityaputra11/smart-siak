import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Subject } from '../../subject/entities/subject.entity';

@Entity()
export class Semester {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  code: string;

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'date' })
  endDate: Date;

  @Column({ default: false, name: 'is_active' })
  isActive: boolean;

  @Column({ nullable: true })
  academicYear: string;

  @Column({ default: 'regular' })
  type: string; // regular, short, summer

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => Subject, (subject) => subject.semester)
  subjects: Subject[];
}
