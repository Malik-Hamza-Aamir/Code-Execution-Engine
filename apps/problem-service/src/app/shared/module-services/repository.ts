import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
// import { DataSource } from 'typeorm';
import { Problem } from '../entities/problems.entity';
import { CreateProblemDto } from '../dto/create-problem/create-problem.dto';

@Injectable()
export class SharedRepository {
  constructor(
    @InjectRepository(Problem) private problemRepository: Repository<Problem>
  ) //private readonly dataSource: DataSource // for transactions
  {}

  async createProblem(data: CreateProblemDto) {
    try {
      const problem = this.problemRepository.create(data);
      return await this.problemRepository.save(problem);
    } catch (error: any) {
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  async getAllProblems() {
    try {
      const problems = await this.problemRepository.find({
        select: ['id', 'title', 'difficulty', 'description', 'acceptanceCount', 'tags']
      });
      return problems;
    } catch (error) {
      console.log('[get problems error]', error);
      throw new InternalServerErrorException('Failed to fetch user');
    }
  }
}
