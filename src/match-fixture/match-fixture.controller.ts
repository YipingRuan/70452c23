import { Controller, Get, Param, Post, Query } from '@nestjs/common';
import { MatchFixtureService } from './match-fixutre.service';

@Controller('matchFixture')
export class MatchFixtureController {
  constructor(protected readonly service: MatchFixtureService) { }

  @Get("listDailyMatches")
  listDailyMatches(@Query('date') date: string, @Query('timezoneOffset') timezoneOffset: number) {
    return this.service.listDailyMatches(date, timezoneOffset);
  }

  @Get("listMonthlyMatchMask")
  listMonthlyMatchMask(@Query('year') year: string, @Query('month') month: string) {
    return this.service.listMonthlyMatchMask(parseInt(year), parseInt(month));
  }
}
