import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto/create-user.dto.js';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/users.entities.js';
import { RefreshToken } from '../entities/refresh-token.entities.js';
import { DataSource } from 'typeorm';

interface IRefreshToken {
  userId: number;
  token: string;
  expiresAt: Date;
}

@Injectable()
export class CommonRepository {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    @InjectRepository(RefreshToken)
    private refreshTokenRepository: Repository<RefreshToken>,
    private readonly dataSource: DataSource
  ) {}

  async createUser(data: CreateUserDto) {
    try {
      const user = this.usersRepository.create(data);
      return await this.usersRepository.save(user);
    } catch (error: any) {
      console.log('[db error]', error);
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  async getUser(email: string) {
    try {
      const user = await this.usersRepository.findOneBy({ email });
      return user;
    } catch (error) {
      console.log('[get user error]', error);
      throw new InternalServerErrorException('Failed to fetch user');
    }
  }

  async saveRefreshToken(data: IRefreshToken) {
    try {
      await this.dataSource.transaction(async (manager) => {
        await manager.delete(RefreshToken, { user: { id: data.userId } });

        const refreshToken = manager.create(RefreshToken, data);
        await manager.save(RefreshToken, refreshToken);
      });
    } catch (error) {
      console.error('[Failed to update refresh token]', error);
      throw new InternalServerErrorException('Could not save refresh token');
    }
  }

  async clearRefreshToken(userId: number) {
    try {
      const deletedRefreshToken = await this.refreshTokenRepository.delete({
        user: { id: userId },
      });

      return deletedRefreshToken;
    } catch (error) {
      console.log('[failed to clear refresh token]', error);
      throw new InternalServerErrorException('Failed to clear token');
    }
  }

  async getProfileById(id: string) {
    try {
      const ID = Number(id);
      const user = await this.usersRepository.findOneBy({ id: ID });
      return {
        id: user?.id,
        email: user?.email,
        role: user?.role,
        password: user?.password,
        username: user?.username,
        dob: user?.dob,
      };
    } catch (error) {
      console.log('[failed to get complete profile]', error);
      throw new InternalServerErrorException('Failed to Fetch Profile');
    }
  }
}
