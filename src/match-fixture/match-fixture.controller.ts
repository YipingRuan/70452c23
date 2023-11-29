import { Controller, Get } from '@nestjs/common';
import { MatchFixtureService } from './match-fixutre.service';

@Controller('match-fixture')
export class MatchFixtureController {
  constructor(private readonly service: MatchFixtureService) { }

  @Get()
  getHello(): string {
    return this.service.getHello();
  }
}
