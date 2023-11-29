import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MatchFixtureController } from './match-fixture/match-fixture.controller';
import { MatchFixtureService } from './match-fixture/match-fixutre.service';
import { PlaygroundController } from './playground/playground.controller';

@Module({
  imports: [],
  controllers: [AppController, MatchFixtureController, PlaygroundController],
  providers: [AppService, MatchFixtureService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
  }
}
