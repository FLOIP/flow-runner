import ResourceResolver from '../src/domain/ResourceResolver'
import {
  createContextFor,
  IResource,
  IResourceDefinition,
  IResourceDefinitionContentTypeSpecific,
  SupportedContentType,
  SupportedMode,
} from '../src'
import ResourceNotFoundException from '../src/domain/exceptions/ResourceNotFoundException'
import IResourceResolver from '../src/domain/IResourceResolver'
import IContext from '../src/flow-spec/IContext'
import IFlow from '../src/flow-spec/IFlow'


describe('ResourceResolver', () => {
  let resolver: IResourceResolver
  let ctx: IContext

  beforeEach(() => {
    ctx = createContextFor({id: 'contact-123', name: 'Bert'}, 'user-123', [{uuid: 'flow-123'} as IFlow], 'eng')
    resolver = new ResourceResolver(ctx)
  })

  describe('resolve', () => {
    it('should raise when resource absent', () => {
      expect(() => resolver.resolve("notknown-0000-0000-0000-resource0123"))
        .toThrow(ResourceNotFoundException)
    })

    describe('when uuid provided is a string resource', () => {
      it('should return a wrapper resource', () => {
        const value = 'hello world!'
        const expectedResourceContentTypeSpecific: IResourceDefinitionContentTypeSpecific = {
          modes: [ctx.mode],
          languageId: ctx.languageId,
          value,
          contentType: SupportedContentType.TEXT,
        }

        const actual: IResource = resolver.resolve(value)

        expect(actual.uuid).toBe(value)
        expect(actual.values).toEqual([expectedResourceContentTypeSpecific])
        expect(actual.context).toBe(ctx)
      })
    })

    describe('when resource with uuid present', () => {
      it('should return resource with UUID provided', () => {
        const expected: IResourceDefinition = {uuid: 'known000-0000-0000-0000-resource0123', values: []}

        ctx.resources = [
          {uuid: 'notknown-0000-0000-0000-resource0654', values: []},
          expected,
          {uuid: 'notknown-0000-0000-0000-resource0123', values: []}]

        const actual: IResource = resolver.resolve('known000-0000-0000-0000-resource0123')

        expect(actual.uuid).toBe(expected.uuid)
        expect(actual.values).toEqual(expected.values)
        expect(actual.context).toBe(ctx)
      })

      describe('filtered resource definitions', () => {
        let variants: IResourceDefinitionContentTypeSpecific[]

        beforeEach(() => variants = [
            /* 00 */createResourceDefWith('eng', SupportedContentType.AUDIO, [SupportedMode.SMS, SupportedMode.USSD]),
            /* 01 */createResourceDefWith('eng', SupportedContentType.AUDIO, [SupportedMode.USSD]),
            /* 02 */createResourceDefWith('eng', SupportedContentType.AUDIO, [SupportedMode.IVR, SupportedMode.RICH_MESSAGING]),
            /* 03 */createResourceDefWith('eng', SupportedContentType.TEXT, [SupportedMode.SMS, SupportedMode.USSD]),
            /* 04 */createResourceDefWith('eng', SupportedContentType.TEXT, [SupportedMode.USSD]),
            /* 05 */createResourceDefWith('eng', SupportedContentType.TEXT, [SupportedMode.IVR, SupportedMode.RICH_MESSAGING]),
            /* 06 */createResourceDefWith('fre', SupportedContentType.AUDIO, [SupportedMode.SMS, SupportedMode.USSD]),
            /* 07 */createResourceDefWith('fre', SupportedContentType.AUDIO, [SupportedMode.USSD]),
            /* 08 */createResourceDefWith('fre', SupportedContentType.AUDIO, [SupportedMode.IVR, SupportedMode.RICH_MESSAGING]),
            /* 09 */createResourceDefWith('fre', SupportedContentType.TEXT, [SupportedMode.SMS, SupportedMode.USSD]),
            /* 10 */createResourceDefWith('fre', SupportedContentType.TEXT, [SupportedMode.USSD]),
            /* 11 */createResourceDefWith('fre', SupportedContentType.TEXT, [SupportedMode.IVR, SupportedMode.RICH_MESSAGING])])

        test.each`
          modeFilter                                  | languageIdFilter  | expectedResourceDefIndices | desc
          ${SupportedMode.USSD}                       | ${'eng'}          | ${[0, 1, 3, 4]}            | ${'list of multiple matches when mode present in supported modes on multiple and language matches'}
          ${SupportedMode.IVR}                        | ${'eng'}          | ${[2, 5]}                  | ${'list of single match when mode in supported modes and language matches'}
          ${'some-mode'}                              | ${'eng'}          | ${[]}                      | ${'nothing when mode not found and languag matches'}
  
          ${SupportedMode.USSD}                       | ${'abc'}          | ${[]}                      | ${'nothing when mode present in supported modes on multiple and langauge not found'}
          ${SupportedMode.IVR}                        | ${'abc'}          | ${[]}                      | ${'nothing when mode in supported modes and langauge not found'}
          ${'some-mode'}                              | ${'abc'}          | ${[]}                      | ${'nothing when mode not found and language not found'}
        `('should return $desc`', ({
            modeFilter: mode,
            languageIdFilter: languageId,
            expectedResourceDefIndices}) => {

          const expectedValues = variants.filter((_v, i) => expectedResourceDefIndices.indexOf(i) !== -1)

          Object.assign(resolver.context, {
            mode,
            languageId,
            resources: [{
              uuid: 'known000-0000-0000-0000-resource0123',
              values: variants}],
          } as Partial<IContext>)

          const actual: IResource = resolver.resolve('known000-0000-0000-0000-resource0123')
          expect(actual.values).toEqual(expectedValues)
        })
      })
    })
  })
})

function createResourceDefWith(
  languageId: IResourceDefinitionContentTypeSpecific['languageId'],
  contentType: IResourceDefinitionContentTypeSpecific['contentType'],
  modes: IResourceDefinitionContentTypeSpecific['modes'],
  value: IResourceDefinitionContentTypeSpecific['value'] = 'sample-resource-value'): IResourceDefinitionContentTypeSpecific {

  return {languageId, contentType, value, modes}
}
