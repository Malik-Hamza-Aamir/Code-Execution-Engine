import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../shared/dto/create-user.dto/create-user.dto.js';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from '../shared/dto/login-user.dto/login-user.dto.js';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { CommonRepository } from '../shared/repository/common.repository.js';

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
    return { redirect: "/login" }
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

    const accessToken = this.jwtService.sign(
      {
        sub: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
      },
      { expiresIn: '15m' }
    );

    const refreshToken = this.jwtService.sign(
      { sub: user.id },
      { expiresIn: '7d' }
    );

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
      expiresIn: '15m',
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d',
    });

    return { accessToken, refreshToken };
  }

  async generateJwt(user: any) {
    console.log('[generate jwt]', user);
    const createUserDto: CreateUserDto = {
      email: user.emails[0].value,
      username: user.displayName,
      password: '',
      imgURL: user.photos[0].value,
      dob: '2025-05-14T00:00:00Z',
    };
    const createdUser = await this.authRepository.createUser(createUserDto);

    const payload = {
      sub: createdUser.id,
      email: user.emails[0].value,
      username: user.displayName,
      role: user.role,
    };
    return this.jwtService.sign(payload);
  }
}
