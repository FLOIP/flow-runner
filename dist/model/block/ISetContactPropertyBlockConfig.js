"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSetSingleContactProperty = exports.isSetContactPropertyConfig = void 0;
function isSetContactPropertyConfig(thing) {
    if (typeof thing === 'object' && thing !== null && 'set_contact_property' in thing) {
        const setContactProperty = thing.set_contact_property;
        return Array.isArray(setContactProperty) && setContactProperty.every(item => isSetSingleContactProperty(item));
    }
    return false;
}
exports.isSetContactPropertyConfig = isSetContactPropertyConfig;
function isSetSingleContactProperty(thing) {
    if (typeof thing === 'object' && thing !== null) {
        return ('property_key' in thing &&
            'property_value' in thing &&
            typeof thing.property_key === 'string' &&
            typeof thing.property_value === 'string');
    }
    return false;
}
exports.isSetSingleContactProperty = isSetSingleContactProperty;
//# sourceMappingURL=ISetContactPropertyBlockConfig.js.map