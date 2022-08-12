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
exports.RunFlowBlockRunner = void 0;
const tslib_1 = require("tslib");
const __1 = require("../..");
/**
 * Block runner for `Core.RunFlow` - This block starts and runs another {@link IFlow}, and returns execution to the
 * current {@link IFlow} when finished.
 *
 * Entry:
 * On entry to this block, control proceeds into the other Flow given by flow_id. The Context for the outer flow is
 * saved and stored within the new inner Flow's Context under the parentFlowContext key.
 *
 * Exit:
 * Multiple levels of nested Flows shall be supported. When an inner Flow terminates, this block resumes execution in
 * the outer Flow. The Context for the inner flow is saved and stored under the childFlowContext key, and flow proceeds
 * through the next block. If an exception exit is triggered within an inner flow causing the inner flow to terminate,
 * flow proceeds through the error exit.
 */
class RunFlowBlockRunner {
    constructor(block, context) {
        this.block = block;
        this.context = context;
    }
    initialize() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return undefined;
        });
    }
    run() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                __1.setContactProperty(this.block, this.context);
                return __1.firstTrueOrNullBlockExitOrThrow(this.block, this.context);
            }
            catch (e) {
                console.error(e);
                return __1.findDefaultBlockExitOrThrow(this.block);
            }
        });
    }
}
exports.RunFlowBlockRunner = RunFlowBlockRunner;
//# sourceMappingURL=RunFlowBlockRunner.js.map