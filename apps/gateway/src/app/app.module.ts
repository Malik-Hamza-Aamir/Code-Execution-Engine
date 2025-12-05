import { Module } from '@nestjs/common';
import { ProblemController } from './controllers/problem/problem.controller';
import { PassportAuthModule } from '@leet-code-clone/passport-auth';

@Module({
  imports: [PassportAuthModule],
  controllers: [ProblemController],
  providers: [],
})
export class AppModule {}
