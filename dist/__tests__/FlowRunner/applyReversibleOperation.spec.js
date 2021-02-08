"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const __1 = require("../..");
describe('applyReversibleDataOperation', () => {
    let runner;
    let context;
    let operation;
    beforeEach(() => {
        context = {
            interactions: [],
            session_vars: {},
            reversible_operations: [],
        };
        runner = new __1.FlowRunner(context);
        operation = {
            forward: { $set: { 'sampleKey.sampleNestedKey': 'sample forward val' } },
            reverse: { $set: { 'sampleKey.sampleNestedKey': 'sample reverse val' } },
        };
    });
    it('should store the transaction on context', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        expect(context.reversible_operations).toHaveLength(0);
        runner.applyReversibleDataOperation(operation.forward, operation.reverse, context);
        expect(context).toHaveProperty('reversible_operations.0.forward', operation.forward);
        expect(context).toHaveProperty('reversible_operations.0.reverse', operation.reverse);
    }));
    it('should populate a interactionId that this operation was executed as a part of', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        context.interactions.push({ uuid: 'intx-123' });
        expect(context.reversible_operations).toHaveLength(0);
        runner.applyReversibleDataOperation(operation.forward, operation.reverse, context);
        expect(context).toHaveProperty('reversible_operations.0.interactionId', 'intx-123');
    }));
    it('should apply the forward operation', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        expect(context.session_vars).not.toHaveProperty('sampleKey.sampleNestedKey');
        runner.applyReversibleDataOperation(operation.forward, operation.reverse, context);
        expect(context.session_vars).toHaveProperty('sampleKey.sampleNestedKey', 'sample forward val');
    }));
    it('should not apply the reversal operation', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        expect(context.session_vars).not.toHaveProperty('sampleKey.sampleNestedKey');
        runner.applyReversibleDataOperation(operation.forward, operation.reverse, context);
        expect(context.session_vars).not.toHaveProperty('sampleKey.sampleNestedKey', 'sample reverse val');
    }));
});
//# sourceMappingURL=applyReversibleOperation.spec.js.map