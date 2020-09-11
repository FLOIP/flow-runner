"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTextResourceVariantWith = exports.SupportedContentType = void 0;
var SupportedContentType;
(function (SupportedContentType) {
    SupportedContentType["TEXT"] = "text";
    SupportedContentType["AUDIO"] = "audio";
    SupportedContentType["IMAGE"] = "image";
    SupportedContentType["VIDEO"] = "video";
})(SupportedContentType = exports.SupportedContentType || (exports.SupportedContentType = {}));
function createTextResourceVariantWith(value, ctx) {
    return {
        contentType: SupportedContentType.TEXT,
        value,
        languageId: ctx.languageId,
        modes: [ctx.mode],
    };
}
exports.createTextResourceVariantWith = createTextResourceVariantWith;
//# sourceMappingURL=IResourceResolver.js.map