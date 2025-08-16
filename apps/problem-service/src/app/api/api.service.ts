import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';
import { SharedRepository } from '../shared/module-services/repository';
import { CreateProblemDto } from '../shared/dto/create-problem/create-problem.dto';
import { ProblemQueue } from '../jobs/problem.queue';
import { ProblemResponseDto } from '../shared/dto/problem-response/problem-response.dto';
import { Client } from '@elastic/elasticsearch';

@Injectable()
export class ApiService implements OnModuleInit {
  private readonly ALL_PROBLEMS_CACHE_KEY = 'problems:all';

  constructor(
    @Inject('REDIS_CLIENT') private readonly redis: Redis,
    @Inject('ELASTICSEARCH_CLIENT') private readonly esClient: Client,
    private readonly repository: SharedRepository,
    private readonly problemQueue: ProblemQueue
  ) {}

  async syncProblemsToElasticsearch(problems: any[]) {
    if (!problems.length) return;

    const body = problems.flatMap((problem) => [
      { index: { _index: 'problems', _id: problem.id.toString() } },
      {
        id: problem.id,
        title: problem.title,
        description: problem.description,
        difficulty: problem.difficulty,
        acceptanceCount: problem.acceptanceCount,
        tags: problem.tags,
      },
    ]);

    await this.esClient.bulk({
      refresh: true,
      body,
    });
  }

  async ensureProblemsIndex() {
    const indexName = 'problems';

    const exists = await this.esClient.indices.exists({ index: indexName });

    if (!exists) {
      await this.esClient.indices.create({
        index: indexName,
        mappings: {
          properties: {
            id: { type: 'integer' },
            title: { type: 'text' },
            description: { type: 'text' },
            difficulty: { type: 'keyword' },
            acceptanceCount: { type: 'integer' },
            tags: { type: 'keyword' },
          },
        },
      });

      console.log(`Created index: ${indexName}`);
    } else {
      console.log(`Index already exists: ${indexName}`);
    }
  }

  async onModuleInit() {
    await this.ensureProblemsIndex();
    const allProblems = await this.repository.getAllProblems();
    await this.redis.set(
      this.ALL_PROBLEMS_CACHE_KEY,
      JSON.stringify(allProblems)
    );
    await this.syncProblemsToElasticsearch(allProblems);
  }

  async getPaginatedProblems(
    page: number,
    limit: number,
    difficulty?: string,
    tagList?: string[]
  ) {
    const cachedData = await this.redis.get(this.ALL_PROBLEMS_CACHE_KEY);
    let problems = cachedData ? JSON.parse(cachedData) : [];

    if (difficulty) {
      problems = problems.filter(
        (p: any) => p.difficulty.toLowerCase() === difficulty.toLowerCase()
      );
    }

    if (tagList?.length) {
      problems = problems.filter((p: any) =>
        tagList.every((tag) => p.tags.includes(tag))
      );
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
    this.problemQueue.addProblemSyncJob(responseDto);

    return responseDto;
  }

  async searchProblems(query: string, difficulty?: string, tags?: string[]) {
    const must: any[] = [];

    if (query) {
      must.push({
        multi_match: {
          query,
          fields: ['title^3', 'description', 'tags'], 
        },
      });
    }

    if (difficulty) {
      must.push({ term: { difficulty: difficulty.toLowerCase() } });
    }

    if (tags?.length) {
      must.push({ terms: { tags } });
    }

    const result = await this.esClient.search({
      index: 'problems',
      query: must.length > 0 ? { bool: { must } } : { match_all: {} },
    });

    return result.hits.hits.map((hit: any) => hit._source);
  }
}
