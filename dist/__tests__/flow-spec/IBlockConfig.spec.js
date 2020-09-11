"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("../..");
describe('IBlockConfig', () => {
    it('asserts the type of ISetContactPropertyBlockConfig', () => {
        const trueCase = {
            setContactProperty: {
                propertyKey: 'foo',
                propertyValue: 'bar',
            },
        };
        const falseCase = {};
        expect(__1.isSetContactPropertyConfig(trueCase)).toBeTruthy();
        expect(__1.isSetContactPropertyConfig(falseCase)).toBeFalsy();
    });
});
//# sourceMappingURL=IBlockConfig.spec.js.map