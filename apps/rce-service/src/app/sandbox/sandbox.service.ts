import { Injectable } from '@nestjs/common';

@Injectable()
export class SandboxService {
  constructor() {}

  async runCode(language: any, filePath: any, problemId: any) {
    const result = {
      status: 'FINISHED',
      execTime: '100 ms',
      memory: '256 KB',
      summary: 'All test cases passed',
    };

    return result;
  }
}
