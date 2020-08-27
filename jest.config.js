module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testRegex: '([/\\\\])__tests__([/\\\\]).*\\.(.*)(test|spec)\\.(js|ts)$',
  // dist is the built files. we want to ignore the tests in it.
  testPathIgnorePatterns: ["/node_modules/", "/dist/"]
}
