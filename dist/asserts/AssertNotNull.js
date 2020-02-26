"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function assertNotNull(value, message = () => `Expected value to be defined, but received null`, errorInstanceGenerator = (errorMessage => new Error(errorMessage))) {
    if (value === undefined || value === null) {
        throw errorInstanceGenerator(message());
    }
}
exports.assertNotNull = assertNotNull;
//# sourceMappingURL=AssertNotNull.js.map