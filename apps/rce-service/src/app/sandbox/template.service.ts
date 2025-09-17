import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class TemplateService {
  private templatesPath = path.join(__dirname, '../templates');
  private tempPath = path.join(__dirname, '../temporary_templates');

  constructor() {
    if (!fs.existsSync(this.tempPath)) {
      fs.mkdirSync(this.tempPath, { recursive: true });
    }
  }

  generateFile(
    language: string,
    userCode: string,
    functionName: string,
    jobId: string | number
  ): string {
    const ext = this.getFileExtension(language);
    const filename = `${functionName}_${jobId}.${ext}`;
    const filePath = path.join(this.tempPath, filename);

    const templateFile = this.getTemplateFile(language);
    const template = fs.readFileSync(templateFile, 'utf8');

    const finalCode = template
      .replace('{{USER_CODE}}', userCode)
      .replace('{{FUNCTION_NAME}}', functionName);

    fs.writeFileSync(filePath, finalCode);
    return filePath;
  }

  cleanupFile(filePath: string) {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }

  private getTemplateFile(language: string): string {
    switch (language.toLowerCase()) {
      case 'cpp':
        return path.join(this.templatesPath, 'cpp_temp.cpp');
      case 'python':
        return path.join(this.templatesPath, 'py_temp.py');
      case 'javascript':
        return path.join(this.templatesPath, 'js_temp.js');
      default:
        throw new Error(`Unsupported language: ${language}`);
    }
  }

  private getFileExtension(language: string): string {
    switch (language.toLowerCase()) {
      case 'cpp':
        return 'cpp';
      case 'python':
        return 'py';
      case 'javascript':
        return 'js';
      default:
        throw new Error(`Unsupported language: ${language}`);
    }
  }
}
