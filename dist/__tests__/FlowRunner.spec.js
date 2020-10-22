"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
require("reflect-metadata");
const lodash_1 = require("lodash");
const IDataset_1 = require("./fixtures/IDataset");
const class_transformer_1 = require("class-transformer");
const __1 = require("..");
describe('FlowRunner', () => {
    let dataset;
    beforeEach(() => {
        dataset = IDataset_1.createDefaultDataset();
    });
    describe('serialization', () => {
        it('should be stringifiable', () => {
            const context = dataset.contexts[2];
            const contextObj = class_transformer_1.plainToClass(__1.Context, context);
            const serializedContext = class_transformer_1.serialize(contextObj);
            const deserializedContext = class_transformer_1.deserialize(__1.Context, serializedContext);
            expect(contextObj).toEqual(deserializedContext);
            expect(contextObj.getResource).toBeInstanceOf(Function);
        });
    });
    describe('sanity', () => {
        it('should be available', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            const runner = new __1.FlowRunner(dataset.contexts[0]);
            expect(runner).toBeTruthy();
        }));
        it('should run!', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            const ctx = Object.assign(Object.assign({}, dataset.contexts[1]), { interactions: [], cursor: undefined });
            const runner = new __1.FlowRunner(ctx);
            let cursor = yield runner.run();
            if (cursor == null) {
                throw new __1.ValidationException('Omg, no cursor?');
            }
            expect(cursor).toBeTruthy();
            expect(cursor.interaction).toBeTruthy();
            expect(cursor.prompt).toBeTruthy();
            cursor.prompt.value = null;
            cursor = yield runner.run();
            if (!cursor) {
                throw new __1.ValidationException('Omg, no cursor?');
            }
            expect(cursor).toBeTruthy();
            expect(cursor.interaction).toBeTruthy();
            expect(cursor.prompt).toBeTruthy();
            cursor.prompt.value = null;
            cursor = yield runner.run();
            if (!cursor) {
                throw new __1.ValidationException('Omg, no cursor?');
            }
            expect(cursor).toBeTruthy();
            expect(cursor.interaction).toBeTruthy();
            expect(cursor.prompt).toBeTruthy();
            cursor.prompt.value = null;
            expect(yield runner.run()).toBeFalsy();
        }));
        describe('case block unable to find cursor', () => {
            it('shouldnt raise an exception requiring prompt', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                const context = require('./fixtures/2019-10-08-case-block-eval-issue.json');
                lodash_1.set(context, 'cursor.promptConfig.isSubmitted', false);
                const runner = new __1.FlowRunner(context);
                yield expect(runner.run()).rejects.toThrow('Unable to find default exit on block 95bd9e4a-93cd-46f2-9b43-8ecf940b278e');
            }));
        });
        describe.skip('case block always evaluates to false', () => {
            it('shouldnt raise an except requiring prompt', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                const context = require('./fixtures/2019-10-09-case-block-always-false.json');
                const runner = new __1.FlowRunner(context);
                expect(__1.FlowRunner.prototype.run.bind(runner)).not.toThrow();
            }));
        });
        describe('VMO-1484-case-branching-improperly', () => {
            it('should hit Cats branch', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                const { flows } = require('./fixtures/2019-10-12-VMO-1484-case-branching-improperly.json');
                const resources = lodash_1.flatMap(flows, 'resources');
                const context = __1.createContextDataObjectFor({ id: '1' }, 'user-1234', 'org-1234', flows, 'en_US', __1.SupportedMode.OFFLINE, resources);
                const runner = new __1.FlowRunner(context);
                let { prompt } = (yield runner.run());
                prompt.value = prompt.config.choices[1].key;
                prompt = (yield runner.run()).prompt;
                expect(prompt.config.prompt).toEqual('95bd9e4a-9300-400a-9f61-8ede034f93d8');
            }));
            it('should hit Dogs branch', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                const { flows } = require('./fixtures/2019-10-12-VMO-1484-case-branching-improperly.json');
                const resources = lodash_1.flatMap(flows, 'resources');
                const context = __1.createContextDataObjectFor({ id: '1' }, 'user-1234', 'org-1234', flows, 'en_US', __1.SupportedMode.OFFLINE, resources);
                const runner = new __1.FlowRunner(context);
                let { prompt } = (yield runner.run());
                prompt.value = prompt.config.choices[0].key;
                prompt = (yield runner.run()).prompt;
                expect(prompt.config.prompt).toEqual('95bd9e4a-9300-400a-9f61-8ede0325225f');
            }));
        });
        describe('nested flow', () => {
            it('should run', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                const { flows, resources } = require('./fixtures/2020-04-14-run-flow-unable-to-find-flow.json');
                const context = __1.createContextDataObjectFor({ id: '1' }, 'user-1234', 'org-1234', flows, 'en_US', __1.SupportedMode.OFFLINE, resources);
                const runner = new __1.FlowRunner(context);
                let { prompt } = (yield runner.run());
                expect(prompt).toBeTruthy();
                prompt.value = null;
                prompt = (yield runner.run()).prompt;
                expect(prompt).toBeTruthy();
                prompt.value = null;
                prompt = (yield runner.run()).prompt;
                expect(prompt).toBeTruthy();
                prompt.value = null;
                prompt = (yield runner.run()).prompt;
                expect(prompt).toBeTruthy();
                prompt.value = null;
                prompt = (yield runner.run()).prompt;
                expect(prompt).toBeTruthy();
                prompt.value = null;
                prompt = (yield runner.run()).prompt;
                expect(prompt).toBeTruthy();
                prompt.value = null;
                expect(yield runner.run()).toBeUndefined();
            }));
            it('should handle stepping out multiple times', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                const context = require('./fixtures/2020-04-23-run-flow-unable-to-step-out-doubly-nested.context.json');
                const runner = new __1.FlowRunner(context);
                runner.cacheInteractionByBlockName = lodash_1.noop;
                let { prompt } = (yield runner.run());
                expect(prompt).toBeTruthy();
                prompt.value = 'Run Tree B';
                prompt = (yield runner.run()).prompt;
                expect(prompt).toBeTruthy();
                prompt.value = null;
                prompt = (yield runner.run()).prompt;
                expect(prompt).toBeTruthy();
                prompt.value = 'Two';
                prompt = (yield runner.run()).prompt;
                expect(prompt).toBeTruthy();
                prompt.value = null;
                prompt = (yield runner.run()).prompt;
                expect(prompt).toBeTruthy();
                prompt.value = 50;
                const cursor = yield runner.run();
                expect(cursor).toBeUndefined();
                expect(context.deliveryStatus).toBe(__1.DeliveryStatus.FINISHED_COMPLETE);
                expect(context.exitAt).toBeTruthy();
                expect(lodash_1.every(context.interactions, i => i.exitAt)).toBeTruthy();
            }));
        });
    });
});
//# sourceMappingURL=FlowRunner.spec.js.map