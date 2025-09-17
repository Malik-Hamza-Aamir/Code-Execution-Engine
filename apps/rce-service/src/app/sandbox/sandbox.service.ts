import { Injectable } from '@nestjs/common';
import { KubeConfig, CoreV1Api, V1Pod } from '@kubernetes/client-node';
import { randomUUID } from 'crypto';

@Injectable()
export class SandboxService {
  private coreV1: CoreV1Api;

  constructor() {
    const kc = new KubeConfig();
    kc.loadFromDefault();
    this.coreV1 = kc.makeApiClient(CoreV1Api);
  }

  async runCode(language: string, filePath: string, problemId: number) {
    const podName = `rce-${language}-${randomUUID().slice(0, 6)}`;

    // Pick image depending on language
    const image = this.getImage(language);

    const pod: V1Pod = {
      metadata: { name: podName },
      spec: {
        restartPolicy: 'Never',
        containers: [
          {
            name: 'runner',
            image,
            command: this.getCommand(language, filePath),
          },
        ],
      },
    };

    // 1. Create Pod
    await this.coreV1.createNamespacedPod('default', pod);

    // 2. Wait for completion (simple polling)
    let phase = '';
    while (phase !== 'Succeeded' && phase !== 'Failed') {
      const { body } = await this.coreV1.readNamespacedPod(podName, 'default');
      phase = body.status?.phase ?? '';
      await new Promise((res) => setTimeout(res, 1000));
    }

    // 3. Get Logs
    const logs = await this.coreV1.readNamespacedPodLog(
      podName,
      'default',
      'runner'
    );

    // 4. Delete Pod
    await this.coreV1.deleteNamespacedPod(podName, 'default');

    return {
      passedAll: phase === 'Succeeded',
      execTime: 0, // TODO: track from start->end time
      memory: 0, // TODO: fetch from metrics
      summary: { output: logs.body },
    };
  }

  private getImage(language: string): string {
    switch (language.toLowerCase()) {
      case 'cpp':
        return 'gcc:latest';
      case 'python':
        return 'python:3.10';
      case 'javascript':
        return 'node:18';
      default:
        throw new Error(`Unsupported language: ${language}`);
    }
  }

  private getCommand(language: string, filePath: string): string[] {
    switch (language.toLowerCase()) {
      case 'cpp':
        return [
          'sh',
          '-c',
          `g++ /code/${filePath} -o /code/a.out && /code/a.out`,
        ];
      case 'python':
        return ['python', `/code/${filePath}`];
      case 'javascript':
        return ['node', `/code/${filePath}`];
      default:
        throw new Error(`Unsupported language: ${language}`);
    }
  }
}
