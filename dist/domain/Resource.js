"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const IResourceResolver_1 = require("./IResourceResolver");
const ResourceNotFoundException_1 = tslib_1.__importDefault(require("./exceptions/ResourceNotFoundException"));
class Resource {
    constructor(uuid, values, criteria) {
        this.uuid = uuid;
        this.values = values;
        this.criteria = criteria;
    }
    _getValueByContentType(contentType) {
        const def = this._findByContentType(contentType);
        if (def == null) {
            const { criteria } = this;
            throw new ResourceNotFoundException_1.default(`Unable to find resource for ${JSON.stringify({ contentType, criteria })}`);
        }
        return def.value;
    }
    _hasByContentType(contentType) {
        return this._findByContentType(contentType) != null;
    }
    _findByContentType(contentType) {
        return this.values.find(def => def.contentType === contentType);
    }
    getAudio() {
        return this._getValueByContentType(IResourceResolver_1.SupportedContentType.AUDIO);
    }
    getImage() {
        return this._getValueByContentType(IResourceResolver_1.SupportedContentType.IMAGE);
    }
    getText() {
        return this._getValueByContentType(IResourceResolver_1.SupportedContentType.TEXT);
    }
    getVideo() {
        return this._getValueByContentType(IResourceResolver_1.SupportedContentType.VIDEO);
    }
    hasAudio() {
        return this._hasByContentType(IResourceResolver_1.SupportedContentType.AUDIO);
    }
    hasImage() {
        return this._hasByContentType(IResourceResolver_1.SupportedContentType.IMAGE);
    }
    hasText() {
        return this._hasByContentType(IResourceResolver_1.SupportedContentType.TEXT);
    }
    hasVideo() {
        return this._hasByContentType(IResourceResolver_1.SupportedContentType.VIDEO);
    }
}
exports.Resource = Resource;
//# sourceMappingURL=Resource.js.map