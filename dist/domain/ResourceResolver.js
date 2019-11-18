"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var IResourceResolver_1 = require("./IResourceResolver");
var lodash_1 = require("lodash");
var ResourceNotFoundException_1 = tslib_1.__importDefault(require("./exceptions/ResourceNotFoundException"));
var Resource_1 = require("./Resource");
var UUID_MATCHER = /[\d\w]{8}(-[\d\w]{4}){3}-[\d\w]{12}/i;
function isUUID(uuid) {
    return uuid.length === 36
        && UUID_MATCHER.test(uuid);
}
var ResourceResolver = (function () {
    function ResourceResolver(context) {
        this.context = context;
    }
    ResourceResolver.prototype.resolve = function (resourceId) {
        var _a = this.context, mode = _a.mode, languageId = _a.languageId;
        if (!isUUID(resourceId)) {
            return new Resource_1.Resource(resourceId, [IResourceResolver_1.createTextResourceVariantWith(resourceId, this.context)], this.context);
        }
        var resource = this.context.resources.find(function (_a) {
            var uuid = _a.uuid;
            return uuid === resourceId;
        });
        if (resource == null) {
            throw new ResourceNotFoundException_1.default("No resource matching " + JSON.stringify(resourceId) + " for " + JSON.stringify({
                mode: mode,
                languageId: languageId,
            }));
        }
        var values = resource.values.filter(function (def) { return def.languageId === languageId
            && lodash_1.intersection(def.modes, [mode]).length > 0; });
        return new Resource_1.Resource(resourceId, values, this.context);
    };
    return ResourceResolver;
}());
exports.default = ResourceResolver;
//# sourceMappingURL=ResourceResolver.js.map