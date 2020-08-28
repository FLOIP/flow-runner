"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const __1 = require("../..");
const IDataset_1 = require("../fixtures/IDataset");
describe('SelectManyPrompt', () => {
    let dataset;
    beforeEach(() => {
        dataset = IDataset_1.createDefaultDataset();
    });
    describe('validate', () => {
        let prompt;
        beforeEach(() => {
            const config = dataset._prompts[1];
            const ctx = dataset.contexts[1];
            const runner = new __1.FlowRunner(ctx);
            prompt = new __1.SelectManyPrompt(config, 'intx-123', runner);
        });
        describe('when a response isRequired', () => {
            it('should raise when some selections are invalid', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                const selections = ['choice-A', 'choice-B', 'key-not-in-prompt-config', 'choice-C'];
                verifyValidationThrows(prompt.validate.bind(prompt, selections), __1.InvalidChoiceException, __1.INVALID_ALL_SELECTIONS_MUST_EXIST_ON_BLOCK, ['key-not-in-prompt-config']);
            }));
            it('should raise when all selections are invalid', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                const selections = [
                    'key-not-in-prompt-config-A',
                    'key-not-in-prompt-config-B',
                    'key-not-in-prompt-config-C',
                    'key-not-in-prompt-config-D',
                ];
                verifyValidationThrows(prompt.validate.bind(prompt, selections), __1.InvalidChoiceException, __1.INVALID_ALL_SELECTIONS_MUST_EXIST_ON_BLOCK, selections);
            }));
            it('should raise when no selections are provided', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                const selections = [];
                verifyValidationThrows(prompt.validate.bind(prompt, selections), __1.ValidationException, __1.INVALID_AT_LEAST_ONE_SELECTION_REQUIRED);
            }));
        });
        it('should return true when all selections are valid', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            const selections = ['choice-A', 'choice-D'];
            expect(prompt.validate(selections)).toBe(true);
        }));
        it('should raise when some selections are invalid when isRequired is false', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            prompt.config.isResponseRequired = false;
            const selections = ['choice-A', 'choice-B', 'key-not-in-prompt-config', 'choice-C'];
            expect(prompt.validate(selections)).toBe(true);
        }));
    });
});
const verifyValidationThrows = (invoker, ErrorType, msg, choices) => {
    try {
        invoker();
        expect(true).toBeFalsy();
    }
    catch (e) {
        expect(e).toBeInstanceOf(ErrorType);
        expect(e.message).toEqual(msg);
        expect(e.choices).toEqual(choices);
    }
};
//# sourceMappingURL=SelectManyPrompt.spec.js.map