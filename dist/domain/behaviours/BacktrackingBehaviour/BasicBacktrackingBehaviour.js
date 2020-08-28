"use strict";
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
class BasicBacktrackingBehaviour {
    constructor(context, navigator, promptBuilder) {
        this.context = context;
        this.navigator = navigator;
        this.promptBuilder = promptBuilder;
    }
    rebuildIndex() {
    }
    seek(steps = 0, context = this.context) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { interaction: prevIntx, prompt: virtualPrompt } = yield this.peek(steps, context);
            const cursor = (yield this.jumpTo(prevIntx, context));
            cursor.prompt.value = virtualPrompt.value;
            return cursor;
        });
    }
    jumpTo(intx, context = this.context) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const discarded = context.interactions.splice(lodash_1.findLastIndex(context.interactions, intx), context.interactions.length);
            lodash_1.forEachRight(discarded, intx => intx.uuid === lodash_1.last(context.nestedFlowBlockInteractionIdStack) ? context.nestedFlowBlockInteractionIdStack.pop() : null);
            lodash_1.forEachRight(discarded, ({ uuid }) => {
                var _a;
                while (((_a = lodash_1.last(context.reversibleOperations)) === null || _a === void 0 ? void 0 : _a.interactionId) === uuid) {
                    __1.FlowRunner.prototype.reverseLastDataOperation(context);
                }
            });
            return this.navigator.navigateTo(__1.findBlockOnActiveFlowWith(intx.blockId, context), context);
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
        let _steps = steps + 1;
        const intx = _find(context.interactions, ({ type }) => !lodash_1.includes(__1.NON_INTERACTIVE_BLOCK_TYPES, type) && --_steps === 0);
        if (intx == null || _steps > 0) {
            throw new __1.ValidationException(`Unable to backtrack to an interaction that far back ${JSON.stringify({ steps })}`);
        }
        return intx;
    }
    peek(steps = 0, context = this.context, direction = PeekDirection.LEFT) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const intx = this._findInteractiveInteractionAt(steps, context, direction);
            const block = __1.findBlockWith(intx.blockId, __1.findFlowWith(intx.flowId, context));
            const prompt = yield this.promptBuilder.buildPromptFor(block, intx);
            if (prompt == null) {
                throw new __1.ValidationException(`Unable to build a prompt for ${JSON.stringify({
                    context: context.id,
                    intx,
                    block,
                })}`);
            }
            return {
                interaction: intx,
                prompt: Object.assign(prompt, { value: intx.value }),
            };
        });
    }
    postInteractionCreate(interaction, _context) {
        return interaction;
    }
    postInteractionComplete(_interaction, _context) {
    }
}
exports.BasicBacktrackingBehaviour = BasicBacktrackingBehaviour;
//# sourceMappingURL=BasicBacktrackingBehaviour.js.map