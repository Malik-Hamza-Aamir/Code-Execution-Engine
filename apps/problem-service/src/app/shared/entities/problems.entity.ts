import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Difficulty } from "@leet-code-clone/types";

@Entity('problems')
export class Problem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  inputFormat: string;

  @Column()
  outputFormat: string;

  @Column()
  constraints: string;

  @Column({ type: 'enum', enum: Difficulty, default: Difficulty.easy })
  difficulty: string;

  @Column({ type: 'int', default: 0 })
  acceptanceCount: number;

  @Column({ type: 'int', default: 0 })
  submissionCount: number;

  @Column('jsonb', { nullable: true })
  testCases: {
    input: string;
    output: string;
  }[];

  @Column('jsonb', { nullable: true })
  starterCode: {
    [language: string]: string;
  };

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
