import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PassportAuthModule } from '@leet-code-clone/passport-auth';
import { CommonRepositoryModule } from '../shared/repository/common-repository.module';

@Module({
  imports: [PassportAuthModule, CommonRepositoryModule],
  controllers: [UserController],
  providers: [UserService],
})
export class HealthModule {}
