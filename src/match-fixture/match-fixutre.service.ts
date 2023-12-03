import { CorrelationService } from '@evanion/nestjs-correlation-id';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { RedisClientType } from 'redis';
import { CodedError, ErrorCode } from '../shared/CodedError';
import { isInRange, logTemplate, parseDate } from '../shared/utilities';

@Injectable()
export class MatchFixtureService {
  private readonly logger = new Logger(MatchFixtureService.name);
  private readonly correlationId: string;

  constructor(private readonly correlationService: CorrelationService,
    @Inject('RedisClient') private readonly redisClient: RedisClientType) {
      this.correlationId = this.correlationService.getCorrelationId();
  }

  async listDailyMatches(date: string, timezoneOffset: number) {
    const inputDay = parseDate(date, "YYYY-MM-DD");
    if (inputDay === null) {
      throw new CodedError(ErrorCode.INVALID_QUERYSTRING, { date });
    }
    if (!isInRange(timezoneOffset, -15, 15)) {
      throw new CodedError(ErrorCode.INVALID_QUERYSTRING, { timezoneOffset });
    }

    const logPrefix = logTemplate(this.listDailyMatches, this.correlationId);
    this.logger.log(`${logPrefix} start: ` + JSON.stringify({ date, timezoneOffset }));

    // Set day start/end
    const dayStart = inputDay.add(-timezoneOffset, "hour");
    const dayEnd = dayStart.add(1, "day").add(-1, "millisecond");

    // Query redis
    const df = "YYYYMMDDHHmmss";
    const result = await this.redisClient.ft.search(
      "idx:match",
      `@time:[${dayStart.format(df)} ${dayEnd.format(df)}]`,
      { LIMIT: { from: 0, size: 10000 } }
    );

    const matches = result["documents"].map(x => x.value);
    
    this.logger.log(`${logPrefix} end: ` + JSON.stringify({ total: matches.length }));
    return {
      date,
      timezoneOffset,
      localDay: [dayStart, dayEnd],
      matches,
    };
  }

  async listMonthlyMatchMask(year: number, month: number) {
    if (!isInRange(year, 2023, 2024, true)) {
      throw new CodedError(ErrorCode.INVALID_QUERYSTRING, { year });
    }
    if (!isInRange(month, 1, 12, true)) {
      throw new CodedError(ErrorCode.INVALID_QUERYSTRING, { month });
    }

    const logPrefix = logTemplate(this.listMonthlyMatchMask, this.correlationId);
    this.logger.log(`${logPrefix} start: ` + JSON.stringify({ year, month }));

    // Query redis
    const key = `match-calendar:${year}${String(month).padStart(2, '0')}`;  // match-calendar:202312
    const maskCacheValue = await this.redisClient.get(key);

    let mask = 0;
    if (maskCacheValue === null) {
      // Load from database or return this month data not available?
    } else {
      mask = parseInt(maskCacheValue);
    }

    this.logger.log(`${logPrefix}  end: ` + JSON.stringify({ mask }));
    return { year, month, mask };
  }
}
