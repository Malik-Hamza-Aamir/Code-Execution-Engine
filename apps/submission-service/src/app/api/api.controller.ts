import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { ApiService } from './api.service';
import { SubmitCodeDto, GenericResponseDto } from '@leet-code-clone/shared';

@Controller('submission')
export class ApiController {
  constructor(private readonly apiService: ApiService) {}

  @Post('submit')
  async submit(@Body() body: SubmitCodeDto) {
    const submissionId = await this.apiService.createSubmission(body);
    return new GenericResponseDto(true, 'Problem Submitted', submissionId);
  }

  @Get(':id/status')
  async getStatus(@Param('id') id: string) {
    const submission = await this.apiService.getSubmissionStatus(+id);

    if (!submission) {
      throw new NotFoundException('Submission not found');
    }

    return new GenericResponseDto(
      true,
      'Submission status fetched',
      submission
    );
  }
}
