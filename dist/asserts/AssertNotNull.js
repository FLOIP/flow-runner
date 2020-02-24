"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function assertNotNull(val, message = () => `Expected value to be defined, but received null`, errorInstanceGenerator = (errorMessage => new Error(errorMessage))) {
    if (val === undefined || val === null) {
        throw errorInstanceGenerator(message());
    }
}
exports.assertNotNull = assertNotNull;
//# sourceMappingURL=AssertNotNull.js.map