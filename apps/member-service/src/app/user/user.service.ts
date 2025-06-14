import { Injectable } from '@nestjs/common';
import { CommonRepository } from '../shared/repository/common.repository';

@Injectable()
export class UserService {
  constructor(private readonly repository: CommonRepository) {}

  async getProfileById(id: string) {
    return await this.repository.getProfileById(id);
  }

  async getProfileByEmail(email: string) {
    return await this.repository.getUser(email);
  }
}
