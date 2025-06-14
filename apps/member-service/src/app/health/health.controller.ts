import { Controller, Get } from '@nestjs/common';

@Controller()
export class HealthController {
  constructor() {}

  @Get('health')
  testHealth() {
    return 'Server is healthy and running';
  }

  @Get('service-health')
  testServices() {
    // tests libraries of nx and returns the results
  }
}
