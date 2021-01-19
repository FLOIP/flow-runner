"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSetContactPropertyConfig = void 0;
function isSetContactPropertyConfig(arg) {
    var _a, _b;
    if (typeof arg === 'object' && arg !== null) {
        return ('set_contact_property' in arg &&
            typeof ((_a = arg.set_contact_property) === null || _a === void 0 ? void 0 : _a.property_key) === 'string' &&
            typeof ((_b = arg.set_contact_property) === null || _b === void 0 ? void 0 : _b.property_value) === 'string');
    }
    return false;
}
exports.isSetContactPropertyConfig = isSetContactPropertyConfig;
//# sourceMappingURL=IBlockConfig.js.map