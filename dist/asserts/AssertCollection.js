"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function assertNotEmpty(array, message = () => `Expected val to be non-empty, but received null`, errorInstanceGenerator = (errorMessage => new Error(errorMessage))) {
    if (array.length === 0) {
        throw errorInstanceGenerator(message());
    }
}
exports.assertNotEmpty = assertNotEmpty;
//# sourceMappingURL=AssertCollection.js.map