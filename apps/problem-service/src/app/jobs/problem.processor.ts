import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job, Queue } from 'bullmq';
import Redis from 'ioredis';
import { Inject } from '@nestjs/common';
import { Client } from '@elastic/elasticsearch';
import { ProblemResponseDto } from '../shared/dto/problem-response/problem-response.dto';

@Processor('problem')
export class ProblemProcessor extends WorkerHost {
  private readonly dlq: Queue;

  constructor(
    @Inject('REDIS_CLIENT') private readonly redis: Redis,
    @Inject('ELASTICSEARCH_CLIENT') private readonly esClient: Client
  ) {
    super();
    this.dlq = new Queue('problem-dlq', {
      connection: this.redis,
    });
  }

  async process(job: Job<any, any, string>): Promise<any> {
    const { name, id: jobId, data, opts } = job;

    try {
      if (name === 'syncProblem') {
        const { problem } = data;

        await this.redis.set(`problem:${problem.id}`, JSON.stringify(problem));
        const prob = new ProblemResponseDto(problem);
        
        const key = 'problems:all';
        const existing = await this.redis.get(key);
        let problems = existing ? JSON.parse(existing) : [];
        problems.push(prob);

        await this.redis.set(key, JSON.stringify(problems));

        await this.esClient.index({
          index: 'problems',
          id: problem.id.toString(),
          document: {
            id: problem.id,
            title: problem.title,
            description: problem.description,
            difficulty: problem.difficulty,
            acceptanceCount: problem.acceptanceCount,
            tags: problem.tags,
          },
          refresh: true,
        });

        console.log(`✅ Problem ${problem.id} synced to Redis + Elasticsearch`);
      }
    } catch (err) {
      if (job.attemptsMade >= (opts.attempts ?? 0)) {
        await this.dlq.add('deadLetter', data.problem);
        console.error(
          `[DLQ] Job ${jobId} sent to DLQ after ${job.attemptsMade} attempts`
        );
      }
      throw err;
    }
  }
}
