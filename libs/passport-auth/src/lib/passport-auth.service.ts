import { Injectable } from '@nestjs/common';

@Injectable()
export class PassportAuthService {
  getSharedMessage() {
    return 'Hello from shared service!';
  }
}
