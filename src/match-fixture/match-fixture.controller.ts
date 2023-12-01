import { Controller, Get, Param, Post, Query } from '@nestjs/common';
import { MatchFixtureService } from './match-fixutre.service';

@Controller('matchFixture')
export class MatchFixtureController {
  constructor(protected readonly service: MatchFixtureService) { }

  @Post("listDailyMatches")
  listDailyMatches(@Query('date') date: number, @Query('timezoneOffset') timezoneOffset: number) {
    return this.service.listDailyMatches(date, timezoneOffset);
  }

  @Get("listMonthlyMatchMask")
  listMonthlyMatchMask(@Query('year') year: number, @Query('month') month: number) {
    return this.service.listMonthlyMatchMask(year, month);
  }

  // @Get()
  // getHello(): string {
  //   return this.service.getHello();
  // }
}
