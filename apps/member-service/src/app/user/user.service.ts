import { Injectable } from '@nestjs/common';
import { CommonRepository } from '../shared/repository/common.repository';
import { UpdateProfileDto } from '../shared/dto/update-profile.dto/update-profile.dto';
import { AllUsersDto } from '../shared/dto/all-users.dto/all-users.dto';

@Injectable()
export class UserService {
  constructor(private readonly repository: CommonRepository) {}

  async getProfileByEmail(email: string) {
    const user = await this.repository.getUser(email);

    if (user) {
      return {
        id: user.id,
        email: user.email,
        username: user.username,
        imgUrl: user.imgURL,
        dob: user.dob,
        role: user.role,
      };
    }

    return null;
  }

  async updateProfile(id: number, updateProfileDto: UpdateProfileDto) {
    const user = await this.repository.updateProfileInfo(id, updateProfileDto);
    if (user) {
      return {
        id: user.id,
        email: user.email,
        username: user.username,
        imgUrl: user.imgURL,
        dob: user.dob,
        role: user.role,
      };
    }

    return null;
  }

  async getAllUsers() {
    const users = await this.repository.getAllUsers();
    return users.map(
      (user) => new AllUsersDto(user.id, user.username, user.role)
    );
  }

  async updateRole(userDto: AllUsersDto) {
    const user = await this.repository.updateUserRole(userDto);
    return user;
  }
}
