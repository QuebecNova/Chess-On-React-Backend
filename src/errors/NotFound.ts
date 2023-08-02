import { CustomError } from "./CustomError";

export class NotFoundError extends CustomError {
  statusCode = 404;

  constructor(public originalUrl: string) {
    super(`Route ${originalUrl} not found`);

    Object.setPrototypeOf(this, NotFoundError.prototype);
  }

  serializeErrors() {
    return [{ message: `Route ${this.originalUrl} not found` }];
  }
}
