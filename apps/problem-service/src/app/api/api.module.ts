import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { SharedModule } from '../shared/module-services/shared.module.js';
import { ApiService } from './api.service.js';
import { ApiController } from './api.controller.js';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
    }),
    SharedModule,
  ],
  controllers: [ApiController],
  providers: [ApiService],
})
export class ApiModule {}
