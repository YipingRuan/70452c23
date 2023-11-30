import { Controller, Get, Post } from '@nestjs/common';
import { MatchFixtureService } from './match-fixutre.service';

@Controller('match-fixture')
export class MatchFixtureController {
  constructor(private readonly service: MatchFixtureService) { }

  @Post("fixturesListing")
  fixturesListing(date: number, timezoneOffset: number) {
    return {
      date,
      timezoneOffset,
      matches: [],
      haveNext: true
    };
  }

  @Get("fixturesCalendar")
  fixturesCalendar(year: number, month: number) {
    return {
      year,
      month,
      matchMask: 1234
    };
  }

  @Get()
  getHello(): string {
    return this.service.getHello();
  }
}
