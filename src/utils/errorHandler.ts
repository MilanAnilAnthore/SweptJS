import type { ChromeError } from "../types";
import { ErrorType } from "../types";


export class customError extends Error implements ChromeError {
    errorType: ErrorType;
    statusCode: number;

    constructor(type: ErrorType, statusCode: number, message: string) {
        super(message);
        this.errorType = type;
        this.statusCode = statusCode;


        Object.setPrototypeOf(this, customError.prototype);
    }
}
