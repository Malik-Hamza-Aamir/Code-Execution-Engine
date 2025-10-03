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
  
  async listAllPods() {
    const k8s = await import('@kubernetes/client-node');

    const kc = new k8s.KubeConfig();
    kc.loadFromDefault();

    const k8sApi = kc.makeApiClient(k8s.CoreV1Api);
    const res = await k8sApi.listPodForAllNamespaces();
    return res;
  }
}
