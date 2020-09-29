"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const IDataset_1 = require("../fixtures/IDataset");
const __1 = require("../..");
describe('FlowRunner/initializeOneBlock', () => {
    let dataset;
    beforeEach(() => {
        dataset = IDataset_1.createDefaultDataset();
    });
    it('should return cursor with empty prompt when prompt not provided', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const ctx = dataset.contexts[0];
        const flow = ctx.flows[0];
        const block = flow.blocks[0];
        const runner = new __1.FlowRunner(ctx, new __1.BlockRunnerFactoryStore([
            [
                'MobilePrimitives\\Message',
                (block, context) => ({
                    block,
                    context,
                    initialize: () => tslib_1.__awaiter(void 0, void 0, void 0, function* () { return undefined; }),
                    run: () => tslib_1.__awaiter(void 0, void 0, void 0, function* () { return block.exits[0]; }),
                }),
            ],
        ]));
        const { prompt } = yield runner.initializeOneBlock(block, flow.uuid, undefined, undefined);
        expect(prompt).toBeUndefined();
    }));
    it('should return cursor with prompt from runner when prompt provided', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        let expectedPrompt = undefined;
        const ctx = dataset.contexts[0];
        const flow = ctx.flows[0];
        const block = flow.blocks[0];
        const runner = new __1.FlowRunner(ctx, new __1.BlockRunnerFactoryStore([
            [
                'MobilePrimitives\\Message',
                (block, context) => ({
                    block,
                    context,
                    initialize: () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                        return (expectedPrompt = {
                            kind: __1.NUMERIC_PROMPT_KEY,
                            prompt: 'What age are you at?',
                            value: null,
                            isResponseRequired: false,
                            isSubmitted: false,
                            max: 999,
                            min: 999,
                        });
                    }),
                    run: () => tslib_1.__awaiter(void 0, void 0, void 0, function* () { return block.exits[0]; }),
                }),
            ],
        ]));
        const richCursor = yield runner.initializeOneBlock(block, flow.uuid, undefined, undefined);
        const cursor = runner.dehydrateCursor(richCursor);
        expect(cursor.promptConfig).toBe(expectedPrompt);
    }));
    it('should return cursor with interaction for block + flow', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const ctx = dataset.contexts[0];
        const flow = ctx.flows[0];
        const block = flow.blocks[0];
        const runner = new __1.FlowRunner(ctx, new __1.BlockRunnerFactoryStore([
            [
                'MobilePrimitives\\Message',
                (block, context) => ({
                    block,
                    context,
                    initialize: () => tslib_1.__awaiter(void 0, void 0, void 0, function* () { return undefined; }),
                    run: () => tslib_1.__awaiter(void 0, void 0, void 0, function* () { return block.exits[0]; }),
                }),
            ],
        ]));
        const { interaction } = yield runner.initializeOneBlock(block, flow.uuid, undefined, undefined);
        expect(interaction).toEqual(expect.objectContaining({ blockId: block.uuid }));
        expect(interaction).toEqual(expect.objectContaining({ flowId: flow.uuid }));
    }));
});
//# sourceMappingURL=initializeOneBlock.spec.js.map