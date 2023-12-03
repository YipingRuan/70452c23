import { Global, MiddlewareConsumer, Module, NestModule, Scope } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PlaygroundController } from './playground/playground.controller';
import {
  CorrelationIdMiddleware,
  CorrelationModule,
} from '@evanion/nestjs-correlation-id';
import { CustomCorrelationIdMiddleware } from './shared/middleware/CustomCorrelationIdMiddleware';
import { MatchFixtureModule } from './match-fixture/match-fixture.module';
import { redisClientFactory } from './shared/redisFactory';

@Global()
@Module({
  imports: [
    CorrelationModule.forRoot(), 
    ConfigModule.forRoot({envFilePath: ['.env.development'],}), 
    MatchFixtureModule],
  controllers: [AppController, PlaygroundController],
  providers: [
    AppService,
    {
      provide: "RedisClient",
      useFactory: (config: ConfigService) => redisClientFactory(config),
      inject: [ConfigService],
      scope: Scope.DEFAULT,
  }
  ],
  exports: ["RedisClient"]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CorrelationIdMiddleware).forRoutes('*')
    .apply(CustomCorrelationIdMiddleware).forRoutes('*');
  }
}
