import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ProblemQueue } from './problem.queue';
import { ProblemProcessor } from './problem.processor';
import { SharedModule } from '../shared/module-services/shared.module';

@Module({
  imports: [
    BullModule.registerQueue({ name: 'problem' }),
    BullModule.registerQueue({ name: 'problem-dlq' }),
    SharedModule,
  ],
  providers: [ProblemQueue, ProblemProcessor],
  exports: [ProblemQueue],
})
export class JobsModule {}
