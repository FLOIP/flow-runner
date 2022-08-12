"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertNotEmpty = void 0;
function assertNotEmpty(array, message = () => `Expected val to be non-empty, but received null`, 
// eslint-disable-next-line @typescript-eslint/no-explicit-any
errorInstanceGenerator = errorMessage => new Error(errorMessage)) {
    // eslint-disable-next-line lodash/prefer-is-nil
    if (array.length === 0) {
        throw errorInstanceGenerator(message());
    }
}
exports.assertNotEmpty = assertNotEmpty;
//# sourceMappingURL=AssertCollection.js.map