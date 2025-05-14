// ✅ Custom error class with statusCode
export class AppError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;

    // Ensure correct prototype chain
    Object.setPrototypeOf(this, AppError.prototype);
  }
}