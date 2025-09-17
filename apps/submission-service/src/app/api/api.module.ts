import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { SharedModule } from '@leet-code-clone/shared';
import { ApiService } from './api.service.js';
import { ApiController } from './api.controller.js';
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
    }),
    BullModule.registerQueue({
      name: 'submissions',
    }),
    SharedModule,
  ],
  controllers: [ApiController],
  providers: [ApiService],
})
export class ApiModule {}
