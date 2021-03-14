"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Resource = void 0;
const __1 = require("..");
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
            const { language_id, mode } = this.context;
            throw new __1.ResourceNotFoundException(`Unable to find resource for ${JSON.stringify({
                contentType,
                language_id,
                mode,
            })}`);
        }
        return def.value;
    }
    _hasByContentType(contentType) {
        return this._findByContentType(contentType) != null;
    }
    _findByContentType(contentType) {
        return this.values.find(def => def.content_type === contentType);
    }
    getAudio() {
        return this._getValueByContentType(__1.SupportedContentType.AUDIO);
    }
    getImage() {
        return this._getValueByContentType(__1.SupportedContentType.IMAGE);
    }
    getText() {
        return expression_evaluator_1.EvaluatorFactory.create().evaluate(this._getValueByContentType(__1.SupportedContentType.TEXT), __1.createEvalContextFrom(this.context));
    }
    getVideo() {
        return this._getValueByContentType(__1.SupportedContentType.VIDEO);
    }
    getCsv() {
        return this._getValueByContentType(__1.SupportedContentType.CSV);
    }
    get(key) {
        return this._getValueByContentType(key);
    }
    hasAudio() {
        return this._hasByContentType(__1.SupportedContentType.AUDIO);
    }
    hasImage() {
        return this._hasByContentType(__1.SupportedContentType.IMAGE);
    }
    hasText() {
        return this._hasByContentType(__1.SupportedContentType.TEXT);
    }
    hasVideo() {
        return this._hasByContentType(__1.SupportedContentType.VIDEO);
    }
    hasCsv() {
        return this._hasByContentType(__1.SupportedContentType.CSV);
    }
    has(key) {
        return this._hasByContentType(key);
    }
}
exports.Resource = Resource;
//# sourceMappingURL=Resource.js.map