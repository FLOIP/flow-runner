"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdvancedSelectOneBlockRunner = void 0;
const tslib_1 = require("tslib");
const __1 = require("../..");
class AdvancedSelectOneBlockRunner {
    constructor(block, context) {
        this.block = block;
        this.context = context;
    }
    initialize({ value }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { prompt, primary_field, secondary_fields, choice_row_fields, choice_rows, response_fields } = this.block.config;
            return {
                kind: __1.ADVANCED_SELECT_ONE_PROMPT_KEY,
                prompt,
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
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                __1.setContactProperty(this.block, this.context);
            }
            catch (e) {
                console.error(e);
                return __1.findDefaultBlockExitOrThrow(this.block);
            }
            return __1.firstTrueBlockExitOrThrow(this.block, this.context);
        });
    }
}
exports.AdvancedSelectOneBlockRunner = AdvancedSelectOneBlockRunner;
//# sourceMappingURL=AdvancedSelectOneBlockRunner.js.map