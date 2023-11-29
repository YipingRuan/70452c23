import { Controller, Get } from '@nestjs/common';
import { CodedError } from 'src/shared/CodedError';

@Controller('playground')
export class PlaygroundController {
    testService: TestService;

    constructor() {
        this.testService = new TestService();
    }

    @Get("Update1")
    update1(): void {
        this.testService.error1();
    }

    @Get("update2")
    update2(): void {
        this.testService.error2();
    }

    @Get("update3")
    update3(): void {
        this.testService.error3();
    }

    @Get("update4")
    update4(): void {
        // GENERAL_ERROR by the filter
        throw new Error("Unspecified generic error without translation code");
    }
}

class TestService {
    error1(): void {
        throw new CodedError("UPDATE_FAILED");
    }

    error2(): void {
        try {
            // Deeper coded error is used
            throw new CodedError("INVALID_INPUT", { fieldName: "DateOfBirth", fieldValue: "9978" })
        } catch (error) {
            throw CodedError.WrapError(error, "UPDATE_FAILED");  // <= Higher level respect internal
        }
    }

    error3(): void {
        try {
            throw new Error("Not coded error, will be wrapped")
        } catch (error) {
            throw CodedError.WrapError(error, "UPDATE_FAILED");  // <= Higher level wrap an error without code
        }
    }
}
