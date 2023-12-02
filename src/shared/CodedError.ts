import { HttpStatus } from "@nestjs/common"

export class CodedError extends Error {
    code: ErrorCode  // For translation
    data: any  // For translation template interpolation
    internalData: any = {} // For logging, not send to client
    timestamp: string = new Date().toISOString()
    httpStatusHint: number

    constructor(code: ErrorCode, data = {}, httpStatusHint: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR) {
        super();

        this.code = code;
        this.data = data;
        this.httpStatusHint = httpStatusHint;
    }

    static Wrap(error: Error, code: ErrorCode, data: any = {}, httpStatusHint: number = HttpStatus.INTERNAL_SERVER_ERROR): CodedError {
        // CodedError bubble up from inside?
        if (error instanceof CodedError) {
            return error;
        }

        // Wrap a normal Error
        const codedError = new CodedError(code, data, httpStatusHint);
        codedError.name = error.name;
        codedError.message = error.message;
        codedError.stack = error.stack;

        return codedError;
    }
}

export enum ErrorCode {
    INVALID_QUERYSTRING = "INVALID_QUERYSTRING",
    GENERAL_ERROR = "GENERAL_ERROR",
    UPDATE_FAILED = "UPDATE_FAILED",
    INVALID_INPUT = "INVALID_INPUT",
}