"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSetContactPropertyConfig = void 0;
function isSetContactPropertyConfig(arg) {
    var _a, _b;
    if (typeof arg === 'object' && arg !== null) {
        return ('setContactProperty' in arg &&
            typeof ((_a = arg.setContactProperty) === null || _a === void 0 ? void 0 : _a.propertyKey) === 'string' &&
            typeof ((_b = arg.setContactProperty) === null || _b === void 0 ? void 0 : _b.propertyValue) === 'string');
    }
    return false;
}
exports.isSetContactPropertyConfig = isSetContactPropertyConfig;
//# sourceMappingURL=IBlockConfig.js.map