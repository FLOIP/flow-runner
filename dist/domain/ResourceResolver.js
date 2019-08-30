"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const IResourceResolver_1 = require("./IResourceResolver");
const Resource_1 = require("./Resource");
const lodash_1 = require("lodash");
const ResourceNotFoundException_1 = tslib_1.__importDefault(require("./exceptions/ResourceNotFoundException"));
const UUID_MATCHER = /[\d\w]{8}(-[\d\w]{4}){3}-[\d\w]{12}/i;
function isUUID(uuid) {
    return uuid.length === 36
        && UUID_MATCHER.test(uuid);
}
class ResourceResolver {
    constructor(resources = []) {
        this.resources = resources;
    }
    resolve(resourceId, modes, languageId) {
        if (!isUUID(resourceId)) {
            return new Resource_1.Resource(resourceId, [{
                    contentType: IResourceResolver_1.SupportedContentType.TEXT,
                    value: resourceId,
                    languageId,
                    modes,
                }], { languageId, modes });
        }
        const resource = this.resources.find(({ uuid }) => uuid === resourceId);
        if (resource == null) {
            throw new ResourceNotFoundException_1.default(`No resource matching ${JSON.stringify(resourceId)} for ${JSON.stringify({
                modes,
                languageId,
            })}`);
        }
        const values = resource.values.filter(def => def.languageId === languageId
            && lodash_1.intersection(def.modes, modes).length > 0);
        return new Resource_1.Resource(resourceId, values, { languageId, modes });
    }
}
exports.default = ResourceResolver;
//# sourceMappingURL=ResourceResolver.js.map