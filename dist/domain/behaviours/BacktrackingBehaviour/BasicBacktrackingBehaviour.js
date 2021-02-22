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
            const { interaction: prevIntx } = yield this.peek(steps, context);
            return (yield this.jumpTo(prevIntx, context));
        });
    }
    jumpTo(destinationInteraction, context = this.context) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const discarded = context.interactions.splice(lodash_1.findLastIndex(context.interactions, destinationInteraction), context.interactions.length);
            lodash_1.forEachRight(discarded, intx => intx.uuid === lodash_1.last(context.nested_flow_block_interaction_id_stack) ? context.nested_flow_block_interaction_id_stack.pop() : null);
            lodash_1.forEachRight(discarded, ({ uuid }) => {
                var _a;
                while (((_a = lodash_1.last(context.reversible_operations)) === null || _a === void 0 ? void 0 : _a.interactionId) === uuid) {
                    __1.FlowRunner.prototype.reverseLastDataOperation(context);
                }
            });
            const destinationBlock = __1.findBlockOnActiveFlowWith(destinationInteraction.block_id, context);
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
            const block = __1.findBlockWith(intx.block_id, __1.findFlowWith(intx.flow_id, context));
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
        if (this.jumpContext == null) {
            return interaction;
        }
        return Object.assign(interaction, {
            value: this.jumpContext.destinationInteraction.value,
        });
    }
    postInteractionComplete(_interaction, _context) {
    }
}
exports.BasicBacktrackingBehaviour = BasicBacktrackingBehaviour;
//# sourceMappingURL=BasicBacktrackingBehaviour.js.map