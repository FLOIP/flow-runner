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
    constructor(modes, languageId, resourceDefinitions = []) {
        this.modes = modes;
        this.languageId = languageId;
        this.resourceDefinitions = resourceDefinitions;
    }
    resolve(resourceId) {
        const { modes, languageId } = this;
        if (!isUUID(resourceId)) {
            return new Resource_1.Resource(resourceId, [this.createTextResourceVariantWith(resourceId)], { languageId, modes });
        }
        const resource = this.resourceDefinitions.find(({ uuid }) => uuid === resourceId);
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
    createTextResourceVariantWith(value) {
        const { modes, languageId } = this;
        return {
            contentType: IResourceResolver_1.SupportedContentType.TEXT,
            value,
            languageId,
            modes,
        };
    }
}
exports.default = ResourceResolver;
//# sourceMappingURL=ResourceResolver.js.map