import { HttpStatus } from "@nestjs/common"

export class CodedError extends Error {
    code: string  // For translation
    data: any  // For translation template interpolation
    internalData: any = {} // For logging, not send to client
    timestamp: string = new Date().toISOString()
    httpStatusHint: HttpStatus

    constructor(code: string, data = {}, httpStatusHint: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR) {
        super();

        this.code = code;
        this.data = data;
        this.httpStatusHint = httpStatusHint;
    }

    static Wrap(error: Error, code: string, data: any = {}, httpStatusHint: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR): CodedError {
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