"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const __1 = require("..");
describe('ResourceResolver', () => {
    let resolver;
    let ctx;
    beforeEach(() => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        ctx = yield __1.createContextDataObjectFor({ id: 'contact-123', name: 'Bert' }, [{ group_key: 'mygroup', label: 'mygroup', __value__: 'mygroup' }], 'user-123', 'org-123', [{ uuid: 'flow-123' }], 'eng', __1.SupportedMode.OFFLINE);
        resolver = new __1.ResourceResolver(ctx);
    }));
    describe('resolve', () => {
        it('should raise when resource absent', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            expect(() => resolver.resolve('notknown-0000-0000-0000-resource0123')).toThrow(__1.ResourceNotFoundException);
        }));
        describe('when uuid provided is a string resource', () => {
            it('should return a wrapper resource', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                const value = 'hello world!';
                const expectedResourceContentTypeSpecific = {
                    modes: [ctx.mode],
                    languageId: ctx.language_id,
                    value,
                    contentType: __1.SupportedContentType.TEXT,
                };
                const actual = resolver.resolve(value);
                expect(actual.uuid).toBe(value);
                expect(actual.values).toEqual([expectedResourceContentTypeSpecific]);
                expect(actual.context).toBe(ctx);
            }));
        });
        describe('when resource with uuid present', () => {
            it('should return resource with UUID provided', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                const expected = { uuid: 'known000-0000-0000-0000-resource0123', values: [] };
                ctx.resources = [
                    { uuid: 'notknown-0000-0000-0000-resource0654', values: [] },
                    expected,
                    { uuid: 'notknown-0000-0000-0000-resource0123', values: [] },
                ];
                const actual = resolver.resolve('known000-0000-0000-0000-resource0123');
                expect(actual.uuid).toBe(expected.uuid);
                expect(actual.values).toEqual(expected.values);
                expect(actual.context).toBe(ctx);
            }));
            describe('filtered resource definitions', () => {
                let variants;
                beforeEach(() => (variants = [
                    createResourceDefWith('eng', __1.SupportedContentType.AUDIO, [__1.SupportedMode.SMS, __1.SupportedMode.USSD]),
                    createResourceDefWith('eng', __1.SupportedContentType.AUDIO, [__1.SupportedMode.USSD]),
                    createResourceDefWith('eng', __1.SupportedContentType.AUDIO, [__1.SupportedMode.IVR, __1.SupportedMode.RICH_MESSAGING]),
                    createResourceDefWith('eng', __1.SupportedContentType.TEXT, [__1.SupportedMode.SMS, __1.SupportedMode.USSD]),
                    createResourceDefWith('eng', __1.SupportedContentType.TEXT, [__1.SupportedMode.USSD]),
                    createResourceDefWith('eng', __1.SupportedContentType.TEXT, [__1.SupportedMode.IVR, __1.SupportedMode.RICH_MESSAGING]),
                    createResourceDefWith('fre', __1.SupportedContentType.AUDIO, [__1.SupportedMode.SMS, __1.SupportedMode.USSD]),
                    createResourceDefWith('fre', __1.SupportedContentType.AUDIO, [__1.SupportedMode.USSD]),
                    createResourceDefWith('fre', __1.SupportedContentType.AUDIO, [__1.SupportedMode.IVR, __1.SupportedMode.RICH_MESSAGING]),
                    createResourceDefWith('fre', __1.SupportedContentType.TEXT, [__1.SupportedMode.SMS, __1.SupportedMode.USSD]),
                    createResourceDefWith('fre', __1.SupportedContentType.TEXT, [__1.SupportedMode.USSD]),
                    createResourceDefWith('fre', __1.SupportedContentType.TEXT, [__1.SupportedMode.IVR, __1.SupportedMode.RICH_MESSAGING]),
                ]));
                test.each `
          modeFilter            | languageIdFilter | expectedResourceDefIndices | desc
          ${__1.SupportedMode.USSD} | ${'eng'}         | ${[0, 1, 3, 4]}            | ${'list of multiple matches when mode present in supported modes on multiple and language matches'}
          ${__1.SupportedMode.IVR}  | ${'eng'}         | ${[2, 5]}                  | ${'list of single match when mode in supported modes and language matches'}
          ${'some-mode'}        | ${'eng'}         | ${[]}                      | ${'nothing when mode not found and languag matches'}
          ${__1.SupportedMode.USSD} | ${'abc'}         | ${[]}                      | ${'nothing when mode present in supported modes on multiple and langauge not found'}
          ${__1.SupportedMode.IVR}  | ${'abc'}         | ${[]}                      | ${'nothing when mode in supported modes and langauge not found'}
          ${'some-mode'}        | ${'abc'}         | ${[]}                      | ${'nothing when mode not found and language not found'}
        `('should return $desc`', ({ modeFilter: mode, languageIdFilter: languageId, expectedResourceDefIndices }) => {
                    const expectedValues = variants.filter((_v, i) => expectedResourceDefIndices.indexOf(i) !== -1);
                    Object.assign(resolver.context, {
                        mode,
                        language_id: languageId,
                        resources: [
                            {
                                uuid: 'known000-0000-0000-0000-resource0123',
                                values: variants,
                            },
                        ],
                    });
                    const actual = resolver.resolve('known000-0000-0000-0000-resource0123');
                    expect(actual.values).toEqual(expectedValues);
                });
            });
        });
    });
});
function createResourceDefWith(languageId, contentType, modes, value = 'sample-resource-value') {
    return { languageId, contentType, value, modes };
}
//# sourceMappingURL=ResourceResolver.spec.js.map