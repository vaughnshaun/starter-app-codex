export type ValidationErrors = Partial<
  Record<'confirmPassword' | 'email' | 'password', string>
>;

export class ValidationFailure extends Error {
  constructor(public readonly fieldErrors: ValidationErrors) {
    super('Validation failed');
    this.name = 'ValidationFailure';
  }
}

