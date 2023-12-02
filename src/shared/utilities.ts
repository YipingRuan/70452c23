import { BadRequestException, HttpStatus, Query, ValidationError, ValidationPipe, ValidationPipeOptions } from '@nestjs/common';
import * as dayjs from 'dayjs'
import { CodedError, ErrorCode } from './CodedError';

export function parseDate(input: string, format: string): dayjs.Dayjs | null {
    const output = dayjs(input, format, true);
    if (output.format(format) !== input) {
        return null;
    }

    return output;
}

export function logTemplate(method: Function, correlationId: string): string {
    return `[${method.name}][${correlationId}]`;
}

export function ValidatedQuery(options?: ValidationPipeOptions): ParameterDecorator {
    const exceptionFactory= (validationErrors: ValidationError[] = []) => {
        const error = validationErrors[0];
        const data  = {[error.property]: Object.values(error.constraints).join(', ')};
        
        return new CodedError(ErrorCode.INVALID_QUERYSTRING, data, HttpStatus.BAD_REQUEST);
      }

    const v = new ValidationPipe({
        transform: true,
        transformOptions: {enableImplicitConversion: true},
        forbidNonWhitelisted: true,
        exceptionFactory,
        ...options
    });

    return Query(v);
};

export const isInRange = (x: number, min: number, max:number, isInteger=false): boolean => {
    if (isInteger && !Number.isInteger(x)) {
        return false;
    }

    return x >= min && x <= max;
}