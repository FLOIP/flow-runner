"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupportedContentType = void 0;
/**
 * Supported content types for Resources: https://floip.gitbook.io/flow-specification/flows#resources
 *
 * This is a custom Dynamic Enum for SupportedContentTypes, that allows adding of custom values at runtime, by calling
 * `SupportedContentType.addCustomSupportedContentType()`.
 */
var SupportedContentType;
(function (SupportedContentType) {
    SupportedContentType["TEXT"] = "TEXT";
    SupportedContentType["AUDIO"] = "AUDIO";
    SupportedContentType["IMAGE"] = "IMAGE";
    SupportedContentType["VIDEO"] = "VIDEO";
    SupportedContentType["DATA"] = "DATA";
})(SupportedContentType = exports.SupportedContentType || (exports.SupportedContentType = {}));
//# sourceMappingURL=SupportedContentType.js.map