import { HttpStatus } from "@nestjs/common"

export class CodedError extends Error {
    code: string  // For translation
    data: any  // For translation template interpolation
    internalData: any = {} // For logging, not send to client
    timestamp: string = new Date().toISOString()
    httpStatusHint: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR

    constructor(code: string, data = {}) {
        super();

        this.code = code;
        this.data = data;
    }

    static WrapError(error: Error, code: string, data: any={}): CodedError {
        // Bubble up from inside?
        if (error instanceof CodedError) {
            return error;
        }
        
        // Wrap a normal Error
        const codedError = new CodedError(code, data); // Enrich
        codedError.stack = error.stack;

        return codedError;
    }
}