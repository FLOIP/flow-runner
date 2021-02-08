"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getResource = exports.createTextResourceVariantWith = void 0;
const __1 = require("..");
function createTextResourceVariantWith(value, ctx) {
    return {
        contentType: __1.SupportedContentType.TEXT,
        value,
        languageId: ctx.language_id,
        modes: [ctx.mode],
    };
}
exports.createTextResourceVariantWith = createTextResourceVariantWith;
function getResource(context, resourceId) {
    return new __1.ResourceResolver(context).resolve(resourceId);
}
exports.getResource = getResource;
//# sourceMappingURL=IResourceResolver.js.map