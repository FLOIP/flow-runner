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
exports.NumericPrompt = exports.NUMERIC_PROMPT_KEY = void 0;
const __1 = require("../..");
exports.NUMERIC_PROMPT_KEY = 'Numeric';
/**
 * Concrete implementation of {@link BasePrompt} to request a number, optionally within particular bounds, from an
 * {@link IContact}.
 */
class NumericPrompt extends __1.BasePrompt {
    validate(val) {
        if (Number.isNaN(val) || val === null) {
            return false;
        }
        const { min, max } = this.config;
        if (min != null && val < min) {
            throw new __1.ValidationException('Value provided is less than allowed');
        }
        if (max != null && val > max) {
            throw new __1.ValidationException('Value provided is greater than allowed');
        }
        return true;
    }
}
exports.NumericPrompt = NumericPrompt;
NumericPrompt.promptKey = 'Numeric';
//# sourceMappingURL=NumericPrompt.js.map