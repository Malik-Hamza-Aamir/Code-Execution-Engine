import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller.js';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service.js';
import { PassportAuthModule } from '@leet-code-clone/passport-auth';
import { CommonRepositoryModule } from '../shared/repository/common-repository.module.js';

@Module({
  imports: [
    PassportAuthModule,
    CommonRepositoryModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
