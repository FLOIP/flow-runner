"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Prompt = void 0;
const index_1 = require("../index");
class Prompt {
    constructor(promptConstructor, promptKey) {
        this.promptConstructor = promptConstructor;
        this.promptKey = promptKey;
        if (Prompt.VALUES.find(prompt => prompt.promptKey == promptKey) != null) {
            console.info('Attempted to add duplicate promptKey');
        }
        else {
            Prompt.VALUES.push(this);
        }
    }
    static addCustomPrompt(promptConstructor, promptKey) {
        new Prompt(promptConstructor, promptKey);
    }
    static reset() {
        Prompt.VALUES = [Prompt.MESSAGE, Prompt.NUMERIC, Prompt.SELECT_ONE, Prompt.SELECT_MANY, Prompt.OPEN];
    }
    static valueOf(promptKey) {
        var _a;
        return (_a = Prompt.VALUES.filter(prompt => prompt.promptKey === promptKey)) === null || _a === void 0 ? void 0 : _a[0];
    }
    static values() {
        return Prompt.VALUES;
    }
}
exports.Prompt = Prompt;
Prompt.VALUES = [];
Prompt.MESSAGE = new Prompt(index_1.MessagePrompt, index_1.MESSAGE_PROMPT_KEY);
Prompt.NUMERIC = new Prompt(index_1.NumericPrompt, index_1.NUMERIC_PROMPT_KEY);
Prompt.SELECT_ONE = new Prompt(index_1.SelectOnePrompt, index_1.SELECT_ONE_PROMPT_KEY);
Prompt.SELECT_MANY = new Prompt(index_1.SelectManyPrompt, index_1.SELECT_MANY_PROMPT_KEY);
Prompt.OPEN = new Prompt(index_1.OpenPrompt, index_1.OPEN_PROMPT_KEY);
//# sourceMappingURL=Prompt.js.map