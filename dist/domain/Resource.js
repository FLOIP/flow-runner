"use strict";
/* eslint-disable prettier/prettier */
/**
 * Flow Interoperability Project (flowinterop.org)
 * Flow Runner
 * Copyright (c) 2019, 2020 Viamo Inc.
 * Authored by: Brett Zabos (brett.zabos@viamo.io)
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
 * documentation files (the "Software"), to deal in the Software without restriction, including without limitation the
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to the following conditions:
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the
 * Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
 * WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
 * OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 **/
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
    _getValueByContentAndMimeType(contentType, mimeType) {
        const def = this._findByContentAndMimeType(contentType, mimeType);
        if (def == null) {
            const { language_id, mode } = this.context;
            throw new __1.ResourceNotFoundException(`Unable to find resource for ${JSON.stringify({
                contentType,
                mimeType,
                language_id,
                mode,
            })}`);
        }
        return def.value;
    }
    _hasByContentType(contentType) {
        return this._findByContentType(contentType) != null;
    }
    _hasByContentAndMimeType(contentType, mimeType) {
        return this._findByContentAndMimeType(contentType, mimeType) != null;
    }
    _findByContentType(contentType) {
        return this.values.find(def => def.content_type === contentType);
    }
    _findByContentAndMimeType(contentType, mimeType) {
        return this.values.find(def => def.content_type === contentType && def.mime_type === mimeType);
    }
    getAudio() {
        return this._getValueByContentType(__1.SupportedContentType.AUDIO);
    }
    getImage() {
        return this._getValueByContentType(__1.SupportedContentType.IMAGE);
    }
    getText() {
        return expression_evaluator_1.EvaluatorFactory.create().evaluate(this._getValueByContentType(__1.SupportedContentType.TEXT), (0, __1.createEvalContextFrom)(this.context));
    }
    getVideo() {
        return this._getValueByContentType(__1.SupportedContentType.VIDEO);
    }
    /**
     * Convenience replacement for getData("text/csv").
     * This should be deprecated and replaced with getData() to stick to the spec and be simpler.
     * @returns equivalent of this.getData("text/csv")
     */
    getCsv() {
        return this.getData('text/csv');
    }
    getData(mimeType) {
        return this._getValueByContentAndMimeType(__1.SupportedContentType.DATA, mimeType);
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
        return this.hasData('text/csv');
    }
    hasData(mimeType) {
        return this._hasByContentAndMimeType(__1.SupportedContentType.DATA, mimeType);
    }
    has(key) {
        return this._hasByContentType(key);
    }
}
exports.Resource = Resource;
//# sourceMappingURL=Resource.js.map