import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiService } from './api.service';
import { GenericResponseDto } from '../shared/dto/generic-response.dto/generic-response.dto';
import { CreateProblemDto } from '../shared/dto/create-problem/create-problem.dto';

@Controller('problems')
export class ApiController {
  constructor(private readonly apiService: ApiService) {}

  @Post()
  async createProblems(@Body() createProblemDto: CreateProblemDto) {
    const problem = await this.apiService.createProblem(createProblemDto);
    return new GenericResponseDto(true, 'Problem Added Successfully', problem);
  }

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
