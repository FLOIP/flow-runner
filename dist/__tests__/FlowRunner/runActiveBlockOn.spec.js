"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const IDataset_1 = require("../fixtures/IDataset");
const __1 = require("../..");
const BlockRunner_1 = require("../fixtures/BlockRunner");
describe('FlowRunner/runActiveBlockOn', () => {
    let dataset;
    beforeEach(() => {
        dataset = IDataset_1.createDefaultDataset();
    });
    afterEach(() => {
        jest.restoreAllMocks();
    });
    it("should return exit provided by block runner's resume()", () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const ctx = dataset.contexts[1];
        const block = ctx.flows[1].blocks[0];
        const expectedExit = block.exits[0];
        const runner = new __1.FlowRunner(ctx, new __1.BlockRunnerFactoryStore([['MobilePrimitives.Message', BlockRunner_1.createStaticFirstExitBlockRunnerFor]]));
        const richCursor = runner.hydrateRichCursorFrom(ctx);
        const exit = yield runner.runActiveBlockOn(richCursor, block);
        expect(exit).toBe(expectedExit);
    }));
    it('should set interaction selected exit id', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const ctx = dataset.contexts[1];
        const block = ctx.flows[1].blocks[0];
        const expectedExit = block.exits[0];
        const runner = new __1.FlowRunner(ctx, new __1.BlockRunnerFactoryStore([['MobilePrimitives.Message', BlockRunner_1.createStaticFirstExitBlockRunnerFor]]));
        const richCursor = runner.hydrateRichCursorFrom(ctx);
        delete richCursor.interaction.selected_exit_id;
        yield runner.runActiveBlockOn(richCursor, block);
        expect(richCursor.interaction.selected_exit_id).toBe(expectedExit.uuid);
    }));
    it('should complete interaction with selected exit', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const ctx = dataset.contexts[1];
        const block = ctx.flows[1].blocks[0];
        const expectedExit = block.exits[0];
        const runner = new __1.FlowRunner(ctx, new __1.BlockRunnerFactoryStore([['MobilePrimitives.Message', BlockRunner_1.createStaticFirstExitBlockRunnerFor]]));
        const richCursor = runner.hydrateRichCursorFrom(ctx);
        jest.spyOn(runner, 'completeInteraction').mockImplementation(() => richCursor.interaction);
        yield runner.runActiveBlockOn(richCursor, block);
        expect(runner.completeInteraction).toHaveBeenCalledTimes(1);
        expect(runner.completeInteraction).toHaveBeenCalledWith(richCursor.interaction, expectedExit.uuid);
    }));
    it('should raise when interaction has previously been flagged as processed', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const ctx = dataset.contexts[1];
        const block = ctx.flows[1].blocks[0];
        const runner = new __1.FlowRunner(ctx, new __1.BlockRunnerFactoryStore([['MobilePrimitives.Message', BlockRunner_1.createStaticFirstExitBlockRunnerFor]]));
        const richCursor = runner.hydrateRichCursorFrom(ctx);
        richCursor.prompt.config.isSubmitted = true;
        try {
            yield runner.runActiveBlockOn(richCursor, block);
        }
        catch (e) {
            expect(e.toString()).toEqual('Error: Unable to run against previously processed prompt');
        }
    }));
    describe('when prompt present', () => {
        it('should flag on prompt as having been submitted + accepted by the flow runner', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            const ctx = dataset.contexts[1];
            const block = ctx.flows[1].blocks[0];
            const runner = new __1.FlowRunner(ctx, new __1.BlockRunnerFactoryStore([['MobilePrimitives.Message', BlockRunner_1.createStaticFirstExitBlockRunnerFor]]));
            expect(ctx.cursor.promptConfig.isSubmitted).toBeFalsy();
            yield runner.runActiveBlockOn(runner.hydrateRichCursorFrom(ctx), block);
            expect(ctx.cursor.promptConfig.isSubmitted).toBeTruthy();
        }));
        it('should set interaction value from prompt', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            const ctx = dataset.contexts[1];
            const block = ctx.flows[1].blocks[0];
            const runner = new __1.FlowRunner(ctx, new __1.BlockRunnerFactoryStore([['MobilePrimitives.Message', BlockRunner_1.createStaticFirstExitBlockRunnerFor]]));
            const richCursor = runner.hydrateRichCursorFrom(ctx);
            delete richCursor.interaction.value;
            yield runner.runActiveBlockOn(richCursor, block);
            expect(richCursor.interaction.value).toBeNull();
        }));
        describe('when prompt has non-null value', () => {
            it('should set interaction hasResponse to true', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                const ctx = dataset.contexts[3];
                const block = ctx.flows[0].blocks[0];
                const runner = new __1.FlowRunner(ctx, new __1.BlockRunnerFactoryStore([
                    ['MobilePrimitives.OpenResponse', (block, ctx) => new __1.OpenResponseBlockRunner(block, ctx)],
                ]));
                const richCursor = runner.hydrateRichCursorFrom(ctx);
                expect(richCursor.interaction.has_response).toBeFalsy();
                yield runner.runActiveBlockOn(richCursor, block);
                expect(richCursor.interaction.has_response).toBeTruthy();
            }));
        });
        describe('when prompt has null value', () => {
            it('should set interaction hasResponse to false', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                const ctx = dataset.contexts[1];
                const block = ctx.flows[1].blocks[0];
                const runner = new __1.FlowRunner(ctx, new __1.BlockRunnerFactoryStore([['MobilePrimitives.Message', BlockRunner_1.createStaticFirstExitBlockRunnerFor]]));
                const richCursor = runner.hydrateRichCursorFrom(ctx);
                expect(richCursor.interaction.has_response).toBeFalsy();
                yield runner.runActiveBlockOn(richCursor, block);
                expect(richCursor.interaction.has_response).toBeFalsy();
            }));
        });
    });
});
//# sourceMappingURL=runActiveBlockOn.spec.js.map