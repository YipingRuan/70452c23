import { Test, TestingModule } from '@nestjs/testing';
import { MatchFixtureController } from './match-fixture.controller';

describe('MatchFixtureController', () => {
  let controller: MatchFixtureController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MatchFixtureController],
    }).compile();

    controller = module.get<MatchFixtureController>(MatchFixtureController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
