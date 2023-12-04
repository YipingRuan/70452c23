import { Controller, Get } from '@nestjs/common';
import { MatchFixtureService } from './match-fixutre.service';
import { ValidatedQuery } from '../shared/utilities';
import { ListDailyMatchesQueryDto, ListDailyMatchesResponseDto, ListMonthlyMatchMaskQueryDto, ListMonthlyMatchMaskResponseDto } from './models/match-fixture.controller.dto';
import { ApiOperation } from '@nestjs/swagger';

@Controller('matchFixture')
export class MatchFixtureController {
  constructor(protected readonly service: MatchFixtureService) { }

  @ApiOperation({
    summary: 'Gets all matches within 24 hours time range',
    description: 'Timezone is considered.'
  })
  @Get("listDailyMatches")
  async listDailyMatches(@ValidatedQuery() query: ListDailyMatchesQueryDto): Promise<ListDailyMatchesResponseDto> {
    return await this.service.listDailyMatches(query.date, query.timezoneOffset);
  }

  @ApiOperation({
    summary: 'Get a 32-bit integer mask representing the daily match existence for 1 month',
    description: 'From left to right with index starts at 0, a value 1 means there is at least 1 match on day `(index + 1)`'
  })
  @Get("listMonthlyMatchMask")
  async listMonthlyMatchMask(@ValidatedQuery() query: ListMonthlyMatchMaskQueryDto): Promise<ListMonthlyMatchMaskResponseDto> {
    return this.service.listMonthlyMatchMask(query.year, query.month);
  }
}
