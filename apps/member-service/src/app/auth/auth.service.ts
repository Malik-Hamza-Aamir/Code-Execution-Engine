import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from '../shared/dto/create-user.dto/create-user.dto.js';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from '../shared/dto/login-user.dto/login-user.dto.js';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { CommonRepository } from '../shared/module-services/common.repository.js';
import { User, Provider, Role } from '@leet-code-clone/types';
import Redis from 'ioredis';
import { ResendService } from '../shared/module-services/resend-email.service.js';
import { OtpDto } from '../shared/dto/otp.dto/otp.dto.js';
import { UserResponseDto } from '../shared/dto/user-response.dto/user-response.dto.js';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: CommonRepository,
    private readonly resendService: ResendService,
    private jwtService: JwtService,
    @Inject('REDIS_CLIENT') private readonly redis: Redis
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

    const userResponseDto = plainToInstance(UserResponseDto, user, {
      excludeExtraneousValues: true,
    });

    return {
      success: true,
      token: accessToken,
      refreshToken,
      user: userResponseDto,
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
      githubId: provider === 'github' ? user.id : null,
      googleId: provider === 'google' ? user.id : null,
      provider: provider === 'github' ? Provider.GITHUB : Provider.GOOGLE,
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

    const refreshToken = this.jwtService.sign(jwtPayload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d',
    });

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

  private generateOtp(): string {
    // 6-digit OTP
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async forgotPassword(email: string) {
    const otp = this.generateOtp();
    const ttl = 600;
    const key = `otp:${email}`;

    await this.redis.set(key, otp, 'EX', ttl);
    await this.resendService.sendEmail(
      email,
      'OTP Forget Password',
      `<strong>OTP: ${otp}</strong>`
    );

    return { message: 'OTP sent to email' };
  }

  async verifyOtp(otpDto: OtpDto) {
    const key = `otp:${otpDto.email}`;
    const storedOtp = await this.redis.get(key);

    if (!storedOtp) {
      throw new BadRequestException('OTP expired');
    }

    if (storedOtp !== otpDto.otp) {
      throw new UnauthorizedException('Invalid OTP');
    }

    await this.redis.del(key);

    return true;
  }

  async resetPassword(resetPasswordDto: LoginUserDto) {
    const email = resetPasswordDto.email;
    const newPassword = resetPasswordDto.password;

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const result = await this.authRepository.updateProfileUsingEmail(
      email,
      hashedPassword
    );

    let message = 'Password reset unsuccessful';

    if (result) {
      message = 'Password reset successful';
    }

    return { message: message };
  }
}
