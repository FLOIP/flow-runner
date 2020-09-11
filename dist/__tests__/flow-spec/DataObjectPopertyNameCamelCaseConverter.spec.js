"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("../..");
describe('convertKeysToCamelCase', () => {
    it.each([
        [{ helloWorld: 1 }, { hello_world: 1 }],
        [
            { oneTwo: 1, threeFour: 2 },
            { one_two: 1, three_four: 2 },
        ],
        [{ oneTwo: { threeFour: { fiveSix: 1 }, sevenEight: 2 } }, { one_two: { three_four: { five_six: 1 }, seven_eight: 2 } }],
    ])('should convert keys to camel-casing', (expected, source) => {
        expect(__1.convertKeysToCamelCase(source)).toEqual(expected);
    });
    it.each([
        [{ helloWorld: 1, blue_sky: 2 }, { hello_world: 1, blue_sky: 2 }, ['blue_sky']],
        [{ oneTwo: { three_four: { fiveSix: 1 }, sevenEight: 2 } }, { one_two: { three_four: { five_six: 1 }, seven_eight: 2 } }, ['three_four']],
    ])('should convert keys to camel-casing excluding excludes when provided', (expected, source, exclude) => {
        expect(__1.convertKeysToCamelCase(source, exclude)).toEqual(expected);
    });
});
//# sourceMappingURL=DataObjectPopertyNameCamelCaseConverter.spec.js.map