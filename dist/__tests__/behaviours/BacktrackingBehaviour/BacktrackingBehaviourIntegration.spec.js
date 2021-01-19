"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const lodash_1 = require("lodash");
const __1 = require("../../..");
describe.skip('FlowRunner integration', () => {
    let flow;
    beforeEach(() => {
        flow = require('../../fixtures/2019-10-10-shortcut-flow.json');
    });
    it('should work when simple + single backtrack', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const context = __1.createContextDataObjectFor({ id: '1' }, 'user-1234', 'org-1234', [flow], 'en_US', __1.SupportedMode.OFFLINE);
        const runner = new __1.FlowRunner(context);
        let { prompt } = (yield runner.run());
        prompt.value = prompt.config.choices[0].key;
        prompt = (yield runner.run()).prompt;
        prompt.value = 17;
        prompt = (yield runner.run()).prompt;
        prompt.value = prompt.config.choices[0].key;
        prompt = (yield runner.run()).prompt;
        prompt.value = 12;
        prompt = (yield runner.run()).prompt;
        prompt.value = 'Ella';
        prompt = (yield runner.run()).prompt;
        prompt.value = prompt.config.choices[1].key;
        const backtracking = runner.behaviours.backtracking;
        prompt = yield backtracking.peek(5);
        const interactionPreviouslyAtPeek5 = __1.findInteractionWith(prompt.interactionId, context);
        expect(prompt.interactionId).toBe(context.interactions.slice(-6, -5)[0].uuid);
        prompt = (yield backtracking.jumpTo(__1.findInteractionWith(prompt.interactionId, context), context)).prompt;
        const interactionAtPeek1 = __1.findInteractionWith(prompt.interactionId, context);
        expect(interactionAtPeek1).toEqual(lodash_1.last(context.interactions));
        expect(interactionAtPeek1).not.toEqual(interactionPreviouslyAtPeek5);
        expect(prompt.value).toEqual(interactionPreviouslyAtPeek5.value);
        prompt = (yield prompt.fulfill(17)).prompt;
        expect(prompt.value).toEqual(12);
    }));
});
//# sourceMappingURL=BacktrackingBehaviourIntegration.spec.js.map