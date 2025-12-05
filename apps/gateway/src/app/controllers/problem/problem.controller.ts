import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@leet-code-clone/passport-auth';

@Controller('problem')
export class ProblemController {
  constructor() {}

  @UseGuards(JwtAuthGuard)
  @Get('test')
  async test(@Req() req: Request) {
    return {
      message: 'Protected route works!',
      // user: req.user, // This comes from the JWT payload
    };
  }
}
