// Custom error type for better type safety
export class SystemProcessingError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SystemProcessingError";
  }
}
