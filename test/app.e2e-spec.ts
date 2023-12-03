import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { MatchFixtureModule } from './../src/match-fixture/match-fixture.module';
import { RedisClientType } from 'redis';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let redisClient: RedisClientType;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    redisClient = moduleFixture.get("RedisClient");
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  afterAll(async () => {
    await redisClient.disconnect();
    await app.close();
  });
});

describe('MatchFixture (e2e)', () => {
  let app: INestApplication;
  let redisClient: RedisClientType;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, MatchFixtureModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    redisClient = moduleFixture.get("RedisClient");
    await app.init();
  });

  it('/matchFixture/listDailyMatches (GET)', () => {
    return request(app.getHttpServer())
      .get('/matchFixture/listDailyMatches?date=2013-01-01&timezoneOffset=0')
      .expect(200)
      .expect('{"date":"2013-01-01","timezoneOffset":0,"localDay":["2013-01-01T00:00:00.000Z","2013-01-01T23:59:59.999Z"],"matches":[{"id":-1,"time":20130101000000,"tournamentId":0,"homeTeamId":0,"awayTeamId":0,"score":"1:2","isEnded":true,"isLive":false}]}');
  });

  it('/matchFixture/listMonthlyMatchMask (GET)', () => {
    return request(app.getHttpServer())
      .get('/matchFixture/listMonthlyMatchMask?year=2023&month=12')
      .expect(200)
      .expect('{"year":2023,"month":12,"mask":450912258}');
  });

  afterAll(async () => {
    await redisClient.disconnect();
    await app.close();
  });
});

