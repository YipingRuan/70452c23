import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { CodedError } from './CodedError';
import { error } from 'console';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) { }

  catch(error: unknown, host: ArgumentsHost): void {
    // In certain situations `httpAdapter` might not be available in the
    // constructor method, thus we should resolve it here.
    const { httpAdapter } = this.httpAdapterHost;

    console.error(error);
    let codedError: CodedError;
    if (error instanceof CodedError) {
      codedError = error;
    } else {
      codedError = new CodedError("GENERAL_ERROR");
    }

    // Log the error to ElasticSearch?

    const ctx = host.switchToHttp();

    const responseBody = {
      code: codedError.code,
      data: codedError.data,
      timestamp: codedError.timestamp,
      path: httpAdapter.getRequestUrl(ctx.getRequest()),
    };

     // If on dev env
    responseBody["stack"] = codedError.stack

    httpAdapter.reply(ctx.getResponse(), responseBody, codedError.httpStatusHint);
  }
}