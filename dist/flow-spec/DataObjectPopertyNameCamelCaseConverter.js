"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
exports.EXCLUDED_DATA_HIERARCHIES_BY_KEY = ['choices', 'platformMetadata', 'platform_metadata'];
function convertKeysToCamelCase(x, exclusions = exports.EXCLUDED_DATA_HIERARCHIES_BY_KEY) {
    if (lodash_1.isArray(x)) {
        return x.map(_ => convertKeysToCamelCase(_, exclusions));
    }
    if (!lodash_1.isObject(x)) {
        return x;
    }
    return lodash_1.reduce(x, (memo, value, key) => {
        memo[lodash_1.includes(exclusions, key) ? key : lodash_1.camelCase(key)] =
            convertKeysToCamelCase(value, exclusions);
        return memo;
    }, {});
}
exports.default = convertKeysToCamelCase;
//# sourceMappingURL=DataObjectPopertyNameCamelCaseConverter.js.map