import { Problem } from '../../entities/problems.entity';

export class ProblemResponseDto {
  id: number;
  title: string;
  difficulty: string;
  description: string;
  acceptanceCount: number;
  tags: string[];

  constructor(problem: Problem) {
    this.id = problem.id;
    this.title = problem.title;
    this.difficulty = problem.difficulty;
    this.description = problem.description;
    this.acceptanceCount = problem.acceptanceCount;
    this.tags = problem.tags;
  }
}
