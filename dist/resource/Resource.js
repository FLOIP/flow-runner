"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Resource = void 0;
const index_1 = require("../index");
const expression_evaluator_1 = require("@floip/expression-evaluator");
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
            throw new index_1.ResourceNotFoundException(`Unable to find resource for ${JSON.stringify({
                contentType,
                languageId,
                mode,
            })}`);
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
        return this._getValueByContentType(index_1.SupportedContentType.AUDIO);
    }
    getImage() {
        return this._getValueByContentType(index_1.SupportedContentType.IMAGE);
    }
    getText() {
        return expression_evaluator_1.EvaluatorFactory.create().evaluate(this._getValueByContentType(index_1.SupportedContentType.TEXT), index_1.createEvalContextFrom(this.context));
    }
    getVideo() {
        return this._getValueByContentType(index_1.SupportedContentType.VIDEO);
    }
    hasAudio() {
        return this._hasByContentType(index_1.SupportedContentType.AUDIO);
    }
    hasImage() {
        return this._hasByContentType(index_1.SupportedContentType.IMAGE);
    }
    hasText() {
        return this._hasByContentType(index_1.SupportedContentType.TEXT);
    }
    hasVideo() {
        return this._hasByContentType(index_1.SupportedContentType.VIDEO);
    }
}
exports.Resource = Resource;
//# sourceMappingURL=Resource.js.map