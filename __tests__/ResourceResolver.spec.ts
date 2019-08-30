import ResourceResolver from '../src/domain/ResourceResolver'
import {
  IResource,
  IResourceDefinition,
  IResourceDefinitionContentTypeSpecific,
  SupportedContentType,
  SupportedMode,
} from '../src'
import ResourceNotFoundException from '../src/domain/exceptions/ResourceNotFoundException'


describe('ResourceResolver', () => {
  describe('resolve', () => {
    it('should raise when resource absent', () => {
      const r = new ResourceResolver
      expect(() => r.resolve("notknown-0000-0000-0000-resource0123", [], "eng"))
        .toThrow(ResourceNotFoundException)
    })

    describe('when uuid provided is a string resource', () => {
      it('should return a wrapper resource', () => {
        const modes = [SupportedMode.SMS]
        const languageId = 'any-lang'
        const value = 'hello world!'

        const r = new ResourceResolver
        const expectedResourceContentTypeSpecific: IResourceDefinitionContentTypeSpecific = {
          modes,
          languageId,
          value,
          contentType: SupportedContentType.TEXT,
        }

        const actual: IResource = r.resolve(value, modes, languageId)

        expect(actual.uuid).toBe(value)
        expect(actual.values).toEqual([expectedResourceContentTypeSpecific])
        expect(actual.criteria.languageId).toBe(languageId)
        expect(actual.criteria.modes).toBe(modes)
      })
    })

    describe('when resource with uuid present', () => {
      it('should return resource with UUID provided', () => {
        const languageId = "eng"
        const modes = [SupportedMode.SMS]

        const expected: IResourceDefinition = {uuid: 'known000-0000-0000-0000-resource0123', values: []}

        const r = new ResourceResolver([
          {uuid: 'notknown-0000-0000-0000-resource0654', values: []},
          expected,
          {uuid: 'notknown-0000-0000-0000-resource0123', values: []}])

        const actual: IResource = r.resolve('known000-0000-0000-0000-resource0123', modes, languageId)

        expect(actual.uuid).toBe(expected.uuid)
        expect(actual.values).toEqual(expected.values)
        expect(actual.criteria.languageId).toBe(languageId)
        expect(actual.criteria.modes).toBe(modes)
      })

      describe('filtered resource definitions', () => {
        let values: IResourceDefinitionContentTypeSpecific[]

        beforeEach(() => values = [
            /* 00 */createResourceDefWith('eng', SupportedContentType.AUDIO, [SupportedMode.SMS, SupportedMode.USSD]),
            /* 01 */createResourceDefWith('eng', SupportedContentType.AUDIO, [SupportedMode.USSD]),
            /* 02 */createResourceDefWith('eng', SupportedContentType.AUDIO, [SupportedMode.IVR, SupportedMode.OFFLINE]),
            /* 03 */createResourceDefWith('eng', SupportedContentType.TEXT, [SupportedMode.SMS, SupportedMode.USSD]),
            /* 04 */createResourceDefWith('eng', SupportedContentType.TEXT, [SupportedMode.USSD]),
            /* 05 */createResourceDefWith('eng', SupportedContentType.TEXT, [SupportedMode.IVR, SupportedMode.OFFLINE]),
            /* 06 */createResourceDefWith('fre', SupportedContentType.AUDIO, [SupportedMode.SMS, SupportedMode.USSD]),
            /* 07 */createResourceDefWith('fre', SupportedContentType.AUDIO, [SupportedMode.USSD]),
            /* 08 */createResourceDefWith('fre', SupportedContentType.AUDIO, [SupportedMode.IVR, SupportedMode.OFFLINE]),
            /* 09 */createResourceDefWith('fre', SupportedContentType.TEXT, [SupportedMode.SMS, SupportedMode.USSD]),
            /* 10 */createResourceDefWith('fre', SupportedContentType.TEXT, [SupportedMode.USSD]),
            /* 11 */createResourceDefWith('fre', SupportedContentType.TEXT, [SupportedMode.IVR, SupportedMode.OFFLINE])])

        test.each`
          modes                                       | languageId  | expectedResourceDefIndices | desc
          ${[SupportedMode.SMS, SupportedMode.USSD]}  | ${'eng'}    | ${[0, 1, 3, 4]}            | ${'multiple matches when both criteria match'}
          ${[SupportedMode.IVR]}                      | ${'eng'}    | ${[2, 5]}                  | ${'matches when partial modes matched'}
          ${[SupportedMode.FACEBOOK_MESSENGER]}       | ${'eng'}    | ${[]}                      | ${'nothing whne mode not found'}
  
          ${[SupportedMode.SMS, SupportedMode.USSD]}  | ${'___'}    | ${[]}                      | ${'nothing when modes match and langauge not found'}
          ${[SupportedMode.IVR]}                      | ${'___'}    | ${[]}                      | ${'nothing when partial modes match and langauge not found'}
          ${[SupportedMode.FACEBOOK_MESSENGER]}       | ${'___'}    | ${[]}                      | ${'nothign when mode not found and language not found'}
`('should return $desc`', ({modes, languageId, expectedResourceDefIndices}) => {

          const expectedValues = values.filter((_v, i) => expectedResourceDefIndices.indexOf(i) !== -1)

          const r = new ResourceResolver([{uuid: 'known000-0000-0000-0000-resource0123', values}])
          const actual: IResource = r.resolve('known000-0000-0000-0000-resource0123', modes, languageId)
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
