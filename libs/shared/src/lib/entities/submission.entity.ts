import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('submissions')
export class Submission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  problemId: number;

  @Column({ length: 20 })
  language: string;

  @Column('text')
  code: string;

  @Column({ length: 20 })
  status: string;

  @Column({ nullable: true })
  exec_time_ms: number;

  @Column({ nullable: true })
  memory_kb: number;

  @Column({ type: 'jsonb', nullable: true })
  result_summary: Record<string, any>;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
