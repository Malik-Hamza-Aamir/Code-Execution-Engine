import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PassportAuthModule } from '@leet-code-clone/passport-auth';
import { SharedModule } from '../shared/module-services/shared.module';

@Module({
  imports: [PassportAuthModule, SharedModule],
  controllers: [UserController],
  providers: [UserService],
})
export class HealthModule {}
