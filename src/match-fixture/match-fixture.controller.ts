import { Controller, Get } from '@nestjs/common';
import { MatchFixtureService } from './match-fixutre.service';
import { ValidatedQuery } from '../shared/utilities';
import { ListDailyMatchesQueryDto, ListDailyMatchesResponseDto, ListMonthlyMatchMaskQueryDto, ListMonthlyMatchMaskResponseDto } from './models/match-fixture.controller.dto';

@Controller('matchFixture')
export class MatchFixtureController {
  constructor(protected readonly service: MatchFixtureService) { }

  @Get("listDailyMatches")
  async listDailyMatches(@ValidatedQuery() query: ListDailyMatchesQueryDto): Promise<ListDailyMatchesResponseDto> {
    return await this.service.listDailyMatches(query.date, query.timezoneOffset);
  }

  @Get("listMonthlyMatchMask")
  async listMonthlyMatchMask(@ValidatedQuery() query: ListMonthlyMatchMaskQueryDto): Promise<ListMonthlyMatchMaskResponseDto> {
    return this.service.listMonthlyMatchMask(query.year, query.month);
  }
}
