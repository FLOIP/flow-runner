"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var IResourceResolver_1 = require("./IResourceResolver");
var ResourceNotFoundException_1 = tslib_1.__importDefault(require("./exceptions/ResourceNotFoundException"));
var floip_expression_evaluator_ts_1 = require("floip-expression-evaluator-ts");
var IBlock_1 = require("../flow-spec/IBlock");
var Resource = (function () {
    function Resource(uuid, values, context) {
        this.uuid = uuid;
        this.values = values;
        this.context = context;
    }
    Resource.prototype._getValueByContentType = function (contentType) {
        var def = this._findByContentType(contentType);
        if (def == null) {
            var _a = this.context, languageId = _a.languageId, mode = _a.mode;
            throw new ResourceNotFoundException_1.default("Unable to find resource for " + JSON.stringify({ contentType: contentType, languageId: languageId, mode: mode }));
        }
        return def.value;
    };
    Resource.prototype._hasByContentType = function (contentType) {
        return this._findByContentType(contentType) != null;
    };
    Resource.prototype._findByContentType = function (contentType) {
        return this.values.find(function (def) { return def.contentType === contentType; });
    };
    Resource.prototype.getAudio = function () {
        return this._getValueByContentType(IResourceResolver_1.SupportedContentType.AUDIO);
    };
    Resource.prototype.getImage = function () {
        return this._getValueByContentType(IResourceResolver_1.SupportedContentType.IMAGE);
    };
    Resource.prototype.getText = function () {
        return floip_expression_evaluator_ts_1.EvaluatorFactory.create()
            .evaluate(this._getValueByContentType(IResourceResolver_1.SupportedContentType.TEXT), IBlock_1.createEvalContextFrom(this.context));
    };
    Resource.prototype.getVideo = function () {
        return this._getValueByContentType(IResourceResolver_1.SupportedContentType.VIDEO);
    };
    Resource.prototype.hasAudio = function () {
        return this._hasByContentType(IResourceResolver_1.SupportedContentType.AUDIO);
    };
    Resource.prototype.hasImage = function () {
        return this._hasByContentType(IResourceResolver_1.SupportedContentType.IMAGE);
    };
    Resource.prototype.hasText = function () {
        return this._hasByContentType(IResourceResolver_1.SupportedContentType.TEXT);
    };
    Resource.prototype.hasVideo = function () {
        return this._hasByContentType(IResourceResolver_1.SupportedContentType.VIDEO);
    };
    return Resource;
}());
exports.Resource = Resource;
//# sourceMappingURL=Resource.js.map