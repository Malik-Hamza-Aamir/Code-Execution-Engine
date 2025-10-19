import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { SharedModule } from '@leet-code-clone/shared';
import { WorkerProcessor } from './worker.processor';
import { SandboxService } from './sandbox/sandbox.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { TemplateService } from './sandbox/template.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USERNAME,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DATABASE,
      autoLoadEntities: true,
      synchronize: true,
    }),
    BullModule.forRoot({
      connection: {
        host: process.env.UPSTASH_REDIS_HOST,
        port: Number(process.env.UPSTASH_REDIS_PORT),
        username: process.env.UPSTASH_REDIS_USERNAME,
        password: process.env.UPSTASH_REDIS_PASSWORD,
        tls: {},
      },
    }),
    BullModule.registerQueue({
      name: 'submissions',
    }),
    SharedModule,
  ],
  providers: [WorkerProcessor, SandboxService, TemplateService],
})
export class AppModule {}
