"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const lodash_1 = require("lodash");
const ValidationException_1 = tslib_1.__importDefault(require("../domain/exceptions/ValidationException"));
const IContext_1 = require("./IContext");
const floip_expression_evaluator_ts_1 = require("floip-expression-evaluator-ts");
const IFlow_1 = require("./IFlow");
const ResourceResolver_1 = tslib_1.__importDefault(require("../domain/ResourceResolver"));
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
function findAndGenerateExpressionBlockFor(blockName, ctx) {
    const intx = lodash_1.findLast(ctx.interactions, ({ blockId, flowId }) => {
        const { name } = IFlow_1.findBlockWith(blockId, IContext_1.findFlowWith(flowId, ctx));
        return name === blockName;
    });
    if (intx == null) {
        return;
    }
    const { prompt } = IContext_1.findBlockOnActiveFlowWith(intx.blockId, ctx).config;
    const resource = new ResourceResolver_1.default(ctx).resolve(prompt);
    return {
        __interactionId: intx.uuid,
        __value__: intx.value,
        value: intx.value,
        time: intx.entryAt,
        text: resource.hasText() ? resource.getText() : ''
    };
}
exports.findAndGenerateExpressionBlockFor = findAndGenerateExpressionBlockFor;
function generateCachedProxyForBlockName(target, ctx) {
    const expressionBlocksByName = {};
    return new Proxy(target, {
        get(target, prop, _receiver) {
            if (prop in target) {
                return Reflect.get(...arguments);
            }
            if (prop in expressionBlocksByName) {
                return expressionBlocksByName[prop.toString()];
            }
            return expressionBlocksByName[prop.toString()] =
                findAndGenerateExpressionBlockFor(prop.toString(), ctx);
        },
        has(target, prop) {
            if (prop in target) {
                return true;
            }
            if (prop in expressionBlocksByName) {
                return true;
            }
            expressionBlocksByName[prop.toString()] =
                findAndGenerateExpressionBlockFor(prop.toString(), ctx);
            return prop in expressionBlocksByName;
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
        block = IFlow_1.findBlockWith(IContext_1.findInteractionWith(cursor[0], context).blockId, flow);
        prompt = cursor[1];
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
    const result = floip_expression_evaluator_ts_1.EvaluatorFactory.create()
        .evaluate(expr, ctx);
    return JSON.parse(result.toLowerCase());
}
//# sourceMappingURL=IBlock.js.map