"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const lodash_1 = require("lodash");
const __1 = require("../..");
const IDataset_1 = require("../fixtures/IDataset");
const IBlock_1 = require("../../flow-spec/IBlock");
const Contact_1 = tslib_1.__importDefault(require("../../flow-spec/Contact"));
describe('IBlock', () => {
    let dataset;
    let target;
    let dummyContext;
    beforeEach(() => {
        dataset = IDataset_1.createDefaultDataset();
        target = {
            __interactionId: 'abc-123',
            __value__: 'my first value',
            time: __1.createFormattedDate(),
            value: 'my first value',
            text: 'my text',
        };
        dummyContext = { contact: {} };
    });
    describe('findFirstTruthyEvaluatingBlockExitOn', () => {
        it('should return first truthy exit', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            const exit = __1.findFirstTruthyEvaluatingBlockExitOn({
                exits: [
                    { test: '@(true = false)' },
                    { test: '@(true = false)' },
                    { test: '@(true = true)' },
                    { test: '@(true = false)' },
                    { test: '@(true = false)' },
                ],
            }, dummyContext);
            expect(exit).toEqual({ test: '@(true = true)' });
        }));
        it('should not return first _non-default_ truthy exit', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            const exit = __1.findFirstTruthyEvaluatingBlockExitOn({
                exits: [
                    { test: '@(true = false)' },
                    { test: '@(true = false)' },
                    { test: '@(true = true)', default: true },
                    { test: '@(true = true)' },
                    { test: '@(true = false)' },
                    { test: '@(true = false)' },
                ],
            }, dummyContext);
            expect(exit).toEqual({ test: '@(true = true)' });
        }));
    });
    describe('generateCachedProxyForBlockName', () => {
        it('should return an object resembling the one provided', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            const proxy = __1.generateCachedProxyForBlockName(target, dummyContext);
            expect(proxy).toEqual(target);
        }));
        describe('proxy', () => {
            it('should pass through props that already existed on target', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                const sampleTarget = { name: 'Bert', age: '40-something' };
                const proxy = __1.generateCachedProxyForBlockName(sampleTarget, {});
                expect(proxy.name).toEqual(sampleTarget.name);
                expect(proxy.age).toEqual(sampleTarget.age);
            }));
            it('should return undefined when unable to find property on target', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                const sampleTarget = { name: 'Bert', age: '40-something' };
                const proxy = __1.generateCachedProxyForBlockName(sampleTarget, {});
                expect(proxy.unknown).toBeUndefined();
            }));
            it('should perform search over interactions for block whose name matches prop name when prop absent from target', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                const ctx = dataset.contexts[1];
                const name = '1570221906056_83';
                lodash_1.set(ctx.session_vars, `blockInteractionsByBlockName.${name}`, {
                    __interactionId: '09894745-38ba-456f-aab4-720b7d09d5b3',
                    time: '2023-10-10T23:23:23.023Z',
                    text: 'some text',
                });
                const proxy = __1.generateCachedProxyForBlockName({}, ctx);
                const blockForEvalContext = proxy['1570221906056_83'];
                expect(blockForEvalContext.__interactionId).toEqual('09894745-38ba-456f-aab4-720b7d09d5b3');
                expect(blockForEvalContext.__value__).toEqual('Test value');
                expect(blockForEvalContext.time).toEqual('2023-10-10T23:23:23.023Z');
            }));
            it('should perform search over interactions from right-to-left to provide most recent interaction value', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                const ctx = dataset.contexts[1];
                const expectedInteractionId = ctx.interactions[0].uuid;
                ctx.interactions = [Object.assign(lodash_1.cloneDeep(ctx.interactions[0]), { value: 'Incorrect value' }), ctx.interactions[0]];
                lodash_1.set(ctx, 'sessionVars.blockInteractionsByBlockName.1570221906056_83', { __interactionId: expectedInteractionId });
                const proxy = __1.generateCachedProxyForBlockName({}, ctx);
                const blockForEvalContext = proxy['1570221906056_83'];
                expect(blockForEvalContext).toBeTruthy();
                expect(blockForEvalContext.__interactionId).toEqual('09894745-38ba-456f-aab4-720b7d09d5b3');
                expect(blockForEvalContext.__value__).toEqual('Test value');
            }));
            it('should return latest value from interactions upon each invocation', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                const ctx = dataset.contexts[1];
                const expectedInteractionId = ctx.interactions[0].uuid;
                lodash_1.set(ctx, 'sessionVars.blockInteractionsByBlockName.1570221906056_83', { __interactionId: expectedInteractionId });
                const proxy = __1.generateCachedProxyForBlockName({}, ctx);
                let blockForEvalContext = proxy['1570221906056_83'];
                expect(blockForEvalContext).toBeTruthy();
                ctx.interactions[0].value = 'Changed value';
                blockForEvalContext = proxy['1570221906056_83'];
                expect(blockForEvalContext.__value__).toEqual('Changed value');
            }));
        });
    });
    describe('evaluateToBool()', () => {
        describe('wrapInExprSyntaxWhenAbsent', () => {
            it('should add expression wrapper when @() absent', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                expect(__1.wrapInExprSyntaxWhenAbsent('true = true')).toBe('@(true = true)');
            }));
            it('should leave as is when @() present', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                expect(__1.wrapInExprSyntaxWhenAbsent('@(true = true)')).toBe('@(true = true)');
            }));
        });
    });
    describe('setContactProperty()', () => {
        it('should set contact property', () => {
            dataset = IDataset_1.createDefaultDataset();
            const context = Object.assign({}, lodash_1.cloneDeep(dataset.contexts[1]));
            context.contact = new Contact_1.default();
            const block = {
                config: {
                    set_contact_property: {
                        property_key: 'foo',
                        property_value: 'bar',
                    },
                },
            };
            IBlock_1.setContactProperty(block, context);
            const property = context.contact.getProperty('foo');
            expect(typeof property).toBe('object');
            expect(property.__value__).toBe('bar');
        });
        it('should set an array of contact properties', () => {
            dataset = IDataset_1.createDefaultDataset();
            const context = Object.assign({}, lodash_1.cloneDeep(dataset.contexts[1]));
            context.contact = new Contact_1.default();
            const block = {
                config: {
                    set_contact_property: [
                        {
                            property_key: 'foo',
                            property_value: 'bar',
                        },
                        {
                            property_key: 'baz',
                            property_value: 'qux',
                        },
                    ],
                },
            };
            IBlock_1.setContactProperty(block, context);
            const property1 = context.contact.getProperty('foo');
            expect(typeof property1).toBe('object');
            expect(property1.__value__).toBe('bar');
            const property2 = context.contact.getProperty('baz');
            expect(typeof property2).toBe('object');
            expect(property2.__value__).toBe('qux');
        });
    });
    describe('createEvalContactFrom', () => {
        it('should clone the passed contact, deleting marked groups', () => {
            const groupToDelete = {
                group_key: 'two',
                __value__: 'two',
                updated_at: '0000-00-00',
                deleted_at: '2020-01-01',
            };
            const contact = new Contact_1.default();
            contact.groups = [
                {
                    group_key: 'one',
                    __value__: 'one',
                    updated_at: '0000-00-00',
                    deleted_at: undefined,
                },
                groupToDelete,
                {
                    group_key: 'three',
                    __value__: 'three',
                    updated_at: '0000-00-00',
                    deleted_at: undefined,
                },
            ];
            const evalContact = IBlock_1.createEvalContactFrom(contact);
            expect(contact.groups).toContain(groupToDelete);
            expect(evalContact.groups).not.toContain(groupToDelete);
        });
    });
});
//# sourceMappingURL=IBlock.spec.js.map