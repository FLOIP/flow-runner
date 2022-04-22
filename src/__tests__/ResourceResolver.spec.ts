/* eslint-disable max-len */
import {
  createContextDataObjectFor,
  IContact,
  IContext,
  IFlow,
  IGroup,
  IResourceWithContext,
  IResource,
  IResourceValue,
  IResourceResolver,
  ResourceNotFoundException,
  ResourceResolver,
  SupportedContentType,
  SupportedMode,
} from '..'

describe('ResourceResolver', () => {
  let resolver: IResourceResolver
  let ctx: IContext
  const firstFlowUuid = 'flow-123'

  beforeEach(async () => {
    ctx = await createContextDataObjectFor(
      ({id: 'contact-123', name: 'Bert'} as unknown) as IContact,
      [{group_key: 'mygroup', label: 'mygroup', __value__: 'mygroup'} as IGroup],
      'user-123',
      'org-123',
      [{uuid: firstFlowUuid} as IFlow],
      'eng',
      SupportedMode.OFFLINE
    )

    resolver = new ResourceResolver(ctx)
  })

  describe('resolve', () => {
    it('should raise when resource absent', async () => {
      expect(() => resolver.resolve('notknown-0000-0000-0000-resource0123')).toThrow(ResourceNotFoundException)
    })

    describe('when uuid provided is a string resource', () => {
      it('should return a wrapper resource', async () => {
        const value = 'hello world!'
        const expectedResourceContentTypeSpecific: IResourceValue = {
          modes: [ctx.mode],
          language_id: ctx.language_id,
          value,
          content_type: SupportedContentType.TEXT,
        }

        const actual: IResourceWithContext = resolver.resolve(value)

        expect(actual.uuid).toBe(value)
        expect(actual.values).toEqual([expectedResourceContentTypeSpecific])
        expect(actual.context).toBe(ctx)
      })
    })

    describe('when resource with uuid present', () => {
      it('should return resource with UUID provided', async () => {
        const expected: IResource = {uuid: 'known000-0000-0000-0000-resource0123', values: []}
        ctx.flows[0].resources = [
          {uuid: 'notknown-0000-0000-0000-resource0654', values: []},
          expected,
          {uuid: 'notknown-0000-0000-0000-resource0123', values: []},
        ]

        const actual: IResourceWithContext = resolver.resolve('known000-0000-0000-0000-resource0123')

        expect(actual.uuid).toBe(expected.uuid)
        expect(actual.values).toEqual(expected.values)
        expect(actual.context).toBe(ctx)
      })

      describe('filtered resource definitions', () => {
        let variants: IResourceValue[]

        beforeEach(
          () =>
            (variants = [
              /* 00 */
              createResourceDefWith('eng', SupportedContentType.AUDIO, [SupportedMode.SMS, SupportedMode.USSD]),
              /* 01 */
              createResourceDefWith('eng', SupportedContentType.AUDIO, [SupportedMode.USSD]),
              /* 02 */
              createResourceDefWith('eng', SupportedContentType.AUDIO, [SupportedMode.IVR, SupportedMode.RICH_MESSAGING]),
              /* 03 */
              createResourceDefWith('eng', SupportedContentType.TEXT, [SupportedMode.SMS, SupportedMode.USSD]),
              /* 04 */
              createResourceDefWith('eng', SupportedContentType.TEXT, [SupportedMode.USSD]),
              /* 05 */
              createResourceDefWith('eng', SupportedContentType.TEXT, [SupportedMode.IVR, SupportedMode.RICH_MESSAGING]),
              /* 06 */
              createResourceDefWith('fre', SupportedContentType.AUDIO, [SupportedMode.SMS, SupportedMode.USSD]),
              /* 07 */
              createResourceDefWith('fre', SupportedContentType.AUDIO, [SupportedMode.USSD]),
              /* 08 */
              createResourceDefWith('fre', SupportedContentType.AUDIO, [SupportedMode.IVR, SupportedMode.RICH_MESSAGING]),
              /* 09 */
              createResourceDefWith('fre', SupportedContentType.TEXT, [SupportedMode.SMS, SupportedMode.USSD]),
              /* 10 */
              createResourceDefWith('fre', SupportedContentType.TEXT, [SupportedMode.USSD]),
              /* 11 */
              createResourceDefWith('fre', SupportedContentType.TEXT, [SupportedMode.IVR, SupportedMode.RICH_MESSAGING]),
            ])
        )

        test.each`
          modeFilter            | languageIdFilter | expectedResourceDefIndices | desc
          ${SupportedMode.USSD} | ${'eng'}         | ${[0, 1, 3, 4]}            | ${'list of multiple matches when mode present in supported modes on multiple and language matches'}
          ${SupportedMode.IVR}  | ${'eng'}         | ${[2, 5]}                  | ${'list of single match when mode in supported modes and language matches'}
          ${'some-mode'}        | ${'eng'}         | ${[]}                      | ${'nothing when mode not found and languag matches'}
          ${SupportedMode.USSD} | ${'abc'}         | ${[]}                      | ${'nothing when mode present in supported modes on multiple and langauge not found'}
          ${SupportedMode.IVR}  | ${'abc'}         | ${[]}                      | ${'nothing when mode in supported modes and langauge not found'}
          ${'some-mode'}        | ${'abc'}         | ${[]}                      | ${'nothing when mode not found and language not found'}
        `('should return $desc`', ({modeFilter: mode, languageIdFilter: languageId, expectedResourceDefIndices}) => {
          const expectedValues = variants.filter((_v, i) => expectedResourceDefIndices.indexOf(i) !== -1)

          Object.assign(resolver.context, {
            mode,
            language_id: languageId,
            flows: [
              {
                uuid: firstFlowUuid,
                resources: [
                  {
                    uuid: 'known000-0000-0000-0000-resource0123',
                    values: variants,
                  },
                ],
              },
            ],
          } as Partial<IContext>)

          const actual: IResourceWithContext = resolver.resolve('known000-0000-0000-0000-resource0123')
          expect(actual.values).toEqual(expectedValues)
        })
      })
    })
  })
})

function createResourceDefWith(
  languageId: IResourceValue['language_id'],
  contentType: IResourceValue['content_type'],
  modes: IResourceValue['modes'],
  value: IResourceValue['value'] = 'sample-resource-value'
): IResourceValue {
  return {language_id: languageId, content_type: contentType, value, modes}
}
