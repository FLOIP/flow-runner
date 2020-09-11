"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertKeysToCamelCase = exports.EXCLUDED_DATA_HIERARCHIES_BY_KEY = void 0;
const lodash_1 = require("lodash");
exports.EXCLUDED_DATA_HIERARCHIES_BY_KEY = ['choices', 'platformMetadata', 'platform_metadata'];
function convertKeysToCamelCase(x, exclusions = exports.EXCLUDED_DATA_HIERARCHIES_BY_KEY) {
    if (lodash_1.isArray(x)) {
        return x.map(_ => convertKeysToCamelCase(_, exclusions));
    }
    else if (!lodash_1.isObject(x)) {
        return x;
    }
    else {
        return lodash_1.reduce(x, (memo, value, key) => {
            memo[lodash_1.includes(exclusions, key) ? key : lodash_1.camelCase(key)] = convertKeysToCamelCase(value, exclusions);
            return memo;
        }, {});
    }
}
exports.convertKeysToCamelCase = convertKeysToCamelCase;
//# sourceMappingURL=DataObjectPropertyNameCamelCaseConverter.js.map