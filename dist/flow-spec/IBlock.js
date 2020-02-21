"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const lodash_1 = require("lodash");
const ValidationException_1 = tslib_1.__importDefault(require("../domain/exceptions/ValidationException"));
const IContext_1 = require("./IContext");
const expression_evaluator_1 = require("@floip/expression-evaluator");
const IFlow_1 = require("./IFlow");
function findBlockExitWith(uuid, block) {
    const exit = lodash_1.find(block.exits, { uuid });
    if (exit == null) {
        throw new ValidationException_1.default('Unable to find exit on block');
    }
    return exit;
}
exports.findBlockExitWith = findBlockExitWith;
function findFirstTruthyEvaluatingBlockExitOn(block, context) {
    const { exits } = block;
    if (exits.length === 0) {
        throw new ValidationException_1.default(`Unable to find exits on block ${block.uuid}`);
    }
    const evalContext = createEvalContextFrom(context);
    return lodash_1.find(exits, ({ test, default: isDefault = false }) => !isDefault && evaluateToBool(String(test), evalContext));
}
exports.findFirstTruthyEvaluatingBlockExitOn = findFirstTruthyEvaluatingBlockExitOn;
function findDefaultBlockExitOn(block) {
    const exit = lodash_1.find(block.exits, { default: true });
    if (exit == null) {
        throw new ValidationException_1.default(`Unable to find default exit on block ${block.uuid}`);
    }
    return exit;
}
exports.findDefaultBlockExitOn = findDefaultBlockExitOn;
function isLastBlock({ exits }) {
    return exits.every(e => e.destinationBlock == null);
}
exports.isLastBlock = isLastBlock;
function generateCachedProxyForBlockName(target, ctx) {
    return new Proxy(target, {
        get(target, prop, _receiver) {
            if (prop in target) {
                return Reflect.get(...arguments);
            }
            const evalBlock = lodash_1.get(ctx, `sessionVars.blockInteractionsByBlockName.${prop.toString()}`);
            if (evalBlock == null) {
                return;
            }
            const { value } = IContext_1.findInteractionWith(evalBlock.__interactionId, ctx);
            return lodash_1.extend({ value, __value__: value }, evalBlock);
        },
        has(target, prop) {
            return prop in target
                || lodash_1.has(ctx, `sessionVars.blockInteractionsByBlockName.${prop.toString()}`);
        }
    });
}
exports.generateCachedProxyForBlockName = generateCachedProxyForBlockName;
function createEvalContextFrom(context) {
    const { contact, cursor, mode, languageId: language } = context;
    let flow;
    let block;
    let prompt;
    if (cursor != null) {
        flow = IContext_1.getActiveFlowFrom(context);
        block = IFlow_1.findBlockWith(IContext_1.findInteractionWith(cursor.interactionId, context).blockId, flow);
        prompt = cursor.promptConfig;
    }
    return {
        contact,
        channel: { mode },
        flow: generateCachedProxyForBlockName(Object.assign(Object.assign({}, flow), { language }), context),
        block: Object.assign(Object.assign({}, block), { value: prompt != null
                ? prompt.value
                : undefined }),
    };
}
exports.createEvalContextFrom = createEvalContextFrom;
function evaluateToBool(expr, ctx) {
    return JSON.parse(evaluateToString(expr, ctx).toLowerCase());
}
exports.evaluateToBool = evaluateToBool;
function evaluateToString(expr, ctx) {
    return expression_evaluator_1.EvaluatorFactory.create()
        .evaluate(wrapInExprSyntaxWhenAbsent(expr), ctx);
}
exports.evaluateToString = evaluateToString;
function wrapInExprSyntaxWhenAbsent(expr) {
    return lodash_1.startsWith(expr, '@(')
        ? expr
        : `@(${expr})`;
}
exports.wrapInExprSyntaxWhenAbsent = wrapInExprSyntaxWhenAbsent;
//# sourceMappingURL=IBlock.js.map