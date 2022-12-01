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
exports.BasicBacktrackingBehaviour = exports.PeekDirection = void 0;
const tslib_1 = require("tslib");
const lodash_1 = require("lodash");
const __1 = require("../../..");
var PeekDirection;
(function (PeekDirection) {
    PeekDirection["RIGHT"] = "RIGHT";
    PeekDirection["LEFT"] = "LEFT";
})(PeekDirection = exports.PeekDirection || (exports.PeekDirection = {}));
/**
 * Basic implementation of time-travel. Solely provides ability to preview what's happened in the past, while any
 * modifications will clear the past's future.
 */
class BasicBacktrackingBehaviour {
    constructor(context, navigator, promptBuilder) {
        this.context = context;
        this.navigator = navigator;
        this.promptBuilder = promptBuilder;
    }
    rebuildIndex() {
        // do nothing for now
    }
    seek(steps = 0, context = this.context) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { interaction: prevIntx } = yield this.peek(steps, context);
            // then generate a cursor from desired interaction && set cursor on context
            return (yield this.jumpTo(prevIntx, context));
        });
    }
    jumpTo(destinationInteraction, context = this.context) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            // jump context.interactions back in time
            const discarded = context.interactions.splice(
            // truncate intx list to pull us back in time; include provided intx
            (0, lodash_1.findLastIndex)(context.interactions, destinationInteraction), context.interactions.length);
            // step out of nested flows that we've truncated
            // todo: migrate to also use applyReversibleDataOperation()
            (0, lodash_1.forEachRight)(discarded, intx => intx.uuid === (0, lodash_1.last)(context.nested_flow_block_interaction_id_stack) ? context.nested_flow_block_interaction_id_stack.pop() : null);
            // can only reverse from the end, so we only compare the last.
            (0, lodash_1.forEachRight)(discarded, ({ uuid }) => {
                var _a;
                while (((_a = (0, lodash_1.last)(context.reversible_operations)) === null || _a === void 0 ? void 0 : _a.interactionId) === uuid) {
                    __1.FlowRunner.prototype.reverseLastDataOperation(context);
                }
            });
            const destinationBlock = (0, __1.findBlockOnActiveFlowWith)(destinationInteraction.block_id, context);
            this.jumpContext = { discardedInteractions: discarded, destinationInteraction };
            const richCursor = yield this.navigator.navigateTo(destinationBlock, context);
            this.jumpContext = undefined;
            return richCursor;
        });
    }
    _findInteractiveInteractionAt(steps = 0, context = this.context, direction = PeekDirection.LEFT) {
        const _find = {
            [PeekDirection.RIGHT]: lodash_1.find,
            [PeekDirection.LEFT]: lodash_1.findLast,
        }[direction];
        if (_find == null) {
            throw new __1.ValidationException(`Unknown \`direction\` provided to findInteractiveInteractionAt() -
        ${JSON.stringify(direction)}`);
        }
        // setup for while-loop
        let _steps = steps + 1;
        const intx = _find(context.interactions, ({ type }) => !(0, lodash_1.includes)(__1.NON_INTERACTIVE_BLOCK_TYPES, type) && --_steps === 0);
        if (intx == null || _steps > 0) {
            throw new __1.ValidationException(`Unable to backtrack to an interaction that far back ${JSON.stringify({ steps })}`);
        }
        return intx;
    }
    peek(steps = 0, context = this.context, direction = PeekDirection.LEFT) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            // keep a trace of all interactions we attempt to make a prompt from
            const attemptedPrompts = [];
            let prompt;
            // we'll keep trying to backtrack to an interactive prompt until we run out
            // of interactions -- when that happens, we should catch an exception
            while (prompt == null) {
                try {
                    // attempt to build a prompt from the next interaction
                    const intx = this._findInteractiveInteractionAt(steps, context, direction);
                    const block = (0, __1.findBlockWith)(intx.block_id, (0, __1.findFlowWith)(intx.flow_id, context));
                    const prompt = yield this.promptBuilder.buildPromptFor(block, intx);
                    if (prompt == null) {
                        // we weren't able to build a prompt
                        attemptedPrompts.push({ intx, block });
                    }
                    else {
                        return {
                            interaction: intx,
                            prompt: Object.assign(prompt, { value: intx.value }),
                        };
                    }
                    // we'll try stepping over the interaction that had no prompt
                    ++steps;
                }
                catch (e) {
                    const attemptedMsg = `Skipped Interactions with No Prompt: ${JSON.stringify(attemptedPrompts)}`;
                    if (e instanceof Error) {
                        throw new __1.ValidationException(`${e.message}:\n${attemptedMsg}`);
                    }
                    else {
                        throw new __1.ValidationException(`${JSON.stringify(e)}:\n${attemptedMsg}}`);
                    }
                }
            }
            throw new __1.ValidationException(`Logic error when backtracking.\nSkipped Interactions with No Prompt: ${JSON.stringify(attemptedPrompts)}`);
        });
    }
    postInteractionCreate(interaction, _context) {
        if (this.jumpContext == null) {
            return interaction;
        }
        return Object.assign(interaction, {
            value: this.jumpContext.destinationInteraction.value,
        });
    }
    postInteractionComplete(_interaction, _context) {
        // do nothing
    }
}
exports.BasicBacktrackingBehaviour = BasicBacktrackingBehaviour;
//# sourceMappingURL=BasicBacktrackingBehaviour.js.map