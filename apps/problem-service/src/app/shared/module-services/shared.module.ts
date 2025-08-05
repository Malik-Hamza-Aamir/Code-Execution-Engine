import { Module } from '@nestjs/common';
import Redis from 'ioredis';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SharedRepository } from './repository';
import { Problem } from '../entities/problems.entity';

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
    SharedRepository,
  ],
  exports: ['REDIS_CLIENT', SharedRepository],
})
export class SharedModule {}
