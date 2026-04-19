import type { ChromeError } from "../types";


export enum ErrorType {
    AUTHORIZATION = "AUTHORIZATION",
    NETWORK = "NETWORK",
    UNKNOWN = "UNKNOWN"
}

export class customError extends Error implements ChromeError {
    type: ErrorType;
    statusCode: number;

    constructor(type: ErrorType, statusCode: number, message: string) {
        super(message);
        this.type = type;
        this.statusCode = statusCode;


        Object.setPrototypeOf(this, customError.prototype);
    }
}
