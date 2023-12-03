import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MatchFixtureService } from "./match-fixutre.service";
import { CorrelationModule } from '@evanion/nestjs-correlation-id';
import { Scope } from '@nestjs/common';
import { redisClientFactory } from '../shared/redisFactory';
import * as dayjs from 'dayjs';
import { CodedError } from '../shared/CodedError';

const resolveService = async () => {
  const module: TestingModule = await Test.createTestingModule({
    imports: [
      CorrelationModule.forRoot(),
      ConfigModule.forRoot({ envFilePath: ['.env.development'], })
    ],
    // controllers: [MatchFixtureController],
    providers: [
      MatchFixtureService,
      {
        provide: "RedisClient",
        useFactory: (config: ConfigService) => redisClientFactory(config),
        inject: [ConfigService],
        scope: Scope.DEFAULT,
      }
    ],
  }).compile();

  return await module.resolve(MatchFixtureService);
};

// Assume redis setup is done
describe('listDailyMatches', () => {
  let service: MatchFixtureService;
  // Mock or not mock redis service?

  beforeEach(async () => service = await resolveService());

  it('Should return daily matches', async () => {
    const res = await service.listDailyMatches("2023-12-05", 8);

    expect(res.matches.length).toEqual(103);
    expect(res.localDay[0]).toEqual("2023-12-04T16:00:00.000Z");
    expect(res.localDay[1]).toEqual(("2023-12-05T15:59:59.999Z"));
  });
});

describe('listMonthlyMatchMask', () => {
  let service: MatchFixtureService;

  beforeEach(async () => service = await resolveService());

  it('Should return daily matches', async () => {
    const res = await service.listMonthlyMatchMask(2023, 12);

    expect(res.mask).toEqual(450912258);
  });
});