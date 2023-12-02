import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  Logger,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { CodedError, ErrorCode } from './CodedError';
import { Request } from 'express';
import { CORRELATION_ID_HEADER } from '@evanion/nestjs-correlation-id'
import * as os from 'os';
import { ConfigService } from '@nestjs/config';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger("AllExceptionsFilter");
  private readonly includeInternalDetails: boolean;

  constructor(private readonly httpAdapterHost: HttpAdapterHost, private readonly config: ConfigService) {
    this.includeInternalDetails = config.get<boolean>("RESPONSE_ERROR_WITH_INTERNAL_DETAILS", false);
  }

  async catch(error: unknown, host: ArgumentsHost): Promise<void> {
    // In certain situations `httpAdapter` might not be available in the
    // constructor method, thus we should resolve it here.
    const { httpAdapter } = this.httpAdapterHost;
    const codedError = CodedError.Wrap(error as Error, ErrorCode.GENERAL_ERROR, {}, error["status"] || HttpStatus.INTERNAL_SERVER_ERROR);

    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();

    const internal = {
      stack: (codedError.stack || "").split('\n'),
      hostname: os.hostname(),
      message: codedError.message,
    };

    const correlationId = request.headers[CORRELATION_ID_HEADER];
    const responseBody = {
      code: codedError.code,
      data: codedError.data,
      timestamp: codedError.timestamp,
      correlationId,
      path: httpAdapter.getRequestUrl(ctx.getRequest()),
      httpCode: codedError.httpStatusHint
    };

    if (this.includeInternalDetails) {
      responseBody["internal"] = internal;
    }

    this.logger.error(`[${correlationId}]`, { ...responseBody, internal });  // Log the error to ElasticSearch?

    httpAdapter.reply(ctx.getResponse(), responseBody, codedError.httpStatusHint);
  }
}