"use strict";
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
exports.ResourceResolver = void 0;
const __1 = require("..");
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
        var _a, _b;
        const { mode, language_id } = this.context;
        if (!isUUID(resourceId)) {
            return new __1.Resource(resourceId, [__1.createTextResourceVariantWith(resourceId, this.context)], this.context);
        }
        const resource = (_b = (_a = __1.getActiveFlowFrom(this.context)) === null || _a === void 0 ? void 0 : _a.resources) === null || _b === void 0 ? void 0 : _b.find(({ uuid }) => uuid === resourceId);
        if (resource == null) {
            throw new __1.ResourceNotFoundException(`No resource matching ${JSON.stringify(resourceId)} for ${JSON.stringify({
                mode,
                language_id,
            })}`);
        }
        const values = resource.values.filter(def => def.language_id === language_id && lodash_1.intersection(def.modes, [mode]).length > 0);
        return new __1.Resource(resourceId, values, this.context);
    }
}
exports.ResourceResolver = ResourceResolver;
//# sourceMappingURL=ResourceResolver.js.map