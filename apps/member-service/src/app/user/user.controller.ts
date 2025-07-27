import {
  Controller,
  Post,
  Query,
  UseGuards,
  BadRequestException,
  NotFoundException,
  Patch,
  Body,
  Get,
  Req,
  ForbiddenException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { GenericResponseDto } from '../shared/dto/generic-response.dto/generic-response.dto';
import { JwtAuthGuard } from '@leet-code-clone/passport-auth';
import { UpdateProfileDto } from '../shared/dto/update-profile.dto/update-profile.dto';
import type { Request } from 'express';
import { Role } from '@leet-code-clone/types';
import { AllUsersDto } from '../shared/dto/all-users.dto/all-users.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Post('profile')
  async getProfile(@Query('email') email: string) {
    if (!email) {
      throw new BadRequestException('"email" must be provided');
    }

    let userProfile = await this.userService.getProfileByEmail(email);

    if (!userProfile) {
      throw new NotFoundException('User not found');
    }

    return new GenericResponseDto(true, 'User Found', userProfile);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('update-profile')
  async updateProfile(
    @Req() req: Request,
    @Body() updateProfileDto: UpdateProfileDto
  ) {
    const userId = (req.user as any).userId; // decoded from jwt

    if (!userId) {
      throw new BadRequestException('No UserId Found');
    }

    let profile = await this.userService.updateProfile(
      Number(userId),
      updateProfileDto
    );

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    return new GenericResponseDto(
      true,
      'Profile Updates Successfully',
      profile
    );
  }

  // FOR ADMIN ONLY
  @UseGuards(JwtAuthGuard)
  @Get('get-all-users')
  async getUsers(@Req() req: Request) {
    const role = (req.user as any).role; // decoded from jwt

    if (role !== Role.ADMIN) {
      throw new ForbiddenException('Access denied: Admins only');
    }

    const users = await this.userService.getAllUsers();
    return new GenericResponseDto(true, 'All Users Found', users);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('update-role')
  async updateRole(@Body() userDto: AllUsersDto, @Req() req: Request) {
    const role = (req.user as any).role; // decoded from jwt

    if (role !== Role.ADMIN) {
      throw new ForbiddenException('Access denied: Admins only');
    }

    const user = await this.userService.updateRole(userDto);
    let message = 'Role Updated Successfully';

    if (user === false) {
      message = 'Role Cannot be Updated';
    }

    return new GenericResponseDto(true, message, user);
  }
}
