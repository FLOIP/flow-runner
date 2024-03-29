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
exports.SelectManyPrompt = exports.SELECT_MANY_PROMPT_KEY = exports.INVALID_ALL_SELECTIONS_MUST_EXIST_ON_BLOCK = exports.INVALID_AT_LEAST_ONE_SELECTION_REQUIRED = void 0;
const __1 = require("../..");
const lodash_1 = require("lodash");
exports.INVALID_AT_LEAST_ONE_SELECTION_REQUIRED = 'At least one selection is required, but none provided';
exports.INVALID_ALL_SELECTIONS_MUST_EXIST_ON_BLOCK = 'All selections must be valid choices on block';
exports.SELECT_MANY_PROMPT_KEY = 'SelectMany';
/**
 * Concrete implementation of {@link BasePrompt} to request a selection from multiple choices, optionally requiring at
 * least one, from an {@link IContact}.
 */
class SelectManyPrompt extends __1.BasePrompt {
    /* TODO: This will return true, or throw an error, but it seems like it should return a false instead of throwing error.
        Consider making a validateOrThrow and a and a validate, where validate only returns true/false. */
    validate(selections) {
        const { isResponseRequired, choices } = this.config;
        if (!isResponseRequired) {
            return true;
        }
        if (selections.length === 0) {
            throw new __1.ValidationException(exports.INVALID_AT_LEAST_ONE_SELECTION_REQUIRED);
        }
        const invalidChoices = (0, lodash_1.difference)(selections, (0, lodash_1.map)(choices, 'prompt'));
        if (invalidChoices.length !== 0) {
            throw new __1.InvalidChoiceException(exports.INVALID_ALL_SELECTIONS_MUST_EXIST_ON_BLOCK, invalidChoices);
        }
        return true;
    }
}
exports.SelectManyPrompt = SelectManyPrompt;
//# sourceMappingURL=SelectManyPrompt.js.map