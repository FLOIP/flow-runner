"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const IDataset_1 = require("../fixtures/IDataset");
const __1 = require("../..");
describe('FlowRunner/stepInto', () => {
    let dataset;
    beforeEach(() => {
        dataset = IDataset_1.createDefaultDataset();
    });
    it('should raise when block type is not RunFlow', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const ctx = dataset.contexts[0];
        const block = ctx.flows[0].blocks[0];
        const runner = new __1.FlowRunner(ctx);
        expect(__1.FlowRunner.prototype.stepInto.bind(runner, block, ctx)).toThrow(__1.ValidationException);
        expect(__1.FlowRunner.prototype.stepInto.bind(runner, block, ctx)).toThrow('non-Core\\RunFlow');
    }));
    it("should raise when last interaction doesn't match provided blockId (aka only allow step ins during active interaction)", () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const ctx = dataset.contexts[2];
        const block = dataset._blocks[5];
        const runner = new __1.FlowRunner(ctx);
        expect(__1.FlowRunner.prototype.stepInto.bind(runner, block, ctx)).toThrow(__1.ValidationException);
        expect(__1.FlowRunner.prototype.stepInto.bind(runner, block, ctx)).toThrow("doesn't match last interaction");
    }));
    it('should raise when interactions empty', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const ctx = dataset.contexts[2];
        const block = ctx.flows[0].blocks[0];
        const runner = new __1.FlowRunner(ctx);
        ctx.interactions = [];
        expect(__1.FlowRunner.prototype.stepInto.bind(runner, block, ctx)).toThrow(__1.ValidationException);
        expect(__1.FlowRunner.prototype.stepInto.bind(runner, block, ctx)).toThrow("hasn't yet been started");
    }));
    it('should push run flow interaction onto nested flow block intx stack', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const ctx = dataset.contexts[2];
        const block = ctx.flows[0].blocks[0];
        const runFlowBlockIntx = ctx.interactions[0];
        const runner = new __1.FlowRunner(ctx);
        ctx.nested_flow_block_interaction_id_stack = [];
        runner.stepInto(block, ctx);
        expect(ctx.nested_flow_block_interaction_id_stack).toHaveLength(1);
        expect(ctx.nested_flow_block_interaction_id_stack[0]).toBe(runFlowBlockIntx.uuid);
    }));
    describe('returned block', () => {
        it.todo('should return null when first block absent on freshly nested flow');
        it.todo('should return first block when first block present on freshly nested flow');
    });
    it("should leave run flow interaction's selected exit and exitAt empty until we've exited last block in the flow", () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const ctx = dataset.contexts[2];
        const block = ctx.flows[0].blocks[0];
        const runFlowBlockIntx = ctx.interactions[0];
        const runner = new __1.FlowRunner(ctx);
        delete runFlowBlockIntx.selectedExitId;
        runner.stepInto(block, ctx);
        expect(runFlowBlockIntx.selectedExitId).toBeUndefined();
    }));
});
//# sourceMappingURL=stepInto.spec.js.map