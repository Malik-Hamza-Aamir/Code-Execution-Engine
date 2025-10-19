import { Injectable, Logger } from '@nestjs/common';
import { exec } from 'child_process';
import { promisify } from 'util';
const execAsync = promisify(exec);

@Injectable()
export class SandboxService {
  private readonly logger = new Logger(SandboxService.name);

  async runCode(language: string, filePath: string, problemId: string) {
    try {
      const cmd = `bash run.sh`;

      const { stdout, stderr } = await execAsync(cmd, { cwd: filePath, timeout: 10000 });

      if (stderr && stderr.trim().length > 0) {
        this.logger.warn(`[stderr] ${stderr}`);
      }

      this.logger.log(`✅ Execution complete for ${language}`);
      this.logger.log(`[stdout] ${stdout}`);

      return {
        status: 'FINISHED',
        output: stdout,
        memory: '1024',
        execTime: '250',
        summary: '{"status":"success","details":{"operations":120}}',
      };
    } catch (err: any) {
      this.logger.error(`❌ Execution failed: ${err.message}`);
      this.logger.error(err);

      if (err.stdout) this.logger.error(`[stdout] ${err.stdout}`);
      if (err.stderr) this.logger.error(`[stderr] ${err.stderr}`);
      if (err.code) this.logger.error(`[exit code] ${err.code}`);

      return {
        status: 'FAILED',
        error: err.message,
        stdout: err.stdout || '',
        stderr: err.stderr || '',
      };
    }
  }

  private async deleteCurrentPod() {
    try {
      const podName = process.env.HOSTNAME;
      if (!podName) {
        this.logger.warn(
          '⚠️ Not running inside Kubernetes pod (no HOSTNAME env)'
        );
        return;
      }

      const { KubeConfig, CoreV1Api } = await import('@kubernetes/client-node');
      const kc = new KubeConfig();
      kc.loadFromDefault();

      const k8sApi = kc.makeApiClient(CoreV1Api);
      const namespace = process.env.POD_NAMESPACE || 'default';

      await k8sApi.deleteNamespacedPod({ name: podName, namespace });
      this.logger.log(`🗑️ Deleted pod ${podName}, new pod will auto-spawn`);
    } catch (err: any) {
      this.logger.log(`Failed to delete pod: ${err}`);
    }
  }
}
