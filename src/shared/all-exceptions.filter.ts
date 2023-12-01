import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  INestApplication,
  Injectable,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { CodedError, ErrorCode } from './CodedError';
import { CorrelationService } from '@evanion/nestjs-correlation-id';
import { Request } from 'express';
import { CORRELATION_ID_HEADER } from '@evanion/nestjs-correlation-id'
import * as os from 'os';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) { }

  async catch(error: unknown, host: ArgumentsHost): Promise<void> {
    // In certain situations `httpAdapter` might not be available in the
    // constructor method, thus we should resolve it here.
    const { httpAdapter } = this.httpAdapterHost;
    const codedError = CodedError.Wrap(error as Error, ErrorCode.GENERAL_ERROR);

    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();

    const internal = {
      stack: (codedError.stack || "").split('\n'),
      hostname: os.hostname(),
      message: codedError.message,
     };
    // Log the error to ElasticSearch?

    const responseBody = {
      code: codedError.code,
      data: codedError.data,
      timestamp: codedError.timestamp,
      correlationId: request.headers[CORRELATION_ID_HEADER],
      path: httpAdapter.getRequestUrl(ctx.getRequest()),
      httpCode: codedError.httpStatusHint
    };
    // If on dev env
    responseBody["internal"] = internal

    httpAdapter.reply(ctx.getResponse(), responseBody, codedError.httpStatusHint);
  }
}