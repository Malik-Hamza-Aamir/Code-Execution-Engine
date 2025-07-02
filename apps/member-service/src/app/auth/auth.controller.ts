import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { CreateUserDto } from '../shared/dto/create-user.dto/create-user.dto.js';
import { GenericResponseDto } from '../shared/dto/generic-response.dto/generic-response.dto.js';
import { LoginUserDto } from '../shared/dto/login-user.dto/login-user.dto.js';
import type { Request, Response } from 'express';
import {
  GitHubAuthGuard,
  JwtAuthGuard,
  JwtRefreshGuard,
} from '@leet-code-clone/passport-auth';
import { LoginFormData } from "@leet-code-clone/types";

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async registerUsers(@Body() createUserDto: CreateUserDto) {
    const registeredUserResp = await this.authService.register(createUserDto);
    return new GenericResponseDto(
      true,
      'User Registered Successfully',
      registeredUserResp
    );
  }

  @Post('login')
  async loginUser( @Body() loginUserDto: LoginUserDto, @Res({ passthrough: true }) res: Response ) {
    const result = await this.authService.login(loginUserDto);
    if (!result.success) {
      res.status(HttpStatus.UNAUTHORIZED);
      return new GenericResponseDto(
        false,
        result.message || 'Authentication failed'
      );
    }

    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: false, // process.env.NODE_ENV === 'production'
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return new GenericResponseDto(true, 'Login successful', {
      token: result.token,
      redirectUrl: '/',
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get('test')
  async test(@Req() req: Request) {
    return {
      message: 'Protected route works!',
      user: req.user, // This comes from the JWT payload
    };
  }

  @UseGuards(JwtRefreshGuard)
  @Get('refresh-token')
  async refreshToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const user = req.user;
    console.log('[user]', user);

    const tokens = await this.authService.getNewTokens(user);
    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return new GenericResponseDto(true, 'Token refreshed successfully', {
      token: tokens.accessToken,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logoutUser(@Body() id: string, @Res() res: Response) {
    await this.authService.logout(Number(id), res);
    return new GenericResponseDto(true, 'Logout Successful', {
      redirectUrl: '/login',
    });
  }

  @Get('github')
  @UseGuards(GitHubAuthGuard)
  githubLogin() {}

  @Get('github/callback')
  @UseGuards(GitHubAuthGuard)
  async githubCallback(@Req() req: Request, @Res() res: Response) {
    const token = await this.authService.generateJwt(req.user);
    return res.redirect(`http://localhost:4200/callback?token=${token}`);
  }
}
