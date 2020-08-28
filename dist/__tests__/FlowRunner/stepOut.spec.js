"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const IDataset_1 = require("../fixtures/IDataset");
const __1 = require("../..");
const lodash_1 = require("lodash");
describe('FlowRunner/stepOut', () => {
    let dataset;
    beforeEach(() => {
        dataset = IDataset_1.createDefaultDataset();
    });
    describe('when not nested', () => {
        it('should raise when attempting to unnest', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            const ctx = dataset.contexts[0];
            const runner = new __1.FlowRunner(ctx);
            expect(ctx.nestedFlowBlockInteractionIdStack).toHaveLength(0);
            expect(__1.FlowRunner.prototype.stepOut.bind(runner, ctx)).toThrow('Unable to complete a nested flow when not nested.');
        }));
        it('should leave last interaction as it is', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            const ctx = dataset.contexts[1];
            const lastIntx = lodash_1.cloneDeep(lodash_1.last(ctx.interactions));
            const runner = new __1.FlowRunner(ctx);
            expect(ctx.nestedFlowBlockInteractionIdStack).toHaveLength(0);
            try {
                runner.stepOut(ctx);
            }
            catch (e) {
            }
            expect(lodash_1.last(ctx.interactions)).toEqual(lastIntx);
        }));
    });
    describe('when nested', () => {
        it("should raise when attempting to unnest and unable to find interaction we're nested under", () => {
            const runner = new __1.FlowRunner({});
            const ctx = {
                nestedFlowBlockInteractionIdStack: ['non-existant-interactionId'],
                interactions: [],
            };
            expect(__1.FlowRunner.prototype.stepOut.bind(runner, ctx)).toThrow('Unable to find interaction on context: non-existant-interactionId in []');
        });
        it('should unnest (aka: pop last interaction off nested flow interaction stack)', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            const ctx = dataset.contexts[2];
            const snapshottedNFBIStack = lodash_1.cloneDeep(ctx.nestedFlowBlockInteractionIdStack);
            const runner = new __1.FlowRunner(ctx);
            expect(ctx.nestedFlowBlockInteractionIdStack.length).toBeGreaterThan(0);
            runner.stepOut(ctx);
            expect(ctx.nestedFlowBlockInteractionIdStack).toEqual(snapshottedNFBIStack.slice(0, -1));
        }));
        it("should leave active interaction's selected exit as null to indicate we've finished executing the flow", () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            const ctx = dataset.contexts[2];
            ctx.interactions.push(dataset._block_interactions.find(({ uuid }) => uuid === '1c7317fc-b644-4da4-b1ff-1807ce55c17e'));
            const activeIntx = lodash_1.last(ctx.interactions);
            const runner = new __1.FlowRunner(ctx);
            expect(ctx.nestedFlowBlockInteractionIdStack.length).toBeGreaterThan(0);
            delete activeIntx.selectedExitId;
            runner.stepOut(ctx);
            expect(activeIntx.selectedExitId).toBeUndefined();
        }));
        it("should tie run flow block's intx associated with provided run flow block to its first exit", () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            const originFlowId = 'flow-123';
            const originBlockInteractionId = 'intx-345';
            const runFlowBlock = {
                uuid: 'block-123',
                exits: [{ uuid: 'exit-123', destinationBlock: 'block-234' }],
            };
            const runFlowBlockIntx = {
                uuid: originBlockInteractionId,
                blockId: 'block-123',
            };
            const interactions = [
                { uuid: 'intx-123' },
                { uuid: 'intx-234' },
                runFlowBlockIntx,
                { uuid: 'intx-456', originFlowId, originBlockInteractionId },
                { uuid: 'intx-567', originFlowId, originBlockInteractionId },
            ];
            const runner = new __1.FlowRunner({});
            runner._contextService = Object.assign({}, __1.ContextService, {
                findBlockOnActiveFlowWith(_uuid, ctx) {
                    return ctx.flows[0].blocks.find(({ uuid }) => _uuid === uuid);
                },
            });
            runner.stepOut({
                flows: [
                    {
                        uuid: originFlowId,
                        blocks: [runFlowBlock, { uuid: 'block-234' }],
                    },
                ],
                interactions,
                firstFlowId: originFlowId,
                nestedFlowBlockInteractionIdStack: [originBlockInteractionId],
            });
            expect(runFlowBlockIntx.selectedExitId).toBe(runFlowBlock.exits[0].uuid);
        }));
        describe('connecting block', () => {
            it('should return block last RunFlow was connected to in original flow', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                const ctx = dataset.contexts[2];
                const lastRunFlowBlock = ctx.flows[0].blocks[0];
                const runFlowDestinationBlock = ctx.flows[0].blocks[1];
                const runner = new __1.FlowRunner(ctx);
                expect(ctx.nestedFlowBlockInteractionIdStack.length).toBeGreaterThan(0);
                expect(lastRunFlowBlock.exits[0].destinationBlock).toBe(runFlowDestinationBlock.uuid);
                const nextBlock = runner.stepOut(ctx);
                expect(nextBlock).toBe(runFlowDestinationBlock);
            }));
            it('should return null if last RunFlow was end of original flow', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                const ctx = dataset.contexts[2];
                const lastRunFlowBlock = ctx.flows[0].blocks[0];
                const runner = new __1.FlowRunner(ctx);
                delete lastRunFlowBlock.exits[0].destinationBlock;
                expect(ctx.nestedFlowBlockInteractionIdStack.length).toBeGreaterThan(0);
                expect(lastRunFlowBlock.exits[0].destinationBlock).toBeUndefined();
                const nextBlock = runner.stepOut(ctx);
                expect(nextBlock).toBeUndefined();
            }));
        });
    });
});
//# sourceMappingURL=stepOut.spec.js.map