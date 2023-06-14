import { HttpException, HttpStatus } from "@nestjs/common";

export class CustomException extends HttpException {
    constructor(public message: string, status: HttpStatus) {
        super(message, status);
    }
}
