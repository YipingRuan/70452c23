import { Controller, Get, Param, Post, Query, ValidationPipe } from '@nestjs/common';
import { MatchFixtureService } from './match-fixutre.service';
import { IsString, IsNumber, IsDateString, Min, Max } from 'class-validator';
import { ValidatedQuery } from 'src/shared/utilities';

class ListDailyMatchesQueryDto {
  @IsDateString()
  date: string;

  @IsNumber()
  @Min(-15)
  @Max(15)
  timezoneOffset: number;
}

class ListMonthlyMatchMaskQueryDto {
  @IsNumber()
  @Min(2000)
  @Max(2030)
  year: number;

  @IsNumber()
  @Min(1)
  @Max(12)
  month: number;
}

@Controller('matchFixture')
export class MatchFixtureController {
  constructor(protected readonly service: MatchFixtureService) { }

  @Get("listDailyMatches")
  listDailyMatches(@ValidatedQuery() query: ListDailyMatchesQueryDto) {
    return this.service.listDailyMatches(query.date, query.timezoneOffset);
  }

  @Get("listMonthlyMatchMask")
  listMonthlyMatchMask(@ValidatedQuery() query: ListMonthlyMatchMaskQueryDto) {
    return this.service.listMonthlyMatchMask(query.year, query.month);
  }
}
