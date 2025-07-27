import { Module } from '@nestjs/common';
import Redis from 'ioredis';
import { ResendService } from './resend-email.service';
import { CommonRepository } from './common.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/users.entities';
import { RefreshToken } from '../entities/refresh-token.entities';

@Module({
  imports: [TypeOrmModule.forFeature([User, RefreshToken])],
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
    ResendService,
    CommonRepository,
  ],
  exports: ['REDIS_CLIENT', ResendService, CommonRepository],
})
export class SharedModule {}
