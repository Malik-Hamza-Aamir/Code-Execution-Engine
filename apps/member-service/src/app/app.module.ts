import { Module } from '@nestjs/common';
import { PassportAuthModule } from '@leet-code-clone/passport-auth';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module.js';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    PassportAuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'hamza123',
      database: 'memberdb',
      autoLoadEntities: true,
      synchronize: true,
    }),
  ],
  controllers: [],
  providers: [PassportAuthModule],
})
export class AppModule {}
