import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
// import { DataSource } from 'typeorm';
import { Problem } from '../entities/problems.entity';

@Injectable()
export class SharedRepository {
  constructor(
    @InjectRepository(Problem) private problemRepository: Repository<Problem>
  ) //private readonly dataSource: DataSource // for transactions
  {}

  async getAllProblems() {
    try {
      const problems = await this.problemRepository.find({
        select: ['id', 'title', 'difficulty', 'description', 'acceptanceCount']
      });
      return problems;
    } catch (error) {
      console.log('[get problems error]', error);
      throw new InternalServerErrorException('Failed to fetch user');
    }
  }
}
