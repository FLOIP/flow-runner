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
exports.setContactProperty = exports.wrapInExprSyntaxWhenAbsent = exports.evaluateToString = exports.evaluateToBool = exports.createEvalContactFrom = exports.createEvalContextFrom = exports.generateCachedProxyForBlockName = exports.isLastBlock = exports.findDefaultBlockExitOrThrow = exports.findDefaultBlockExitOnOrNull = exports.firstTrueOrNullBlockExitOrThrow = exports.firstTrueBlockExitOrNull = exports.findFirstTruthyEvaluatingBlockExitOn = exports.findBlockExitWith = void 0;
const __1 = require("..");
const lodash_1 = require("lodash");
const expression_evaluator_1 = require("@floip/expression-evaluator");
const DateFormat_1 = require("../domain/DateFormat");
function findBlockExitWith(uuid, block) {
    const exit = (0, lodash_1.find)(block.exits, { uuid });
    if (exit == null) {
        throw new __1.ValidationException('Unable to find exit on block');
    }
    return exit;
}
exports.findBlockExitWith = findBlockExitWith;
/**
 * @param block
 * @param context
 * @deprecated Use firstTrueOrNullBlockExitOrThrow or firstTrueBlockExitOrNull
 */
function findFirstTruthyEvaluatingBlockExitOn(block, context) {
    const { exits } = block;
    if (exits.length === 0) {
        throw new __1.ValidationException(`Unable to find exits on block ${block.uuid}`);
    }
    const evalContext = createEvalContextFrom(context);
    return (0, lodash_1.find)(exits, ({ test, default: isDefault = false }) => !isDefault && evaluateToBool(String(test), evalContext));
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
        return ((_a = (0, lodash_1.find)(block.exits, blockExit => evaluateToBool(String(blockExit.test), evalContext))) !== null && _a !== void 0 ? _a : findDefaultBlockExitOnOrNull(block));
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
    /* We have to test against null, as some default exits are being sent with a value of null
        (MessageBlock, SetGroupMembershipBlock, CaseBlock)*/
    const exit = (0, lodash_1.find)(block.exits, blockExit => blockExit.default || blockExit.test == null);
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
    // create a proxy that traps get() and attempts a lookup of blocks by name
    return new Proxy(target, {
        get(target, prop, _receiver) {
            if (prop in target) {
                // todo: why are we using ...arguments here?
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                // eslint-disable-next-line prefer-rest-params
                return Reflect.get(...arguments);
            }
            // fetch our basic representation of a block stored on the context
            const evalBlock = (0, lodash_1.get)(ctx, `session_vars.block_interactions_by_block_name.${prop.toString()}`);
            if (evalBlock == null) {
                return;
            }
            // extend our basic block repr with the value from block interaction
            // block interactions are logically immutable, but we yank this later to
            //   (a) mitigate storing `.value`s redundantly
            //   (b) allow post-processing using behaviours
            // if we did want to cache the value as well, we'd need to
            //   (a) implement the value portion in runOneBlock() rather than navigateTo() and
            //   (b) remove the two lines below to simply return `evalBlock` ref
            const { value } = (0, __1.findInteractionWith)(evalBlock.__interactionId, ctx);
            return (0, lodash_1.extend)({ value, __value__: value }, evalBlock);
        },
        has(target, prop) {
            return prop in target || (0, lodash_1.has)(ctx, `session_vars.block_interactions_by_block_name.${prop.toString()}`);
        },
    });
}
exports.generateCachedProxyForBlockName = generateCachedProxyForBlockName;
// todo: push eval stuff into `Expression.evaluate()` abstraction for evalContext + result handling 👇
function createEvalContextFrom(context) {
    const { contact, cursor, mode, language_id: language } = context;
    let flow;
    let block;
    let prompt;
    if (cursor != null) {
        // because evalContext.block references the current block we're working on
        flow = (0, __1.getActiveFlowFrom)(context);
        block = (0, __1.findBlockWith)((0, __1.findInteractionWith)(cursor.interactionId, context).block_id, flow);
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
        flow: generateCachedProxyForBlockName(Object.assign(Object.assign({}, flow), { 
            // todo: why isn't this languageId?
            language }), context),
        block: Object.assign(Object.assign({}, block), { value: prompt != null ? prompt.value : undefined }),
        date: {
            today: (0, DateFormat_1.createFormattedDate)(today),
            tomorrow: (0, DateFormat_1.createFormattedDate)(tomorrow),
            yesterday: (0, DateFormat_1.createFormattedDate)(yesterday),
            __value__: (0, DateFormat_1.createFormattedDate)(today),
        },
    };
}
exports.createEvalContextFrom = createEvalContextFrom;
/**
 * Create a contact for use in evaluation context.
 * This creates a copy of the passed contact and removes, from the contacts list
 * of groups, any groups that have been marked as deleted.
 * @param contact
 */
function createEvalContactFrom(contact) {
    var _a, _b;
    const evalContact = (0, lodash_1.cloneDeep)(contact);
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
    return (0, lodash_1.startsWith)(expr, '@(') ? expr : `@(${expr})`;
}
exports.wrapInExprSyntaxWhenAbsent = wrapInExprSyntaxWhenAbsent;
/**
 * Set properties on the contact contained in the flow context.
 */
function setContactProperty(block, context) {
    var _a;
    (_a = block.config.set_contact_property) === null || _a === void 0 ? void 0 : _a.forEach(setContactProperty => setSingleContactProperty(setContactProperty, context));
}
exports.setContactProperty = setContactProperty;
function setSingleContactProperty(property, context) {
    const value = expression_evaluator_1.EvaluatorFactory.create().evaluate(property.property_value, createEvalContextFrom(context));
    context.contact.setProperty(property.property_key, value);
}
//# sourceMappingURL=IBlock.js.map