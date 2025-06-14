import { Body, Controller, Post, Put, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { GenericResponseDto } from '../shared/dto/generic-response.dto/generic-response.dto';
import { UpdateProfileDto } from '../shared/dto/update-profile.dto/update-profile.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // complete profile / edit / modify - update
  // make someone else admin or editor

  @Post('profile')
  async getProfile(@Query('id') id: string, @Query('email') email: string) {
    if (!id && !email) {
      throw new Error('Either "id" or "email" must be provided');
    }

    let userProfile;
    if (id) {
      userProfile = await this.userService.getProfileById(id);
    } else if (email) {
      userProfile = await this.userService.getProfileByEmail(email);
    }

    if (!userProfile) {
      throw new Error('User not found');
    }

    return new GenericResponseDto(true, 'User Found', userProfile);
  }

  // @Put('update-profile')
  // async updateProfile(@Body() updateProfileDto: UpdateProfileDto) {

  // }
}
