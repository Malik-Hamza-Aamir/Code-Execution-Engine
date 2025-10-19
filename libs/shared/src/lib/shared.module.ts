import 'dotenv/config';
import { Module, Logger } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Redis } from '@upstash/redis';
import { SharedRepository } from './repository';
import { Submission } from './entities/submission.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Submission])],
  providers: [
    {
      provide: 'REDIS_CLIENT',
      useFactory: () => {
        const url = process.env.UPSTASH_REDIS_REST_URL;
        const token = process.env.UPSTASH_REDIS_REST_TOKEN;

        Logger.log('🔗 Connecting to Upstash Redis at:', url);
        Logger.log('🔗 Connecting to Upstash Redis at:', token);

        if (!url || !token) {
          throw new Error(
            '❌ UPSTASH_REDIS_URL or UPSTASH_REDIS_TOKEN is missing'
          );
        }

        return new Redis({ url, token });
      },
    },
    SharedRepository,
  ],
  exports: ['REDIS_CLIENT', SharedRepository],
})
export class SharedModule {}
