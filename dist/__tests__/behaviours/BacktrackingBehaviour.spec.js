"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const lodash_1 = require("lodash");
const __1 = require("../..");
describe('BacktrackingBehaviour', () => {
    let backtracking;
    beforeEach(() => {
        backtracking = new __1.BacktrackingBehaviour({ vendor_metadata: {} }, { navigateTo: (_b, _c) => tslib_1.__awaiter(void 0, void 0, void 0, function* () { return ({ interaction: {}, prompt: undefined }); }) }, {
            buildPromptFor: (_b, _i) => tslib_1.__awaiter(void 0, void 0, void 0, function* () { return undefined; }),
        });
    });
    describe('constructor', () => {
        it.todo("should initialize backtracking on context's platform metadata");
    });
    describe('insertInteractionUsing', () => {
        describe('sealing this iteration', () => {
            describe('when block has been repeated since start of an iteration', () => {
                it('should step in (aka perform an iteration rollup)', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                    const interactions = [
                        { block_id: '0', uuid: 'abc-0' },
                        { block_id: '1', uuid: 'abc-1' },
                        { block_id: '2', uuid: 'abc-2' },
                        { block_id: '3', uuid: 'abc-3' },
                    ];
                    const interactionStack = __1.createStack([...interactions]);
                    const cursor = __1.createKey(3);
                    const interaction = { block_id: '1', uuid: 'abc-4' };
                    backtracking.insertInteractionUsing(cursor, interaction, interactionStack);
                    expect(interactionStack).toEqual(__1.createStack([interactions[0], __1._loop(__1.createStack([interactions[1], interactions[2], interactions[3]]), [interaction])]));
                    expect(cursor).toEqual([
                        ['stack', 0, 1],
                        ['stack', 1, 0],
                    ]);
                }));
            });
            describe('when block is at start of iteration', () => {
                it('should roll up entire iteration into a stack', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                    const interactions = [
                        { block_id: '0', uuid: 'abc-0' },
                        { block_id: '1', uuid: 'abc-1' },
                        { block_id: '2', uuid: 'abc-2' },
                        { block_id: '3', uuid: 'abc-3' },
                    ];
                    const interactionStack = __1.createStack([...interactions]);
                    const cursor = __1.createKey(3);
                    const interaction = { block_id: '0', uuid: 'abc-4' };
                    backtracking.insertInteractionUsing(cursor, interaction, interactionStack);
                    expect(interactionStack).toEqual(__1.createStack([__1._loop(__1.createStack([interactions[0], interactions[1], interactions[2], interactions[3]]), [interaction])]));
                    expect(cursor).toEqual([
                        ['stack', 0, 0],
                        ['stack', 1, 0],
                    ]);
                }));
            });
            describe('when block has not been repeated since start of iteration', () => {
                describe('when using fresh key', () => {
                    it('should insert at first position', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                        const interactionStack = __1.createStack();
                        const cursor = __1.createKey();
                        const interaction = { uuid: 'abc-123' };
                        expect(backtracking.insertInteractionUsing(cursor, interaction, interactionStack));
                        expect(interactionStack).toEqual(__1.createStack([interaction]));
                        expect(cursor).toEqual(__1.createKey(0));
                    }));
                });
                describe('when on root stack', () => {
                    it('should insert at current position', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                        const interactions = [
                            { block_id: '0', uuid: 'abc-0' },
                            { block_id: '1', uuid: 'abc-1' },
                            { block_id: '2', uuid: 'abc-2' },
                            { block_id: '3', uuid: 'abc-3' },
                        ];
                        const interactionStack = __1.createStack([...interactions]);
                        const cursor = __1.createKey(3);
                        const interaction = { block_id: '4', uuid: 'abc-4' };
                        backtracking.insertInteractionUsing(cursor, interaction, interactionStack);
                        expect(interactionStack).toEqual(__1.createStack([...interactions, interaction]));
                        expect(cursor).toEqual(__1.createKey(4));
                    }));
                });
                describe('when on nested stack', () => {
                    it('should insert at current position', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                        const sourceInteractions = __1.createStackFrom([
                            [
                                { block_id: '1', uuid: 'abc-1' },
                                __1.createStackFrom([
                                    [
                                        { block_id: '2', uuid: 'abc-2' },
                                        { block_id: '3', uuid: 'abc-3' },
                                        { block_id: '4', uuid: 'abc-4' },
                                    ],
                                    [
                                        { block_id: '2', uuid: 'abc-5' },
                                        __1.createStackFrom([
                                            [{ block_id: '3', uuid: 'abc-6' }, { block_id: '4', uuid: 'abc-7' }],
                                            [
                                                { block_id: '3', uuid: 'abc-8' },
                                                { block_id: '4', uuid: 'abc-9' },
                                                { block_id: '5', uuid: 'abc-10' },
                                            ],
                                        ]),
                                    ],
                                ]),
                            ],
                        ]);
                        const interactionStack = lodash_1.cloneDeep(sourceInteractions);
                        const cursor = [
                            __1.createStackKey(0, 1),
                            __1.createStackKey(1, 1),
                            __1.createStackKey(1, 2),
                        ];
                        const interaction = { block_id: '6', uuid: 'abc-11' };
                        backtracking.insertInteractionUsing(cursor, interaction, interactionStack);
                        const expected = lodash_1.cloneDeep(sourceInteractions);
                        __1._append(interaction, __1.getStackFor(cursor, expected));
                        expect(interactionStack).toEqual(expected);
                        expect(cursor).toEqual([__1.createStackKey(0, 1), __1.createStackKey(1, 1), __1.createStackKey(1, 3)]);
                    }));
                });
            });
            describe("when block matches any stack's first block", () => {
                it('should step out when head found one level up', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                    const sourceInteractions = __1.createStackFrom([
                        [
                            { block_id: '1', uuid: 'abc-1' },
                            __1.createStackFrom([
                                [
                                    { block_id: '2', uuid: 'abc-2' },
                                    { block_id: '3', uuid: 'abc-3' },
                                    { block_id: '4', uuid: 'abc-4' },
                                ],
                                [
                                    { block_id: '2', uuid: 'abc-5' },
                                    __1.createStackFrom([
                                        [{ block_id: '3', uuid: 'abc-6' }, { block_id: '4', uuid: 'abc-7' }],
                                        [
                                            { block_id: '3', uuid: 'abc-8' },
                                            { block_id: '4', uuid: 'abc-9' },
                                            { block_id: '5', uuid: 'abc-10' },
                                        ],
                                    ]),
                                ],
                            ]),
                        ],
                    ]);
                    const interactionStack = lodash_1.cloneDeep(sourceInteractions);
                    const cursor = [
                        __1.createStackKey(0, 1),
                        __1.createStackKey(1, 1),
                        __1.createStackKey(1, 2),
                    ];
                    const interaction = { block_id: '2', uuid: 'abc-11' };
                    backtracking.insertInteractionUsing(cursor, interaction, interactionStack);
                    const expected = lodash_1.cloneDeep(sourceInteractions);
                    __1._loop(__1.getStackFor([__1.createStackKey(0, 1), __1.createStackKey(1, 1)], expected), [interaction]);
                    expect(interactionStack).toEqual(expected);
                    expect(cursor).toEqual([__1.createStackKey(0, 1), __1.createStackKey(2, 0)]);
                }));
                it('should step out multiple times when head found multiple levels up', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                    const sourceInteractions = __1.createStackFrom([
                        [
                            { block_id: '1', uuid: 'abc-1' },
                            __1.createStackFrom([
                                [
                                    { block_id: '2', uuid: 'abc-2' },
                                    { block_id: '3', uuid: 'abc-3' },
                                    { block_id: '4', uuid: 'abc-4' },
                                ],
                                [
                                    { block_id: '2', uuid: 'abc-5' },
                                    __1.createStackFrom([
                                        [{ block_id: '3', uuid: 'abc-6' }, { block_id: '4', uuid: 'abc-7' }],
                                        [
                                            { block_id: '3', uuid: 'abc-8' },
                                            { block_id: '4', uuid: 'abc-9' },
                                            { block_id: '5', uuid: 'abc-10' },
                                        ],
                                    ]),
                                ],
                            ]),
                        ],
                    ]);
                    const interactionStack = lodash_1.cloneDeep(sourceInteractions);
                    const cursor = [
                        __1.createStackKey(0, 1),
                        __1.createStackKey(1, 1),
                        __1.createStackKey(1, 2),
                    ];
                    const interaction = { block_id: '1', uuid: 'abc-11' };
                    backtracking.insertInteractionUsing(cursor, interaction, interactionStack);
                    const expected = lodash_1.cloneDeep(sourceInteractions);
                    __1._loop(expected, [interaction]);
                    expect(interactionStack).toEqual(expected);
                    expect(cursor).toEqual([__1.createStackKey(1, 0)]);
                }));
                it.todo('should step out all the way to root when found in root');
                it.todo('should wipe interactions after current key');
            });
            describe("when stacked, but block doesn't match any heads", () => {
                it.todo("should insert where we're at");
            });
        });
    });
    describe('findIndexOfSuggestionFor', () => {
        it.todo('...');
    });
    describe('jumpTo', () => {
        let interactions;
        let meta;
        beforeEach(() => {
            interactions = [{ uuid: 'abc-123' }, { uuid: 'abc-234', block_id: 'block/abc-234' }, { uuid: 'abc-345' }];
            backtracking.context.interactions = lodash_1.cloneDeep(interactions);
            backtracking.context.first_flow_id = 'flow/abc-123';
            backtracking.context.flows = [{ uuid: 'flow/abc-123', blocks: [{ uuid: 'block/abc-234' }] }];
            backtracking.context.nested_flow_block_interaction_id_stack = [];
            meta = backtracking.context.vendor_metadata.backtracking;
            meta.interactionStack = __1.createStack(lodash_1.cloneDeep(interactions));
        });
        it('should initialize ghost stack as a clone of current stack', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            const expectedGhostStack = __1.createStack(lodash_1.cloneDeep(interactions));
            expect(meta.ghostInteractionStacks).toEqual([]);
            backtracking.jumpTo({ uuid: 'abc-234', block_id: 'block/abc-234' }, backtracking.context);
            expect(meta.ghostInteractionStacks).toEqual([expectedGhostStack]);
            expect(meta.ghostInteractionStacks).not.toBe(meta.interactionStack);
        }));
        it("should set cursor to point in time before the interaction we jump to; this gives space to run the block we're jumping to in place", () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            expect(meta.cursor).toEqual(__1.createKey());
            backtracking.jumpTo({ uuid: 'abc-234', block_id: 'block/abc-234' }, backtracking.context);
            expect(meta.cursor).toEqual(__1.createKey(0));
        }));
        it('should truncate interactions off main context interactions list from jumped to onward', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            expect(backtracking.context.interactions).toEqual(interactions);
            backtracking.jumpTo({ uuid: 'abc-234', block_id: 'block/abc-234' }, backtracking.context);
            expect(backtracking.context.interactions).toEqual(interactions.slice(0, 1));
        }));
        it('should truncate hierarchical stack to match interactions list', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            backtracking.jumpTo({ uuid: 'abc-234', block_id: 'block/abc-234' }, backtracking.context);
            expect(meta.interactionStack).toEqual(__1.createStack(interactions.slice(0, 1)));
        }));
        describe('nested flow reconciliation', () => {
            beforeEach(() => {
                interactions = [
                    { uuid: 'intx-123-1' },
                    { uuid: 'intx-234-1', type: 'Core.RunFlow', block_id: 'block-234', flow_id: 'flow-123' },
                    { uuid: 'intx-567-1', block_id: 'block-567', flow_id: '234' },
                    { uuid: 'intx-678-1' },
                    { uuid: 'intx-789-1', type: 'Core.RunFlow', block_id: 'block-789', flow_id: 'flow-234' },
                    { uuid: 'intx-890-1' },
                    { uuid: 'intx-901-1', block_id: 'block-901', flow_id: 'flow-345' },
                    { uuid: 'intx-012-1' },
                    { uuid: 'intx-345-1' },
                    { uuid: 'intx-456-1' },
                ];
                backtracking.context.flows = [
                    {
                        uuid: 'flow-123',
                        blocks: [
                            { uuid: 'block-123' },
                            { uuid: 'block-234', config: { flow_id: 'flow-234' } },
                            { uuid: 'block-345' },
                            { uuid: 'block-456' },
                        ],
                    },
                    {
                        uuid: 'flow-234',
                        blocks: [{ uuid: 'block-567' }, { uuid: 'block-678' }, { uuid: 'block-789', config: { flow_id: 'flow-345' } }],
                    },
                    {
                        uuid: 'flow-345',
                        blocks: [{ uuid: 'block-890' }, { uuid: 'block-901' }, { uuid: 'block-012' }],
                    },
                ];
                backtracking.context.interactions = lodash_1.cloneDeep(interactions);
                backtracking.context.first_flow_id = 'flow-123';
                backtracking.context.nested_flow_block_interaction_id_stack = ['intx-234-1', 'intx-789-1'];
                meta = backtracking.context.vendor_metadata.backtracking;
                meta.interactionStack = __1.createStack(lodash_1.cloneDeep(interactions));
            });
            it('leave nesting at the same place if not jumping past a nesting', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                expect(backtracking.context.nested_flow_block_interaction_id_stack).toEqual(['intx-234-1', 'intx-789-1']);
                backtracking.jumpTo({ uuid: 'intx-901-1', block_id: 'block-901' }, backtracking.context);
                expect(backtracking.context.nested_flow_block_interaction_id_stack).toEqual(['intx-234-1', 'intx-789-1']);
            }));
            it('should handle peeling off one level of nesting when jumping past one run-flow block interaction', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                expect(backtracking.context.nested_flow_block_interaction_id_stack).toEqual(['intx-234-1', 'intx-789-1']);
                backtracking.jumpTo({ uuid: 'intx-567-1', block_id: 'block-567' }, backtracking.context);
                expect(backtracking.context.nested_flow_block_interaction_id_stack).toEqual(['intx-234-1']);
            }));
            it('should handle peeling off all nesting when jumping to interaction at top level', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                expect(backtracking.context.nested_flow_block_interaction_id_stack).toEqual(['intx-234-1', 'intx-789-1']);
                backtracking.jumpTo({ uuid: 'intx-234-1', block_id: 'block-234' }, backtracking.context);
                expect(backtracking.context.nested_flow_block_interaction_id_stack).toEqual([]);
            }));
        });
    });
    describe('syncGhost', () => {
        it('should at least execute', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            backtracking.syncGhostTo(__1.createKey(), __1.createKey(), __1.createStack());
        }));
        describe('when key for suggestion is ahead by a couple indices', () => {
            it('should yank the items in between', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                const keyForSuggestion = __1.createKey(5);
                const key = __1.createKey(3);
                const ghost = __1.createStack([{ uuid: '1' }, { uuid: '2' }, { uuid: '3' }, { uuid: '8' }, { uuid: '9' }, { uuid: '4' }, { uuid: '5' }]);
                backtracking.syncGhostTo(key, keyForSuggestion, ghost);
                expect(ghost).toEqual(__1.createStack([{ uuid: '1' }, { uuid: '2' }, { uuid: '3' }, { uuid: '4' }, { uuid: '5' }]));
            }));
        });
        describe('when keys match', () => {
            it('should leave keys alone', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                const keyForSuggestion = __1.createKey(3);
                const key = __1.createKey(3);
                const ghost = __1.createStack(['1', '2', '3', '4', '5'].map(uuid => ({ uuid })));
                backtracking.syncGhostTo(key, keyForSuggestion, ghost);
                expect(keyForSuggestion).toEqual(__1.createKey(3));
                expect(key).toEqual(__1.createKey(3));
            }));
            it('should leave ghost stack alone', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                const keyForSuggestion = __1.createKey(3);
                const key = __1.createKey(3);
                const ghost = __1.createStack(['1', '2', '3', '4', '5'].map(uuid => ({ uuid })));
                backtracking.syncGhostTo(key, keyForSuggestion, ghost);
                expect(ghost).toEqual(__1.createStack(['1', '2', '3', '4', '5'].map(uuid => ({ uuid }))));
            }));
        });
        describe('when key for suggestion is nested once + on first iteration', () => {
            it('should hoist nested iteration into containing iteration, and remove items in between key + key for suggestion', () => {
                const keyForSuggestion = [__1.createStackKey(0, 3), __1.createStackKey(0, 1)];
                const key = __1.createKey(3);
                const ghost = __1.createStack([{ uuid: '1' }, { uuid: '2' }, { uuid: '3' }, __1.createStack([{ uuid: '7' }, { uuid: '4' }, { uuid: '5' }])]);
                backtracking.syncGhostTo(key, keyForSuggestion, ghost);
                expect(ghost).toEqual(__1.createStack(['1', '2', '3', '4', '5'].map(uuid => ({ uuid }))));
            });
        });
        describe.skip('when key for suggestion is nested multiple times deeper + on non-first iteration + iterations exist afterwards', () => {
            it(`should remove iterations before iteration having key for suggestion
            + hoist iteration having key for suggestion to match key
            + remove items in between key + key for suggestion
            + leave subsequent iterations intact
            + leave trailing items intact
            `, () => {
                const keyForSuggestion = [__1.createStackKey(0, 3), __1.createStackKey(2, 1), __1.createStackKey(0, 1)];
                const key = __1.createKey(3);
                const ghost = __1.createStack([
                    { uuid: '1' },
                    { uuid: '2' },
                    { uuid: '3' },
                    __1.createStackFrom([
                        [{ uuid: '7' }, { uuid: '8' }],
                        [{ uuid: '7' }, { uuid: '8' }],
                        [
                            { uuid: '7' },
                            __1.createStackFrom([
                                [{ uuid: '8' }, { uuid: '4' }],
                                [{ uuid: '8' }, { uuid: '4' }],
                            ]),
                        ],
                        [{ uuid: '7' }, { uuid: '8' }, { uuid: '4' }, { uuid: '5' }],
                    ]),
                ]);
                backtracking.syncGhostTo(key, keyForSuggestion, ghost);
                expect(ghost).toEqual(__1.createStack([
                    { uuid: '1' },
                    { uuid: '2' },
                    { uuid: '3' },
                    { uuid: '4' },
                    __1.createStackFrom([
                        [__1.createStack([{ uuid: '8' }, { uuid: '4' }])],
                        [{ uuid: '7' }, { uuid: '8' }, { uuid: '4' }, { uuid: '5' }],
                    ]),
                ]));
            });
        });
        it.todo('should update head on ghost when splicing and dicing');
        it.todo('should behave predictably when key to match points to deep nesting');
        it.todo('should behave predictably when key to match points to element in main iteration');
        it.todo('should behave predictably when key to match point to start of everything');
    });
    describe('peek', () => {
        let pseudoPrompt;
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
            pseudoPrompt = {};
            jest.spyOn(backtracking.promptBuilder, 'buildPromptFor').mockReturnValue(Promise.resolve(pseudoPrompt));
        });
        it('should return prompt for last interaction when no args provided', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            const block = backtracking.context.flows[0].blocks[0];
            const interaction = lodash_1.last(backtracking.context.interactions);
            const prompt = yield backtracking.peek();
            expect(backtracking.promptBuilder.buildPromptFor).toHaveBeenCalledWith(block, interaction);
            expect(interaction.value).toBeTruthy();
            expect(prompt).toBe(pseudoPrompt);
            expect(prompt.value).toEqual(interaction.value);
        }));
        it('should use interaction `steps` places from the end of interactions list', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            const block = backtracking.context.flows[0].blocks[0];
            const interaction = backtracking.context.interactions[2];
            const prompt = yield backtracking.peek(4);
            expect(backtracking.promptBuilder.buildPromptFor).toHaveBeenCalledWith(block, interaction);
            expect(interaction.value).toBeTruthy();
            expect(prompt).toBe(pseudoPrompt);
            expect(prompt.value).toEqual(interaction.value);
        }));
        it('should skip over non-interactive blocks', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            backtracking.context.interactions[3].type = lodash_1.first(__1.NON_INTERACTIVE_BLOCK_TYPES);
            backtracking.context.interactions[4].type = lodash_1.first(__1.NON_INTERACTIVE_BLOCK_TYPES);
            const block = backtracking.context.flows[0].blocks[0];
            const interaction = backtracking.context.interactions[2];
            const prompt = yield backtracking.peek(2);
            expect(backtracking.promptBuilder.buildPromptFor).toHaveBeenCalledWith(block, interaction);
            expect(interaction.value).toBeTruthy();
            expect(prompt).toBe(pseudoPrompt);
            expect(prompt.value).toEqual(interaction.value);
        }));
        it('should raise when trying to step back further than can be stepped', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            yield expect(__1.BacktrackingBehaviour.prototype.peek.bind(backtracking)(7)).rejects.toThrow('Unable to backtrack to an interaction that far back {"steps":7}');
        }));
    });
});
//# sourceMappingURL=BacktrackingBehaviour.spec.js.map