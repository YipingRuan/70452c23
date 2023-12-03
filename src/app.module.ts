import { MiddlewareConsumer, Module, NestModule, Scope } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MatchFixtureController } from './match-fixture/match-fixture.controller';
import { MatchFixtureService } from './match-fixture/match-fixutre.service';
import { PlaygroundController } from './playground/playground.controller';
import {
  CorrelationIdMiddleware,
  CorrelationModule,
} from '@evanion/nestjs-correlation-id';
import { CustomCorrelationIdMiddleware } from './shared/middleware/CustomCorrelationIdMiddleware';
import { redisClientFactory } from './shared/redisFactory';

@Module({
  imports: [CorrelationModule.forRoot(), 
    ConfigModule.forRoot({envFilePath: ['.env.development'],})],
  controllers: [AppController, MatchFixtureController, PlaygroundController],
  providers: [
    AppService, 
    MatchFixtureService, 
    { 
      provide: "RedisClient",
      useFactory: (config: ConfigService) => redisClientFactory(config), 
      inject: [ConfigService],
      scope: Scope.DEFAULT,
    }
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CorrelationIdMiddleware).forRoutes('*')
    .apply(CustomCorrelationIdMiddleware).forRoutes('*');
  }
}
