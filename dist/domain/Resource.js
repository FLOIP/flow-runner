"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const IResourceResolver_1 = require("./IResourceResolver");
const ResourceNotFoundException_1 = tslib_1.__importDefault(require("./exceptions/ResourceNotFoundException"));
const expression_evaluator_1 = require("@floip/expression-evaluator");
const IBlock_1 = require("../flow-spec/IBlock");
class Resource {
    constructor(uuid, values, context) {
        this.uuid = uuid;
        this.values = values;
        this.context = context;
    }
    _getValueByContentType(contentType) {
        const def = this._findByContentType(contentType);
        if (def == null) {
            const { languageId, mode } = this.context;
            throw new ResourceNotFoundException_1.default(`Unable to find resource for ${JSON.stringify({ contentType, languageId, mode })}`);
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
        return expression_evaluator_1.EvaluatorFactory.create()
            .evaluate(this._getValueByContentType(IResourceResolver_1.SupportedContentType.TEXT), IBlock_1.createEvalContextFrom(this.context));
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