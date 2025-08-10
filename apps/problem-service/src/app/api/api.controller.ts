import { Controller, Get, Query } from '@nestjs/common';
import { ApiService } from './api.service';
import { GenericResponseDto } from '../shared/dto/generic-response.dto/generic-response.dto';

@Controller('problems')
export class ApiController {
  constructor(private readonly apiService: ApiService) {}

  @Get()
  async getAllProblems(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
    @Query('difficulty') difficulty?: string,
    @Query('tags') tags?: string
  ) {
    const tagList = tags ? tags.split(',').map(tag => tag.trim()) : [];
    const { problems, total } = await this.apiService.getPaginatedProblems(page, limit, difficulty, tagList);

    return new GenericResponseDto(true, 'Problems fetched successfully', {
      problems,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  }
}
