import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MatchFixtureController } from './match-fixture.controller';
import { MatchFixtureService } from "./match-fixutre.service";
import { CorrelationModule } from '@evanion/nestjs-correlation-id';
import { Scope } from '@nestjs/common';
import { AppService } from '../app.service';
import { redisClientFactory } from '../shared/redisFactory';
import * as dayjs from 'dayjs';
import { CodedError } from '../shared/CodedError';

const resolveController = async () => {
  const module: TestingModule = await Test.createTestingModule({
    imports: [
      CorrelationModule.forRoot(),
      ConfigModule.forRoot({ envFilePath: ['.env.development'], })
    ],
    controllers: [MatchFixtureController],
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

  return await module.resolve(MatchFixtureController);
};

// Assume redis setup is done
describe('listDailyMatches', () => {
  let controller: MatchFixtureController;
  // Mock or not mock redis service?

  beforeEach(async () => controller = await resolveController());

  it('Should return daily matches', async () => {
    const res = await controller.listDailyMatches({date: "2023-12-05", timezoneOffset: 3});
    
    expect(res.matches.length).toEqual(105);
    expect(res.localDay[0].isSame(dayjs("2023-12-04T19:00:00.000Z"))).toBeTruthy();
    expect(res.localDay[1].isSame(dayjs("2023-12-05T18:59:59.999Z"))).toBeTruthy();
  });
});

describe('listMonthlyMatchMask', () => {
  let controller: MatchFixtureController;

  beforeEach(async () => controller = await resolveController());

  it('Should return daily matches', async () => {
    const res = await controller.listMonthlyMatchMask({year: 2023, month: 12});
    
    expect(res.mask).toEqual(450912258);
  });
});