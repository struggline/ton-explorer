export class HttpError extends Error {
    readonly statusCode: number;
    constructor(message: string, code: number) {
        super(message);
        this.statusCode = code;

        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}
