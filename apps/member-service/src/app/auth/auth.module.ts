import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller.js';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service.js';
import { PassportAuthModule } from '@leet-code-clone/passport-auth';
import { SharedModule } from '../shared/module-services/shared.module.js';

@Module({
  imports: [
    PassportAuthModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
    }),
    SharedModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
