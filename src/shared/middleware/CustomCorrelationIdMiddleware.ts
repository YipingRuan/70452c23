import { CORRELATION_ID_HEADER, CorrelationService } from '@evanion/nestjs-correlation-id';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class CustomCorrelationIdMiddleware implements NestMiddleware {
    constructor(private readonly correlationService: CorrelationService) { }

    use(req: Request, res: Response, next: NextFunction) {
        req.rawHeaders[CORRELATION_ID_HEADER] = this.correlationService.getCorrelationId();
        next();
    }
}