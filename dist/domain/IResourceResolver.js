"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTextResourceVariantWith = void 0;
const __1 = require("..");
function createTextResourceVariantWith(value, ctx) {
    return {
        contentType: __1.SupportedContentType.TEXT,
        value,
        languageId: ctx.languageId,
        modes: [ctx.mode],
    };
}
exports.createTextResourceVariantWith = createTextResourceVariantWith;
//# sourceMappingURL=IResourceResolver.js.map