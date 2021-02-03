"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const __1 = require("../..");
const IDataset_1 = require("../fixtures/IDataset");
describe('BasePrompt', () => {
    let dataset;
    beforeEach(() => {
        dataset = IDataset_1.createDefaultDataset();
    });
    afterEach(() => {
        jest.restoreAllMocks();
    });
    describe('default state', () => {
        describe('error', () => {
            it('should default its error state to empty to simply UI rendering', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                const config = dataset._prompts[0];
                const ctx = dataset.contexts[1];
                const runner = new __1.FlowRunner(ctx);
                const prompt = new __1.MessagePrompt(config, 'abc-123', runner);
                expect(prompt.error).toBeNull();
            }));
        });
    });
    describe('fulfill', () => {
        it('should set provided value onto itself', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            const config = dataset._prompts[0];
            const ctx = dataset.contexts[1];
            const runner = new __1.FlowRunner(ctx);
            const prompt = new __1.MessagePrompt(config, 'abc-123', runner);
            jest.spyOn(runner, 'run').mockImplementation(() => tslib_1.__awaiter(void 0, void 0, void 0, function* () { return undefined; }));
            delete config.value;
            yield prompt.fulfill(null);
            expect(config.value).toBeNull();
        }));
        it('should return result of calling run on its runner', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            const config = dataset._prompts[0];
            const ctx = dataset.contexts[1];
            const runner = new __1.FlowRunner(ctx);
            const prompt = new __1.MessagePrompt(config, 'abc-123', runner);
            const richCursor = runner.hydrateRichCursorFrom(ctx);
            jest.spyOn(runner, 'run').mockImplementation(() => tslib_1.__awaiter(void 0, void 0, void 0, function* () { return richCursor; }));
            const cursor = yield prompt.fulfill(null);
            expect(cursor).toBe(richCursor);
        }));
    });
    describe('block', () => {
        it('should return block when block exists on runner', () => {
            const config = dataset._prompts[0];
            const firstInteractionId = '09894745-38ba-456f-aab4-720b7d09d5b3';
            const ctx = dataset.contexts[1];
            const runner = new __1.FlowRunner(ctx);
            const prompt = new __1.MessagePrompt(config, firstInteractionId, runner);
            expect(prompt.block).toBe(ctx.flows[1].blocks[0]);
        });
        it.skip('should return block on flow specified by interaction and not necessarily active flow', () => {
        });
        it('should return null when block absent on runner (and not raise)', () => {
            const config = dataset._prompts[0];
            const ctx = dataset.contexts[1];
            const runner = new __1.FlowRunner(ctx);
            const firstInteractionId = '09894745-38ba-456f-aab4-720b7d09d5b3';
            const prompt = new __1.MessagePrompt(config, firstInteractionId, runner);
            __1.findInteractionWith(firstInteractionId, ctx).block_id = 'some-absent-block';
            expect(prompt.block).toBeUndefined();
        });
    });
});
//# sourceMappingURL=BasePrompt.spec.js.map