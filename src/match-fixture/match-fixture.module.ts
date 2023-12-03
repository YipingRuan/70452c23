import { Module, Scope } from '@nestjs/common';
import { MatchFixtureController } from './match-fixture.controller';
import { MatchFixtureService } from './match-fixutre.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { redisClientFactory } from 'src/shared/redisFactory';

@Module({
    imports: [ConfigModule],
    controllers: [MatchFixtureController],
    providers: [MatchFixtureService]
})
export class MatchFixtureModule { }
