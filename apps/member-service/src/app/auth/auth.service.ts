import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../shared/dto/create-user.dto/create-user.dto.js';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from '../shared/dto/login-user.dto/login-user.dto.js';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { CommonRepository } from '../shared/repository/common.repository.js';
import { User, Provider, Role } from '@leet-code-clone/types';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: CommonRepository,
    private jwtService: JwtService
  ) {}

  async register(createUserDto: CreateUserDto) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

    createUserDto = { ...createUserDto, password: hashedPassword };
    await this.authRepository.createUser(createUserDto);
    return { redirect: '/login' };
  }

  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;

    const user = await this.authRepository.getUser(email);
    if (!user) {
      return { success: false, message: 'Invalid credentials' };
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return { success: false, message: 'Invalid credentials' };
    }

    const { password: _, ...userWithoutPassword } = user;

    const payload = {
      sub: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload, { expiresIn: '1d' });

    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d',
    });

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await this.authRepository.saveRefreshToken({
      userId: user.id,
      token: refreshToken,
      expiresAt: expiresAt,
    });

    return {
      success: true,
      token: accessToken,
      refreshToken,
      user: userWithoutPassword,
    };
  }

  async logout(userId: number, res: Response) {
    await this.authRepository.clearRefreshToken(userId);

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
    });

    return { message: 'Cookie Clear' };
  }

  async getNewTokens(user: any) {
    const payload = {
      sub: user.userId,
      email: user.email,
      username: user.username,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '1d',
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d',
    });

    return { accessToken, refreshToken };
  }

  async generateToken(user: any, provider: string) {
    const payload: User = {
      email: user.emails[0].value,
      username: user._json.name,
      password: null,
      githubId: provider === "github" ? user.id : null,
      googleId: provider === "google" ? user.id : null,
      provider: provider === "github" ? Provider.GITHUB : Provider.GOOGLE,
      imgUrl: user.photos[0].value,
      dob: null,
      role: Role.USER,
    };

    return this.generateJwt(payload);
  }

  async generateJwt(payload: User) {
    const existingUser =
      await this.authRepository.checkProfileAlreadyExistsUsingEmail(
        payload.email
      );

    let userEntity;

    if (existingUser) {
      userEntity = existingUser;
    } else {
      userEntity = await this.authRepository.createNewUser(payload);
    }

    const jwtPayload = {
      sub: userEntity.id,
      email: userEntity.email,
      username: userEntity.username,
      role: userEntity.role,
    };

    const accessToken = this.jwtService.sign(jwtPayload, { expiresIn: '1d' });

    const refreshToken = this.jwtService.sign(jwtPayload, { secret: process.env.JWT_REFRESH_SECRET, expiresIn: '7d' });

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await this.authRepository.saveRefreshToken({
      userId: userEntity.id,
      token: refreshToken,
      expiresAt: expiresAt,
    });

    return {
      success: true,
      token: accessToken,
      refreshToken,
    };
  }
}
