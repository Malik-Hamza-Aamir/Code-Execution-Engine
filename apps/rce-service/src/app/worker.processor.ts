import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { SandboxService } from './sandbox/sandbox.service';
import { SharedRepository } from '@leet-code-clone/shared';
import { TemplateService } from './sandbox/template.service';

@Processor('submissions')
export class WorkerProcessor extends WorkerHost {
  constructor(
    private readonly repository: SharedRepository,
    private readonly sandbox: SandboxService,
    private readonly templateService: TemplateService
  ) {
    super();
  }

  async process(job: Job<any>): Promise<any> {
    const { submissionId, language, code, problemId, functionName } = job.data;
    await this.repository.updateSubmission(submissionId, { status: 'RUNNING' });

    let filePath: string | null = null;

    try {
      // 1. Generate runnable code file from template
      filePath = this.templateService.generateFile(
        language,
        code,
        functionName,
        job.id as any
      );

      // 2. Run inside sandbox
      const result = await this.sandbox.runCode(language, filePath, problemId);

      // 3. Update DB with results
      await this.repository.updateSubmission(submissionId, {
        status: 'FINISHED',
        exec_time_ms: result.execTime,
        memory_kb: result.memory,
        result_summary: result.summary,
      });

      return result;
    } catch (err) {
      await this.repository.updateSubmission(submissionId, { status: 'ERROR' });
      throw err;
    } finally {
      // 4. Cleanup temp file
      if (filePath) {
        this.templateService.cleanupFile(filePath);
      }
    }
  }
}
