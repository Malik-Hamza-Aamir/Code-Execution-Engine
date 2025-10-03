import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { cppConverters, javaConverters, jsConverters } from '../helpers/utils';

@Injectable()
export class TemplateService {
  private templatesPath = path.join(
    process.cwd(),
    'apps/rce-service/src/app/templates'
  );
  private tempPath = path.join(
    process.cwd(),
    'apps/rce-service/src/app/temporary_templates'
  );

  constructor() {
    if (!fs.existsSync(this.tempPath)) {
      fs.mkdirSync(this.tempPath, { recursive: true });
    }
  }

  private extractArgTypes(argStr: string): string[] {
    if (!argStr.trim()) return [];

    return argStr.split(',').map((raw) => {
      const noDefault = raw.replace(/=.*/, '').trim();
      const parts = noDefault.split(/\s+/);
      return parts.slice(0, -1).join(' ');
    });
  }

  private parseFunctionNameArgsSignature(
    language: string,
    functionSignature: string,
    args: string[]
  ): string {
    const lang = language.toLowerCase();

    switch (lang) {
      case 'python': {
        const match = functionSignature.match(/def\s+(\w+)\s*\(/);
        if (match) return match[1];
        break;
      }
      case 'javascript': {
        const match = functionSignature.match(
          /^\s*(?:function\s+)?(\w+)\s*\(([^)]*)\)/
        );

        if (match) {
          const funcName = match[1].trim();
          const argsRaw = match[2].trim();
          const argTypes = argsRaw
            ? argsRaw.split(',').map((a) => a.trim())
            : [];
          const noOfArgs = argTypes.length;

          const argsList = Array.from({ length: noOfArgs }, (_, i) => {
            const type = args[i];
            const conv = jsConverters[type];

            return `${conv}(args[${i}])`;
          }).join(', ');

          return `${funcName}(${argsList})`;
        }
        break;
      }
      case 'cpp': {
        const match = functionSignature.match(
          /^\s*([\w:\<\>\s&\*\[\]]+?)\s+(\w+)\s*\(([^)]*)\)/
        );

        if (match) {
          const funcName = match[2].trim();
          const argsRaw = match[3].trim();
          const argTypes = this.extractArgTypes(argsRaw);
          const noOfArgs = argTypes.length;

          const argsList = Array.from({ length: noOfArgs }, (_, i) => {
            const type = argTypes[i];
            const conv = cppConverters[type];

            return `${conv}(args[${i}])`;
          }).join(', ');

          return `${funcName}(${argsList})`;
        }
        break;
      }
      case 'java': {
        const match = functionSignature.match(
          /^\s*(?:public|private|protected)?\s*(?:static\s+)?([\w\<\>\[\]\s]+?)\s+(\w+)\s*\(([^)]*)\)/
        );
        if (match) {
          const funcName = match[2].trim();
          const argsRaw = match[3].trim();
          const argTypes = this.extractArgTypes(argsRaw);
          const noOfArgs = argTypes.length;

          const argsList = Array.from({ length: noOfArgs }, (_, i) => {
            const type = argTypes[i];
            const conv = javaConverters[type];

            return `${conv}(tokens[${i}])`;
          }).join(', ');

          return `${funcName}(${argsList})`;
        }
        break;
      }
    }

    throw new Error(`Unable to parse function name for ${language}`);
  }

  generateFile(
    language: string,
    userCode: string,
    functionSignature: string,
    args: string[],
    jobId: string | number
  ): string {
    const fileExtension = this.getFileExtension(language);
    const filename = `${language}-${jobId}.${fileExtension}`;
    const filePath = path.join(this.tempPath, filename);

    const templateCodeFile = this.getTemplateFile(language);
    const template = fs.readFileSync(templateCodeFile, 'utf8');

    const functionName = this.parseFunctionNameArgsSignature(
      language,
      functionSignature,
      args
    );

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
        return path.join(this.templatesPath, 'cpp', 'code.cpp');
      case 'python':
        return path.join(this.templatesPath, 'python', 'code.py');
      case 'javascript':
        return path.join(this.templatesPath, 'javascript', 'code.js');
      case 'java':
        return path.join(this.templatesPath, 'java', 'code.java');
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
      case 'java':
        return 'java';
      default:
        throw new Error(`Unsupported language: ${language}`);
    }
  }
}
