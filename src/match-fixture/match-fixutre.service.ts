import { CorrelationService } from '@evanion/nestjs-correlation-id';
import { Inject, Injectable } from '@nestjs/common';
import * as redis from 'redis';
import { RedisClientType } from 'redis';
import { CodedError, ErrorCode } from 'src/shared/CodedError';
import * as dayjs from 'dayjs';
import { parseDate } from 'src/shared/utilities';

@Injectable()
export class MatchFixtureService {
  constructor(private readonly correlationIdService: CorrelationService, 
    @Inject('RedisClient') private readonly redisClient: RedisClientType) {
  }

  async listDailyMatches(date: string, timezoneOffset: number) {
    const inputDay = parseDate(date, "YYYY-MM-DD");
    if (inputDay === null) {
      throw new CodedError(ErrorCode.INVALID_QUERYSTRING, { date });
    }

    const dayStart = inputDay.add(timezoneOffset, "hour");
    const dayEnd = dayStart.add(1, "day").add(-1, "millisecond");

    const df = "YYYYMMDDHHmmss";
    const result = await this.redisClient.ft.search(
      "idx:match",
      `@time:[${dayStart.format(df)} ${dayEnd.format(df)}]`,
      { LIMIT: { from: 0, size: 10000 } }
    )

    const matches = result["documents"].map(x => x.value);
    console.log(matches.length);

    return {
      date,
      timezoneOffset: 3,
      localDay: [dayStart, dayEnd],
      matches,
      haveNext: true
    };
  }

  async listMonthlyMatchMask(year: number, month: number) {
    // Based on bussiness rule
    if (year < 2023 || year > 2024) {
      throw new CodedError(ErrorCode.INVALID_QUERYSTRING, { year });
    }
    if (month < 1 || month > 12) {
      throw new CodedError(ErrorCode.INVALID_QUERYSTRING, { month });
    }

    const key = `match-calendar:${year}${String(month).padStart(2, '0')}`;  // match-calendar:202312
    const maskCacheValue = await this.redisClient.get(key);
    
    let mask = 0;
    if (maskCacheValue === null) {
      // Load from database or return this month data not available?
    } else {
      mask = parseInt(maskCacheValue);
    }

    return { year, month, mask };
  }
}
