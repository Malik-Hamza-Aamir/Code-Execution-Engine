import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';
// import { Role, Provider } from '@leet-code-clone/types';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  password: string;

  @Column({ nullable: true })
  githubId: string;

  @Column({ nullable: true })
  googleId: string;

  // @Column({ type: 'enum', enum: Provider, default: Provider.LOCAL })
  // provider: string;

  @Column({ nullable: true })
  imgURL: string;

  @Column()
  dob: Date;

  // @Column({ type: 'enum', enum: Role, default: Role.USER })
  // role: Role;

  @CreateDateColumn()
  createdAt: Date;
}
