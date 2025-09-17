import { Injectable } from '@nestjs/common';
import { SharedRepository, SubmitCodeDto } from '@leet-code-clone/shared';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';
import { SubmissionStatusDto } from '@leet-code-clone/shared';

@Injectable()
export class ApiService {
  constructor(
    private readonly repository: SharedRepository,
    @InjectQueue('submissions')
    private readonly queue: Queue
  ) {}

  async createSubmission(body: SubmitCodeDto) {
    const submission = await this.repository.createSubmission(body);

    await this.queue.add('executeSubmission', {
      submissionId: submission.id,
      userId: body.userId,
      problemId: body.problemId,
      language: body.language,
      code: body.code,
    });

    return submission.id;
  }

  async getSubmissionStatus(id: number): Promise<SubmissionStatusDto | null> {
    const submission = await this.repository.findSubmissionById(id);

    if (!submission) return null;

    return {
      id: submission.id,
      status: submission.status,
      exec_time_ms: submission.exec_time_ms,
      memory_kb: submission.memory_kb,
      result_summary: submission.result_summary,
      created_at: submission.created_at.toISOString(),
      updated_at: submission.updated_at.toISOString(),
    };
  }
}
