"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSetContactProperty = exports.isSetContactPropertyConfig = void 0;
function isSetContactPropertyConfig(thing) {
    if (typeof thing === 'object' && thing !== null && 'set_contact_property' in thing) {
        const setContactProperty = thing.set_contact_property;
        return Array.isArray(setContactProperty) && setContactProperty.every(item => isSetContactProperty(item));
    }
    return false;
}
exports.isSetContactPropertyConfig = isSetContactPropertyConfig;
function isSetContactProperty(thing) {
    if (typeof thing === 'object' && thing !== null) {
        return ('property_key' in thing &&
            'property_value' in thing &&
            typeof thing.property_key === 'string' &&
            typeof thing.property_value === 'string');
    }
    return false;
}
exports.isSetContactProperty = isSetContactProperty;
//# sourceMappingURL=ISetContactPropertyBlockConfig.js.map