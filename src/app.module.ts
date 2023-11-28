import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MatchFixtureController } from './match-fixture/match-fixture.controller';

@Module({
  imports: [],
  controllers: [AppController, MatchFixtureController],
  providers: [AppService],
})
export class AppModule {}
