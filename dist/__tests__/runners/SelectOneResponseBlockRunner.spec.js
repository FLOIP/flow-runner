"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const __1 = require("../..");
const IDataset_1 = require("../fixtures/IDataset");
describe('SelectOneResponseBlockRunner', () => {
    let dataset;
    beforeEach(() => {
        dataset = IDataset_1.createDefaultDataset();
    });
    describe('run', () => {
        it('sanity // should return an exit when some exist', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            const ctx = dataset.contexts[1];
            ctx.contact.age = '12';
            const interaction = __1.findInteractionWith(ctx.cursor.interactionId, ctx);
            const block = Object.assign(__1.findBlockOnActiveFlowWith(interaction.block_id, ctx), {
                exits: [
                    { test: '@(contact.age > 73)' },
                    { test: '@(contact.age > 50)' },
                    { test: '@(contact.age > 25)' },
                    { test: '@(contact.age > 8)' },
                    { test: '@(contact.age > 0)' },
                ],
            });
            const runner = new __1.SelectOneResponseBlockRunner(block, ctx);
            const exit = yield runner.run();
            expect(exit).toBe(block.exits[3]);
        }));
        it.todo("should raise an exception when an expression is provided that doesn't evaluate to bool.");
    });
});
//# sourceMappingURL=SelectOneResponseBlockRunner.spec.js.map