export function assertNotEmpty<T>(
  array: T[],
  message: () => string = () => `Expected val to be non-empty, but received null`,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  errorInstanceGenerator: (errorMessage: string) => Error = errorMessage => new Error(errorMessage),
): void {
  // eslint-disable-next-line lodash/prefer-is-nil
  if (array.length === 0) {
    throw errorInstanceGenerator(message())
  }
}
