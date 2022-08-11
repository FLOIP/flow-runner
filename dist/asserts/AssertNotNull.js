"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertNotNull = void 0;
function assertNotNull(value, message = () => `Expected value to be defined, but received null`, 
// eslint-disable-next-line @typescript-eslint/no-explicit-any
errorInstanceGenerator = errorMessage => new Error(errorMessage)) {
    // eslint-disable-next-line lodash/prefer-is-nil
    if (value === undefined || value === null) {
        throw errorInstanceGenerator(message());
    }
}
exports.assertNotNull = assertNotNull;
//# sourceMappingURL=AssertNotNull.js.map