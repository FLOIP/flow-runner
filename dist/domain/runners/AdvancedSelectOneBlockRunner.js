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
exports.AdvancedSelectOneBlockRunner = void 0;
const tslib_1 = require("tslib");
const __1 = require("../..");
class AdvancedSelectOneBlockRunner {
    constructor(block, context) {
        this.block = block;
        this.context = context;
    }
    initialize({ value }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { prompt, primary_field, secondary_fields, choice_row_fields, choice_rows, response_fields } = this.block.config;
            return {
                kind: __1.ADVANCED_SELECT_ONE_PROMPT_KEY,
                prompt,
                primaryField: primary_field,
                secondaryFields: secondary_fields,
                choiceRowFields: choice_row_fields,
                choiceRows: choice_rows,
                responseFields: response_fields,
                isResponseRequired: true,
                value: value,
            };
        });
    }
    run() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                (0, __1.setContactProperty)(this.block, this.context);
                return (0, __1.firstTrueOrNullBlockExitOrThrow)(this.block, this.context);
            }
            catch (e) {
                console.error(e);
                return (0, __1.findDefaultBlockExitOrThrow)(this.block);
            }
        });
    }
}
exports.AdvancedSelectOneBlockRunner = AdvancedSelectOneBlockRunner;
//# sourceMappingURL=AdvancedSelectOneBlockRunner.js.map