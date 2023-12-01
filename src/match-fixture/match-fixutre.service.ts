import { CorrelationService } from '@evanion/nestjs-correlation-id';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MatchFixtureService {
  constructor(protected correlationIdService: CorrelationService) { }
  
  listDailyMatches(date: number, timezoneOffset: number) {
    return {
      date,
      timezoneOffset,
      matches: [],
      haveNext: true
    };
  }

  listMonthlyMatchMask(year: number, month: number) {
    return {
      year,
      month,
      mask: 13
    };
  }

  getHello(): string {
    return "Aloha";
  }
}
