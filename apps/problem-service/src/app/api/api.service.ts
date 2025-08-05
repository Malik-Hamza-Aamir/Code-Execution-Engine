import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { SharedRepository } from '../shared/module-services/repository';

@Injectable()
export class ApiService {
  constructor(
    @Inject('REDIS_CLIENT') private readonly redis: Redis,
    private readonly repository: SharedRepository
  ) {}

  async getAllProblems() {
    // first get problems from redis
    // if problems are not these then cache them and call db for return
  }
}
