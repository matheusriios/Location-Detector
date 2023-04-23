export class ValidationError extends Error {
  name: string = ValidationError.name;

  constructor(message: string) {
    super();
    this.message = message;
  }
}
