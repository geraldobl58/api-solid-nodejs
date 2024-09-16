export class ResorceNotFoundError extends Error {
  constructor() {
    super("Resource not found.");
  }
}
