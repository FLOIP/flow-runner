"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setContactProperty = exports.wrapInExprSyntaxWhenAbsent = exports.evaluateToString = exports.evaluateToBool = exports.createEvalContactFrom = exports.createEvalContextFrom = exports.generateCachedProxyForBlockName = exports.isLastBlock = exports.findDefaultBlockExitOrThrow = exports.findDefaultBlockExitOnOrNull = exports.firstTrueOrNullBlockExitOrThrow = exports.firstTrueBlockExitOrNull = exports.findFirstTruthyEvaluatingBlockExitOn = exports.findBlockExitWith = void 0;
const __1 = require("..");
const lodash_1 = require("lodash");
const expression_evaluator_1 = require("@floip/expression-evaluator");
const DateFormat_1 = require("../domain/DateFormat");
function findBlockExitWith(uuid, block) {
    const exit = lodash_1.find(block.exits, { uuid });
    if (exit == null) {
        throw new __1.ValidationException('Unable to find exit on block');
    }
    return exit;
}
exports.findBlockExitWith = findBlockExitWith;
function findFirstTruthyEvaluatingBlockExitOn(block, context) {
    const { exits } = block;
    if (exits.length === 0) {
        throw new __1.ValidationException(`Unable to find exits on block ${block.uuid}`);
    }
    const evalContext = createEvalContextFrom(context);
    return lodash_1.find(exits, ({ test, default: isDefault = false }) => !isDefault && evaluateToBool(String(test), evalContext));
}
exports.findFirstTruthyEvaluatingBlockExitOn = findFirstTruthyEvaluatingBlockExitOn;
function firstTrueBlockExitOrNull(block, context) {
    try {
        return firstTrueOrNullBlockExitOrThrow(block, context);
    }
    catch (e) {
        return undefined;
    }
}
exports.firstTrueBlockExitOrNull = firstTrueBlockExitOrNull;
function firstTrueOrNullBlockExitOrThrow(block, context) {
    const blockExit = _firstBlockExit(context, block);
    if (blockExit == null) {
        throw new __1.ValidationException(`All block exits evaluated to false. Block: ${block.uuid}`);
    }
    return blockExit;
}
exports.firstTrueOrNullBlockExitOrThrow = firstTrueOrNullBlockExitOrThrow;
function _firstBlockExit(context, block) {
    var _a;
    try {
        const evalContext = createEvalContextFrom(context);
        return ((_a = lodash_1.find(block.exits, blockExit => evaluateToBool(String(blockExit.test), evalContext))) !== null && _a !== void 0 ? _a : findDefaultBlockExitOnOrNull(block));
    }
    catch (e) {
        console.error(e);
        return findDefaultBlockExitOnOrNull(block);
    }
}
function findDefaultBlockExitOnOrNull(block) {
    try {
        return findDefaultBlockExitOrThrow(block);
    }
    catch (e) {
        return undefined;
    }
}
exports.findDefaultBlockExitOnOrNull = findDefaultBlockExitOnOrNull;
function findDefaultBlockExitOrThrow(block) {
    const exit = lodash_1.find(block.exits, blockExit => blockExit.default || blockExit.test == null);
    if (exit == null) {
        throw new __1.ValidationException(`Unable to find default exit on block ${block.uuid}`);
    }
    return exit;
}
exports.findDefaultBlockExitOrThrow = findDefaultBlockExitOrThrow;
function isLastBlock({ exits }) {
    return exits.every(e => e.destination_block == null);
}
exports.isLastBlock = isLastBlock;
function generateCachedProxyForBlockName(target, ctx) {
    return new Proxy(target, {
        get(target, prop, _receiver) {
            if (prop in target) {
                return Reflect.get(...arguments);
            }
            const evalBlock = lodash_1.get(ctx, `session_vars.block_interactions_by_block_name.${prop.toString()}`);
            if (evalBlock == null) {
                return;
            }
            const { value } = __1.findInteractionWith(evalBlock.__interactionId, ctx);
            return lodash_1.extend({ value, __value__: value }, evalBlock);
        },
        has(target, prop) {
            return prop in target || lodash_1.has(ctx, `session_vars.block_interactions_by_block_name.${prop.toString()}`);
        },
    });
}
exports.generateCachedProxyForBlockName = generateCachedProxyForBlockName;
function createEvalContextFrom(context) {
    const { contact, cursor, mode, language_id: language } = context;
    let flow;
    let block;
    let prompt;
    if (cursor != null) {
        flow = __1.getActiveFlowFrom(context);
        block = __1.findBlockWith(__1.findInteractionWith(cursor.interactionId, context).block_id, flow);
        prompt = cursor.promptConfig;
    }
    const today = new Date();
    const tomorrow = new Date();
    const yesterday = new Date();
    tomorrow.setDate(today.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    yesterday.setDate(today.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);
    return {
        contact: createEvalContactFrom(contact),
        channel: { mode },
        flow: generateCachedProxyForBlockName(Object.assign(Object.assign({}, flow), { language }), context),
        block: Object.assign(Object.assign({}, block), { value: prompt != null ? prompt.value : undefined }),
        date: {
            today: DateFormat_1.createFormattedDate(today),
            tomorrow: DateFormat_1.createFormattedDate(tomorrow),
            yesterday: DateFormat_1.createFormattedDate(yesterday),
            __value__: DateFormat_1.createFormattedDate(today),
        },
    };
}
exports.createEvalContextFrom = createEvalContextFrom;
function createEvalContactFrom(contact) {
    var _a, _b;
    const evalContact = lodash_1.cloneDeep(contact);
    evalContact.groups = (_b = (_a = evalContact.groups) === null || _a === void 0 ? void 0 : _a.filter(group => group.deleted_at === null)) !== null && _b !== void 0 ? _b : [];
    return evalContact;
}
exports.createEvalContactFrom = createEvalContactFrom;
function evaluateToBool(expr, ctx) {
    return JSON.parse(evaluateToString(expr, ctx).toLowerCase());
}
exports.evaluateToBool = evaluateToBool;
function evaluateToString(expr, ctx) {
    return expression_evaluator_1.EvaluatorFactory.create().evaluate(wrapInExprSyntaxWhenAbsent(expr), ctx);
}
exports.evaluateToString = evaluateToString;
function wrapInExprSyntaxWhenAbsent(expr) {
    return lodash_1.startsWith(expr, '@(') ? expr : `@(${expr})`;
}
exports.wrapInExprSyntaxWhenAbsent = wrapInExprSyntaxWhenAbsent;
function setContactProperty(block, context) {
    var _a;
    (_a = block.config.set_contact_property) === null || _a === void 0 ? void 0 : _a.forEach(setContactProperty => setSingleContactProperty(setContactProperty, context));
}
exports.setContactProperty = setContactProperty;
function setSingleContactProperty(property, context) {
    const value = evaluateToString(property.property_value, createEvalContextFrom(context));
    context.contact.setProperty(property.property_key, value);
}
//# sourceMappingURL=IBlock.js.map