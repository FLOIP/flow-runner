export function assertNotNull<T>(
  value: T,
  message: () => string = () => `Expected value to be defined, but received null`,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  errorInstanceGenerator: (errorMessage: string) => Error = (errorMessage => new Error(errorMessage)),
): asserts value is NonNullable<T> {
  // eslint-disable-next-line lodash/prefer-is-nil
  if (value === undefined || value === null) {
    throw errorInstanceGenerator(message())
  }
}
