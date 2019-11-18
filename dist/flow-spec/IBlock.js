"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var lodash_1 = require("lodash");
var ValidationException_1 = tslib_1.__importDefault(require("../domain/exceptions/ValidationException"));
var IContext_1 = require("./IContext");
var floip_expression_evaluator_ts_1 = require("floip-expression-evaluator-ts");
var IFlow_1 = require("./IFlow");
var ResourceResolver_1 = tslib_1.__importDefault(require("../domain/ResourceResolver"));
function findBlockExitWith(uuid, block) {
    var exit = lodash_1.find(block.exits, { uuid: uuid });
    if (exit == null) {
        throw new ValidationException_1.default('Unable to find exit on block');
    }
    return exit;
}
exports.findBlockExitWith = findBlockExitWith;
function findFirstTruthyEvaluatingBlockExitOn(block, context) {
    var exits = block.exits;
    if (exits.length === 0) {
        throw new ValidationException_1.default("Unable to find exits on block " + block.uuid);
    }
    var evalContext = createEvalContextFrom(context);
    return lodash_1.find(exits, function (_a) {
        var test = _a.test, _b = _a.default, isDefault = _b === void 0 ? false : _b;
        return !isDefault && evaluateToBool(String(test), evalContext);
    });
}
exports.findFirstTruthyEvaluatingBlockExitOn = findFirstTruthyEvaluatingBlockExitOn;
function findDefaultBlockExitOn(block) {
    var exit = lodash_1.find(block.exits, { default: true });
    if (exit == null) {
        throw new ValidationException_1.default("Unable to find default exit on block " + block.uuid);
    }
    return exit;
}
exports.findDefaultBlockExitOn = findDefaultBlockExitOn;
function findAndGenerateExpressionBlockFor(blockName, ctx) {
    var intx = lodash_1.findLast(ctx.interactions, function (_a) {
        var blockId = _a.blockId, flowId = _a.flowId;
        var name = IFlow_1.findBlockWith(blockId, IContext_1.findFlowWith(flowId, ctx)).name;
        return name === blockName;
    });
    if (intx == null) {
        return;
    }
    var prompt = IContext_1.findBlockOnActiveFlowWith(intx.blockId, ctx).config.prompt;
    var resource = new ResourceResolver_1.default(ctx).resolve(prompt);
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
    var expressionBlocksByName = {};
    return new Proxy(target, {
        get: function (target, prop, _receiver) {
            if (prop in target) {
                return Reflect.get.apply(Reflect, arguments);
            }
            if (prop in expressionBlocksByName) {
                return expressionBlocksByName[prop.toString()];
            }
            return expressionBlocksByName[prop.toString()] =
                findAndGenerateExpressionBlockFor(prop.toString(), ctx);
        },
        has: function (target, prop) {
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
    var contact = context.contact, cursor = context.cursor, mode = context.mode, language = context.languageId;
    var flow;
    var block;
    var prompt;
    if (cursor != null) {
        flow = IContext_1.getActiveFlowFrom(context);
        block = IFlow_1.findBlockWith(IContext_1.findInteractionWith(cursor[0], context).blockId, flow);
        prompt = cursor[1];
    }
    return {
        contact: contact,
        channel: { mode: mode },
        flow: generateCachedProxyForBlockName(tslib_1.__assign(tslib_1.__assign({}, flow), { language: language }), context),
        block: tslib_1.__assign(tslib_1.__assign({}, block), { value: prompt != null
                ? prompt.value
                : undefined }),
    };
}
exports.createEvalContextFrom = createEvalContextFrom;
function evaluateToBool(expr, ctx) {
    var result = floip_expression_evaluator_ts_1.EvaluatorFactory.create()
        .evaluate(expr, ctx);
    return JSON.parse(result.toLowerCase());
}
//# sourceMappingURL=IBlock.js.map