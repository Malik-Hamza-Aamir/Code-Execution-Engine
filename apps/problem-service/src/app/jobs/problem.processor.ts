import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job, Queue } from 'bullmq';
import Redis from 'ioredis';
import { Inject } from '@nestjs/common';

@Processor('problem')
export class ProblemProcessor extends WorkerHost {
  private readonly dlq: Queue;

  constructor(@Inject('REDIS_CLIENT') private readonly redis: Redis) {
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

        const key = 'problems:all';
        const existing = await this.redis.get(key);
        let problems = existing ? JSON.parse(existing) : [];
        problems.push(problem);

        await this.redis.set(key, JSON.stringify(problems));
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
