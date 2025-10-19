import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { SandboxService } from './sandbox/sandbox.service';
import { SharedRepository } from '@leet-code-clone/shared';
import { TemplateService } from './sandbox/template.service';
import axios from 'axios';
import * as fs from 'fs/promises';
import * as path from 'path';

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
    const {
      submissionId,
      language,
      code,
      problemId,
      functionSignature,
      args,
      testcasesUrl,
    } = job.data;

    let filePath: string | null = null;

    try {
      await this.repository.updateSubmission(submissionId, {
        status: 'RUNNING',
      });

      filePath = this.templateService.generateFile(
        language,
        code,
        functionSignature,
        args,
        job.id as any
      );

      const testcasesPath = path.join(filePath, 'testcases.txt');
      const response = await axios.get(testcasesUrl, {
        responseType: 'arraybuffer',
      });
      await fs.writeFile(testcasesPath, response.data);

      const result = await this.sandbox.runCode(language, filePath, problemId);

      await this.repository.updateSubmission(submissionId, {
        status: 'FINISHED',
        exec_time_ms: result.execTime,
        memory_kb: result.memory,
        result_summary: result.summary,
      });

      return result;
    } catch (err) {
      console.error(`[Job ${job.id}] Failed with error:`, err);
      await this.repository.updateSubmission(submissionId, { status: 'ERROR' });
      throw err;
    } finally {
      if (filePath) {
        this.templateService.cleanFolder(filePath);
      }
    }
  }
}
