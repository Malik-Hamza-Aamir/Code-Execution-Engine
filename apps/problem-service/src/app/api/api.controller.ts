import { Controller, Get } from '@nestjs/common';
import { ApiService } from './api.service';
import { GenericResponseDto } from '../shared/dto/generic-response.dto/generic-response.dto';

@Controller('problem')
export class ApiController {
  constructor(private readonly apiService: ApiService) {}

  @Get()
  async getAllProblems() {
    const problems = await this.apiService.getAllProblems();

    return new GenericResponseDto(
      true,
      'Token refreshed successfully',
      problems
    );
  }
}
