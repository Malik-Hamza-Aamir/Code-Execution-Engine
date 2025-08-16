import { Module } from '@nestjs/common';
import Redis from 'ioredis';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SharedRepository } from './repository';
import { Problem } from '../entities/problems.entity';
import { Client } from '@elastic/elasticsearch';

@Module({
  imports: [TypeOrmModule.forFeature([Problem])],
  providers: [
    {
      provide: 'REDIS_CLIENT',
      useFactory: () => {
        return new Redis({
          host: process.env.REDIS_HOST,
          port: Number(process.env.REDIS_PORT),
        });
      },
    },
    {
      provide: 'ELASTICSEARCH_CLIENT',
      useFactory: () => {
        return new Client({
          node: `${process.env.ELASTICSEARCH_NODE}`,
        });
      },
    },
    SharedRepository,
  ],
  exports: ['REDIS_CLIENT', 'ELASTICSEARCH_CLIENT', SharedRepository],
})
export class SharedModule {}
