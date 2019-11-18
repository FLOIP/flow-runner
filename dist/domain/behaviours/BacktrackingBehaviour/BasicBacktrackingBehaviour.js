"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var lodash_1 = require("lodash");
var IContext_1 = require("../../../flow-spec/IContext");
var ValidationException_1 = tslib_1.__importDefault(require("../../exceptions/ValidationException"));
var FlowRunner_1 = require("../../FlowRunner");
var __1 = require("../../..");
var BasicBacktrackingBehaviour = (function () {
    function BasicBacktrackingBehaviour(context, navigator, promptBuilder) {
        this.context = context;
        this.navigator = navigator;
        this.promptBuilder = promptBuilder;
    }
    BasicBacktrackingBehaviour.prototype.rebuildIndex = function () { };
    BasicBacktrackingBehaviour.prototype.seek = function (steps, context) {
        if (steps === void 0) { steps = 0; }
        if (context === void 0) { context = this.context; }
        var _a = this.peek(steps, context), prevIntx = _a[0], virtualPrompt = _a[1];
        var cursor = this.jumpTo(prevIntx, context);
        cursor[1].value = virtualPrompt.value;
        return cursor;
    };
    BasicBacktrackingBehaviour.prototype.jumpTo = function (intx, context) {
        if (context === void 0) { context = this.context; }
        var discarded = context.interactions.splice(lodash_1.findLastIndex(context.interactions, intx), context.interactions.length);
        lodash_1.forEachRight(discarded, function (intx) { return intx.uuid === lodash_1.last(context.nestedFlowBlockInteractionIdStack)
            ? context.nestedFlowBlockInteractionIdStack.pop()
            : null; });
        return this.navigator.navigateTo(IContext_1.findBlockOnActiveFlowWith(intx.blockId, context), context);
    };
    BasicBacktrackingBehaviour.prototype.peek = function (steps, context) {
        if (steps === void 0) { steps = 0; }
        if (context === void 0) { context = this.context; }
        var _steps = steps + 1;
        var intx = lodash_1.findLast(context.interactions, function (_a) {
            var type = _a.type;
            return !lodash_1.includes(FlowRunner_1.NON_INTERACTIVE_BLOCK_TYPES, type) && --_steps === 0;
        });
        if (intx == null || _steps > 0) {
            throw new ValidationException_1.default("Unable to backtrack to an interaction that far back " + JSON.stringify({ steps: steps }));
        }
        var block = __1.findBlockWith(intx.blockId, IContext_1.findFlowWith(intx.flowId, context));
        var prompt = this.promptBuilder.buildPromptFor(block, intx);
        if (prompt == null) {
            throw new ValidationException_1.default("Unable to build a prompt for " + JSON.stringify({
                context: context.id,
                intx: intx,
                block: block
            }));
        }
        return [intx, Object.assign(prompt, { value: intx.value })];
    };
    BasicBacktrackingBehaviour.prototype.postInteractionCreate = function (interaction, _context) {
        return interaction;
    };
    BasicBacktrackingBehaviour.prototype.postInteractionComplete = function (_interaction, _context) { };
    return BasicBacktrackingBehaviour;
}());
exports.default = BasicBacktrackingBehaviour;
//# sourceMappingURL=BasicBacktrackingBehaviour.js.map