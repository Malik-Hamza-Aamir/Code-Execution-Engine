import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';
import { SharedRepository } from '../shared/module-services/repository';
import { CreateProblemDto } from '../shared/dto/create-problem/create-problem.dto';
import { ProblemQueue } from '../jobs/problem.queue';
import { ProblemResponseDto } from '../shared/dto/problem-response/problem-response.dto';

@Injectable()
export class ApiService implements OnModuleInit {
  private readonly ALL_PROBLEMS_CACHE_KEY = 'problems:all';

  constructor(
    @Inject('REDIS_CLIENT') private readonly redis: Redis,
    private readonly repository: SharedRepository,
    private readonly problemQueue: ProblemQueue
  ) {}

  async onModuleInit() {
    const allProblems = await this.repository.getAllProblems();
    await this.redis.set(this.ALL_PROBLEMS_CACHE_KEY, JSON.stringify(allProblems));
  }

  async getPaginatedProblems(page: number, limit: number, difficulty?: string, tagList?: string[]) {
    const cachedData = await this.redis.get(this.ALL_PROBLEMS_CACHE_KEY);
    let problems = cachedData ? JSON.parse(cachedData) : [];

    if (difficulty) {
      problems = problems.filter((p: any) => p.difficulty.toLowerCase() === difficulty.toLowerCase());
    }

    if (tagList?.length) {
      problems = problems.filter((p: any) => tagList.every(tag => p.tags.includes(tag)));
    }

    const start = (page - 1) * limit;
    const paginated = problems.slice(start, start + limit);

    return {
      problems: paginated,
      total: problems.length,
      page,
      limit,
      totalPages: Math.ceil(problems.length / limit),
    };
  }

  async createProblem(createProblemDto: CreateProblemDto) {
    const problem = await this.repository.createProblem(createProblemDto);
    const responseDto = new ProblemResponseDto(problem);
    this.problemQueue.addProblemSyncJob(responseDto)

    return responseDto;
  }
}