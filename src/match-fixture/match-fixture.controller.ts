import { Controller, Get } from '@nestjs/common';

@Controller('match-fixture')
export class MatchFixtureController {
    @Get()
    getTest(): string {
      return "test";
    }
}
