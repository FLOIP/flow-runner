"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const lodash_1 = require("lodash");
const IDataset_1 = require("../fixtures/IDataset");
const __1 = require("../..");
const BlockRunner_1 = require("../fixtures/BlockRunner");
describe('FlowRunner/navigateTo', () => {
    let dataset;
    beforeEach(() => {
        dataset = IDataset_1.createDefaultDataset();
    });
    afterEach(() => {
        jest.restoreAllMocks();
    });
    it("should push an additional interaction onto context's interaction stack", () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const ctx = dataset.contexts[0];
        const block = ctx.flows[0].blocks[0];
        const runner = new __1.FlowRunner(ctx, new __1.BlockRunnerFactoryStore([['MobilePrimitives\\Message', BlockRunner_1.createStaticFirstExitBlockRunnerFor]]));
        expect(ctx.interactions).toHaveLength(0);
        yield runner.navigateTo(block, ctx);
        expect(ctx.interactions).toHaveLength(1);
    }));
    describe('simple cursor', () => {
        it('should overwrite on context when prev cursor absent and return same instance', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            const ctx = dataset.contexts[0];
            const block = ctx.flows[0].blocks[0];
            const runner = new __1.FlowRunner(ctx, new __1.BlockRunnerFactoryStore([['MobilePrimitives\\Message', BlockRunner_1.createStaticFirstExitBlockRunnerFor]]));
            expect(ctx.cursor).toBeFalsy();
            const richCursor = yield runner.navigateTo(block, ctx);
            expect(richCursor).toBeTruthy();
            expect(ctx.cursor).toEqual(runner.dehydrateCursor(richCursor));
        }));
        it('should overwrite on context when prev cursor present and return same instance', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            const ctx = dataset.contexts[0];
            const block = ctx.flows[0].blocks[0];
            const runner = new __1.FlowRunner(ctx, new __1.BlockRunnerFactoryStore([['MobilePrimitives\\Message', BlockRunner_1.createStaticFirstExitBlockRunnerFor]]));
            jest.spyOn(runner, 'cacheInteractionByBlockName').mockImplementation(() => { });
            const previousIntxId = 'some-fake-block-interaction-uuid';
            const promptConfig = {
                kind: __1.NUMERIC_PROMPT_KEY,
                prompt: 'What age are you at?',
                value: null,
                isResponseRequired: false,
                isSubmitted: false,
                max: 999,
                min: 999,
            };
            const prevCursor = (ctx.cursor = { interactionId: previousIntxId, promptConfig });
            const richCursor = yield runner.navigateTo(block, ctx);
            const cursor = runner.dehydrateCursor(richCursor);
            expect(cursor).not.toEqual(prevCursor);
            expect(ctx.cursor).toEqual(cursor);
        }));
        it('should have interactionId from newly created+pushed interaction', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            const ctx = dataset.contexts[0];
            const block = ctx.flows[0].blocks[0];
            const runner = new __1.FlowRunner(ctx, new __1.BlockRunnerFactoryStore([['MobilePrimitives\\Message', BlockRunner_1.createStaticFirstExitBlockRunnerFor]]));
            const { interaction } = yield runner.navigateTo(block, ctx);
            expect(interaction).toBe(lodash_1.last(ctx.interactions));
        }));
        it('should have prompt from runner when provided', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            const ctx = dataset.contexts[0];
            const block = ctx.flows[0].blocks[0];
            const messageBlockRunner = BlockRunner_1.createStaticFirstExitBlockRunnerFor(block, ctx);
            const runner = new __1.FlowRunner(ctx, new __1.BlockRunnerFactoryStore([['MobilePrimitives\\Message', () => messageBlockRunner]]));
            const startSpy = jest.spyOn(messageBlockRunner, 'initialize').mockImplementation(() => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                return ({
                    kind: __1.NUMERIC_PROMPT_KEY,
                    prompt: 'What age are you at?',
                    value: null,
                    isResponseRequired: false,
                    isSubmitted: false,
                    max: 999,
                    min: 999,
                });
            }));
            const richCursor = yield runner.navigateTo(block, ctx);
            const cursor = runner.dehydrateCursor(richCursor);
            const expectedPrompt = startSpy.mock.results[0].value;
            expect(cursor.promptConfig).toBe(yield expectedPrompt);
        }));
        it('should have null prompt from runner when null provided', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            const ctx = dataset.contexts[0];
            const block = ctx.flows[0].blocks[0];
            const runner = new __1.FlowRunner(ctx, new __1.BlockRunnerFactoryStore([['MobilePrimitives\\Message', BlockRunner_1.createStaticFirstExitBlockRunnerFor]]));
            const { prompt } = yield runner.navigateTo(block, ctx);
            expect(prompt).toBeUndefined();
        }));
    });
    describe('interaction', () => {
        it('should have block provided', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            const ctx = dataset.contexts[0];
            const block = ctx.flows[0].blocks[0];
            const runner = new __1.FlowRunner(ctx, new __1.BlockRunnerFactoryStore([['MobilePrimitives\\Message', BlockRunner_1.createStaticFirstExitBlockRunnerFor]]));
            expect(ctx.nestedFlowBlockInteractionIdStack).toHaveLength(0);
            yield runner.navigateTo(block, ctx);
            expect(ctx.interactions[0].blockId).toBe(block.uuid);
        }));
        describe('flowId', () => {
            it('should be from root flow when not nested', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                const ctx = dataset.contexts[0];
                const block = ctx.flows[0].blocks[0];
                const runner = new __1.FlowRunner(ctx, new __1.BlockRunnerFactoryStore([['MobilePrimitives\\Message', BlockRunner_1.createStaticFirstExitBlockRunnerFor]]));
                expect(ctx.nestedFlowBlockInteractionIdStack).toHaveLength(0);
                expect(ctx.firstFlowId).toBeTruthy();
                yield runner.navigateTo(block, ctx);
                expect(ctx.interactions[0].flowId).toBe(ctx.firstFlowId);
            }));
            it('should be from nested flow when nested once', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                const ctx = dataset.contexts[2];
                const block = ctx.flows[1].blocks[0];
                const runner = new __1.FlowRunner(ctx, new __1.BlockRunnerFactoryStore([['MobilePrimitives\\Message', BlockRunner_1.createStaticFirstExitBlockRunnerFor]]));
                jest.spyOn(runner, 'cacheInteractionByBlockName').mockImplementation(() => { });
                expect(ctx.nestedFlowBlockInteractionIdStack).toHaveLength(1);
                expect(__1.findInteractionWith(lodash_1.last(ctx.nestedFlowBlockInteractionIdStack), ctx).flowId).toBe(ctx.flows[0].uuid);
                yield runner.navigateTo(block, ctx);
                expect(ctx.interactions[1].flowId).toBe(ctx.flows[1].uuid);
            }));
            it.todo('should be from deepest nested flow when deeply nested');
        });
        describe('originFlowId', () => {
            it('should be absent when on root flow', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                const ctx = dataset.contexts[0];
                const block = ctx.flows[0].blocks[0];
                const runner = new __1.FlowRunner(ctx, new __1.BlockRunnerFactoryStore([['MobilePrimitives\\Message', BlockRunner_1.createStaticFirstExitBlockRunnerFor]]));
                expect(ctx.nestedFlowBlockInteractionIdStack).toHaveLength(0);
                expect(ctx.interactions).toHaveLength(0);
                yield runner.navigateTo(block, ctx);
                expect(ctx.interactions[0].originFlowId).toBeUndefined();
            }));
            it('should be from root flow when nested once', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                const ctx = dataset.contexts[2];
                const block = ctx.flows[1].blocks[0];
                const runner = new __1.FlowRunner(ctx, new __1.BlockRunnerFactoryStore([['MobilePrimitives\\Message', BlockRunner_1.createStaticFirstExitBlockRunnerFor]]));
                jest.spyOn(runner, 'cacheInteractionByBlockName').mockImplementation(() => { });
                expect(ctx.nestedFlowBlockInteractionIdStack).toHaveLength(1);
                expect(__1.findInteractionWith(lodash_1.last(ctx.nestedFlowBlockInteractionIdStack), ctx).flowId).toBe(ctx.flows[0].uuid);
                yield runner.navigateTo(block, ctx);
                expect(ctx.interactions[1].originFlowId).toBe(ctx.flows[0].uuid);
            }));
            it.todo('should be from deepest nested flow when deeply nested');
        });
        describe('originInteractionId', () => {
            it('should be absent when on root flow', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                const ctx = dataset.contexts[0];
                const block = ctx.flows[0].blocks[0];
                const runner = new __1.FlowRunner(ctx, new __1.BlockRunnerFactoryStore([['MobilePrimitives\\Message', BlockRunner_1.createStaticFirstExitBlockRunnerFor]]));
                expect(ctx.nestedFlowBlockInteractionIdStack).toHaveLength(0);
                expect(ctx.interactions).toHaveLength(0);
                yield runner.navigateTo(block, ctx);
                expect(ctx.interactions[0].originBlockInteractionId).toBeUndefined();
            }));
            it("should be from root flow's interaction when nested once", () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                const ctx = dataset.contexts[2];
                const block = ctx.flows[1].blocks[0];
                const runner = new __1.FlowRunner(ctx, new __1.BlockRunnerFactoryStore([['MobilePrimitives\\Message', BlockRunner_1.createStaticFirstExitBlockRunnerFor]]));
                jest.spyOn(runner, 'cacheInteractionByBlockName').mockImplementation(() => { });
                expect(ctx.nestedFlowBlockInteractionIdStack).toHaveLength(1);
                expect(__1.findInteractionWith(lodash_1.last(ctx.nestedFlowBlockInteractionIdStack), ctx).flowId).toBe(ctx.flows[0].uuid);
                yield runner.navigateTo(block, ctx);
                expect(ctx.interactions[1].originBlockInteractionId).toBe(ctx.interactions[0].uuid);
            }));
            it.todo("should be from deepest nested flow's interaction when deeply nested");
        });
    });
});
//# sourceMappingURL=navigateTo.spec.js.map