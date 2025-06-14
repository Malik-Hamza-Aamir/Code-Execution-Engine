import { Global, Module } from '@nestjs/common';
import { CommonRepository } from './common.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/users.entities';
import { RefreshToken } from '../entities/refresh-token.entities';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([User, RefreshToken])],
  providers: [CommonRepository],
  exports: [CommonRepository],
})
export class CommonRepositoryModule {}
