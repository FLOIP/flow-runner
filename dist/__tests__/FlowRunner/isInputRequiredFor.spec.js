"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const __1 = require("../..");
describe('FlowRunner/isInputRequiredFor', () => {
    let runner;
    beforeEach(() => {
        runner = new __1.FlowRunner({});
    });
    afterEach(() => {
        jest.restoreAllMocks();
    });
    it('should return false when cursor absent', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        expect(runner.isInputRequiredFor({})).toBeFalsy();
    }));
    it('should return false when prompt absent', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        expect(runner.isInputRequiredFor({ cursor: { interactionId: 'intx-123', promptConfig: undefined } })).toBeFalsy();
    }));
    it("should return true when prompt config's value is undefined", () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const promptConfig = { kind: __1.NUMERIC_PROMPT_KEY, value: undefined };
        expect(runner.isInputRequiredFor({ cursor: { interactionId: 'intx-123', promptConfig } })).toBeTruthy();
    }));
    it('should return false when prompt validation succeeds', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const promptConfig = { kind: __1.NUMERIC_PROMPT_KEY, value: 12 };
        jest.spyOn(runner, 'hydrateRichCursorFrom').mockImplementation(() => ({
            interaction: { uuid: 'intx-123' },
            prompt: createNumericPromptFor(promptConfig, runner),
        }));
        expect(runner.isInputRequiredFor({ cursor: { interactionId: 'intx-123', promptConfig } })).toBeFalsy();
    }));
    it('should return true when prompt validation raises', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const promptConfig = { kind: __1.NUMERIC_PROMPT_KEY, value: 12, max: 5 };
        jest.spyOn(runner, 'hydrateRichCursorFrom').mockImplementation(() => ({
            interaction: { uuid: 'intx-123' },
            prompt: createNumericPromptFor(promptConfig, runner),
        }));
        expect(runner.isInputRequiredFor({ cursor: { interactionId: 'intx-123', promptConfig } })).toBeTruthy();
    }));
});
const createNumericPromptFor = (promptConfig, runner) => new __1.NumericPrompt(promptConfig, 'intx-1234', runner);
//# sourceMappingURL=isInputRequiredFor.spec.js.map