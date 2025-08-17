import { Inject, Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import Redis from 'ioredis';

@Injectable()
export class ProblemQueue {
  private readonly queue: Queue;

  constructor(@Inject('REDIS_CLIENT') private readonly redis: Redis) {
    this.queue = new Queue('problem', {
      connection: this.redis,
    });
  }

  async addProblemSyncJob(problem: any) {
    await this.queue.add(
      'syncProblem',
      { problem },
      {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 3000,
        },
        removeOnFail: false,
      }
    );
  }
}
