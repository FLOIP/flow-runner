"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const __1 = require("../..");
const ResourceResolver_1 = tslib_1.__importDefault(require("../ResourceResolver"));
const lodash_1 = require("lodash");
const floip_expression_evaluator_ts_1 = require("floip-expression-evaluator-ts");
const ValidationException_1 = tslib_1.__importDefault(require("../exceptions/ValidationException"));
class SelectOneResponseBlockRunner {
    constructor(block, context) {
        this.block = block;
        this.context = context;
    }
    initialize() {
        const { prompt, choices } = this.block.config;
        const resources = new ResourceResolver_1.default(this.context);
        return {
            kind: __1.KnownPrompts.SelectOne,
            prompt: resources.resolve(prompt),
            isResponseRequired: true,
            choices: Object.keys(choices)
                .map(key => ({
                key,
                value: resources.resolve(choices[key]),
            })),
        };
    }
    run() {
        const { exits } = this.block;
        if (exits.length === 0) {
            throw new ValidationException_1.default(`Unable to find exits on block ${this.block.uuid}`);
        }
        const { cursor } = this.context;
        if (cursor == null || cursor[1] == null) {
            throw new ValidationException_1.default(`Unable to find cursor on context ${this.context.id}`);
        }
        const evalContext = this.createEvalContextFrom(this.context);
        const exit = lodash_1.find(this.block.exits, ({ test }) => this.evaluateToBool(String(test), evalContext));
        return (exit != null ? exit : lodash_1.last(exits));
    }
    createEvalContextFrom(context) {
        const { contact, cursor, mode, languageId: language } = context;
        return {
            contact,
            channel: { mode },
            flow: {
                ...__1.getActiveFlowFrom(this.context),
                language,
            },
            block: {
                ...this.block,
                value: cursor[1].value,
            },
        };
    }
    evaluateToBool(expr, ctx) {
        const evaluator = floip_expression_evaluator_ts_1.EvaluatorFactory.create();
        const result = evaluator.evaluate(expr, ctx);
        return JSON.parse(result.toLocaleLowerCase());
    }
}
exports.default = SelectOneResponseBlockRunner;
//# sourceMappingURL=SelectOneResponseBlockRunner.js.map