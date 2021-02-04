"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const lodash_1 = require("lodash");
const __1 = require("../..");
describe('BasicBacktrackingBehaviour', () => {
    let backtracking;
    beforeEach(() => {
        backtracking = new __1.BasicBacktrackingBehaviour({ vendor_metadata: {} }, { navigateTo: (_b, _c) => tslib_1.__awaiter(void 0, void 0, void 0, function* () { return ({ interaction: {}, prompt: undefined }); }) }, {
            buildPromptFor: (_b, _i) => tslib_1.__awaiter(void 0, void 0, void 0, function* () { return undefined; }),
        });
    });
    describe('peek', () => {
        let virtualPrompt;
        beforeEach(() => {
            backtracking.context = {
                interactions: [
                    { uuid: 'intx-123' },
                    { uuid: 'intx-234' },
                    { uuid: 'intx-345', flow_id: 'flow-123', block_id: 'block-123', value: 'value #345' },
                    { uuid: 'intx-456' },
                    { uuid: 'intx-567' },
                    { uuid: 'intx-678', flow_id: 'flow-123', block_id: 'block-123', value: 'value #678' },
                ],
                flows: [{ uuid: 'flow-123', blocks: [{ uuid: 'block-123' }] }],
            };
            virtualPrompt = {};
            jest.spyOn(backtracking.promptBuilder, 'buildPromptFor').mockReturnValue(Promise.resolve(virtualPrompt));
        });
        it('should return prompt for last interaction when no args provided', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            const block = backtracking.context.flows[0].blocks[0];
            const interaction = lodash_1.last(backtracking.context.interactions);
            const cursor = yield backtracking.peek();
            expect(backtracking.promptBuilder.buildPromptFor).toHaveBeenCalledWith(block, interaction);
            expect(interaction.value).toBeTruthy();
            expect(cursor.prompt).toBe(virtualPrompt);
            expect(cursor.prompt.value).toEqual(interaction.value);
        }));
        it('should return prompt for first interaction when default args provided and `fromLeft` is truthy', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            const firstInteraction = backtracking.context.interactions[0];
            backtracking.context.interactions[0] = backtracking.context.interactions[5];
            backtracking.context.interactions[5] = firstInteraction;
            const block = backtracking.context.flows[0].blocks[0];
            const interaction = lodash_1.first(backtracking.context.interactions);
            const cursor = yield backtracking.peek(0, backtracking.context, __1.PeekDirection.RIGHT);
            expect(backtracking.promptBuilder.buildPromptFor).toHaveBeenCalledWith(block, interaction);
            expect(interaction.value).toBeTruthy();
            expect(cursor.prompt).toBe(virtualPrompt);
            expect(cursor.prompt.value).toEqual(interaction.value);
        }));
        it('should use interaction `steps` places from the end of interactions list', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            const block = backtracking.context.flows[0].blocks[0];
            const interaction = backtracking.context.interactions[2];
            const cursor = yield backtracking.peek(3);
            expect(backtracking.promptBuilder.buildPromptFor).toHaveBeenCalledWith(block, interaction);
            expect(interaction.value).toBeTruthy();
            expect(cursor.prompt).toBe(virtualPrompt);
            expect(cursor.prompt.value).toEqual(interaction.value);
        }));
        it('should skip over non-interactive blocks', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            backtracking.context.interactions[3].type = lodash_1.first(__1.NON_INTERACTIVE_BLOCK_TYPES);
            backtracking.context.interactions[4].type = lodash_1.first(__1.NON_INTERACTIVE_BLOCK_TYPES);
            const block = backtracking.context.flows[0].blocks[0];
            const interaction = backtracking.context.interactions[2];
            const cursor = yield backtracking.peek(1);
            expect(backtracking.promptBuilder.buildPromptFor).toHaveBeenCalledWith(block, interaction);
            expect(interaction.value).toBeTruthy();
            expect(cursor.prompt).toBe(virtualPrompt);
            expect(cursor.prompt.value).toEqual(interaction.value);
        }));
        it('should raise when trying to step back further than can be stepped', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            yield expect(__1.BacktrackingBehaviour.prototype.peek.bind(backtracking)(7)).rejects.toThrow('Unable to backtrack to an interaction that far back {"steps":7}');
        }));
    });
});
//# sourceMappingURL=BasicBacktrackingBehaviour.spec.js.map