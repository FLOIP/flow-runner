"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdvancedSelectOneBlockRunner = void 0;
const tslib_1 = require("tslib");
const __1 = require("../..");
const lodash_1 = require("lodash");
class AdvancedSelectOneBlockRunner {
    constructor(block, context) {
        this.block = block;
        this.context = context;
    }
    initialize({ value }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { prompt, prompt_audio, primary_field, secondary_fields, choice_row_fields, choice_rows, response_fields } = this.block.config;
            return {
                kind: __1.ADVANCED_SELECT_ONE_PROMPT_KEY,
                prompt,
                promptAudio: prompt_audio,
                primaryField: primary_field,
                secondaryFields: secondary_fields,
                choiceRowFields: choice_row_fields,
                choiceRows: choice_rows,
                responseFields: response_fields,
                isResponseRequired: true,
                value: value,
            };
        });
    }
    run() {
        var _a;
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            __1.setContactProperty(this.block, this.context);
            return (_a = __1.findFirstTruthyEvaluatingBlockExitOn(this.block, this.context)) !== null && _a !== void 0 ? _a : lodash_1.last(this.block.exits);
        });
    }
}
exports.AdvancedSelectOneBlockRunner = AdvancedSelectOneBlockRunner;
//# sourceMappingURL=AdvancedSelectOneBlockRunner.js.map