import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto/create-user.dto.js';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/users.entities.js';
import { RefreshToken } from '../entities/refresh-token.entities.js';
import { DataSource } from 'typeorm';
import { Role, User as UserType } from '@leet-code-clone/types';
import { UpdateProfileDto } from '../dto/update-profile.dto/update-profile.dto.js';
import { AllUsersDto } from '../dto/all-users.dto/all-users.dto.js';

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
      if (error.code === '23505') {
        throw new ConflictException('Email is already registered');
      }
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

  async checkProfileAlreadyExistsUsingEmail(email: string) {
    try {
      return await this.usersRepository.findOneBy({ email });
    } catch (error) {
      console.log('[failed to get profile]', error);
      throw new InternalServerErrorException('Failed to Fetch Profile');
    }
  }

  async createNewUser(user: UserType) {
    try {
      const newUser: Partial<User> = {
        username: user.username,
        email: user.email,
        password: user.password ?? undefined,
        githubId: user.githubId ?? undefined,
        googleId: user.googleId ?? undefined,
        provider: user.provider,
        imgURL: user.imgUrl ?? undefined,
        dob: user.dob ? new Date(user.dob) : undefined,
        role: user.role,
      };

      const userResp = this.usersRepository.create(newUser);
      return await this.usersRepository.save(userResp);
    } catch (error: any) {
      if (error.code === '23505') {
        throw new ConflictException('Email is already registered');
      }
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  async updateProfileInfo(id: number, updateProfileDto: UpdateProfileDto) {
    try {
      const result = await this.usersRepository.update(id, updateProfileDto);

      if (result.affected === 0) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      const updatedUser = await this.usersRepository.findOneBy({ id });
      return updatedUser;
    } catch (error: any) {
      console.error('[updateProfileInfo error]', error);
      throw new InternalServerErrorException('Failed to update profile');
    }
  }

  async getAllUsers() {
    try {
      const users = await this.usersRepository.find({
        where: { role: Role.USER },
      });
      return users;
    } catch (error) {
      console.error('[get all users error]', error);
      throw new InternalServerErrorException('Failed to Get Users Information');
    }
  }

  async updateUserRole(user: AllUsersDto) {
    try {
      const id = user.id;
      const userDat: Partial<User> = {
        username: user.username,
        role: Role.ADMIN,
      };
      const result = await this.usersRepository.update(id, userDat);
      let isUpdated = false;

      if (result.affected === 0) {
        throw new NotFoundException(`User with ID ${id} not found`);
      } else {
        isUpdated = true;
      }

      return isUpdated;
    } catch (error) {
      console.error('[updateProfileRole error]', error);
      throw new InternalServerErrorException('Failed to update profile');
    }
  }
}
