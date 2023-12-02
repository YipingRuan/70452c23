import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './shared/all-exceptions.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  setupSwagger(app);

  // Exception -> response handling
  const httpAdapterHost = app.get(HttpAdapterHost);
  const configService = app.get<ConfigService>(ConfigService);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapterHost, configService));

  await app.listen(3000);
}
bootstrap();

function setupSwagger(app: INestApplication<any>) {
  const options = new DocumentBuilder()
    .setTitle('Yiping\'s ZUJU Demo API')
    .setVersion('1.22474487139')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api-docs', app, document);
}
