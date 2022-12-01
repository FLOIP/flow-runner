"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertKeysToCamelCase = exports.EXCLUDED_DATA_HIERARCHIES_BY_KEY = void 0;
const lodash_1 = require("lodash");
exports.EXCLUDED_DATA_HIERARCHIES_BY_KEY = ['choices', 'vendorMetadata', 'vendor_metadata'];
function convertKeysToCamelCase(x, exclusions = exports.EXCLUDED_DATA_HIERARCHIES_BY_KEY) {
    if ((0, lodash_1.isArray)(x)) {
        return x.map(_ => convertKeysToCamelCase(_, exclusions));
    }
    if (!(0, lodash_1.isObject)(x)) {
        return x;
    }
    return (0, lodash_1.reduce)(x, (memo, value, key) => {
        memo[(0, lodash_1.includes)(exclusions, key) ? key : (0, lodash_1.camelCase)(key)] = convertKeysToCamelCase(value, exclusions);
        return memo;
    }, {});
}
exports.convertKeysToCamelCase = convertKeysToCamelCase;
//# sourceMappingURL=DataObjectPopertyNameCamelCaseConverter.js.map