"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResourceResolver = void 0;
const index_1 = require("../index");
const lodash_1 = require("lodash");
const UUID_MATCHER = /[\d\w]{8}(-[\d\w]{4}){3}-[\d\w]{12}/i;
function isUUID(uuid) {
    return uuid.length === 36 && UUID_MATCHER.test(uuid);
}
class ResourceResolver {
    constructor(context) {
        this.context = context;
    }
    resolve(resourceId) {
        const { mode, languageId } = this.context;
        if (!isUUID(resourceId)) {
            return new index_1.Resource(resourceId, [index_1.createTextResourceVariantWith(resourceId, this.context)], this.context);
        }
        const resource = this.context.resources.find(({ uuid }) => uuid === resourceId);
        if (resource == null) {
            throw new index_1.ResourceNotFoundException(`No resource matching ${JSON.stringify(resourceId)} for ${JSON.stringify({
                mode,
                languageId,
            })}`);
        }
        const values = resource.values.filter(def => def.languageId === languageId && lodash_1.intersection(def.modes, [mode]).length > 0);
        return new index_1.Resource(resourceId, values, this.context);
    }
}
exports.ResourceResolver = ResourceResolver;
//# sourceMappingURL=ResourceResolver.js.map