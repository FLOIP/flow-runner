import IDataset, {createDefaultDataset} from '../../__test_fixtures__/fixtures/IDataset'
import FlowRunner, {BlockRunnerFactoryStore} from '../../src/domain/FlowRunner'
import IBlockInteraction from '../../src/flow-spec/IBlockInteraction'
import {
  IBasePromptConfig,
  INumericPromptConfig,
  KnownPrompts,
  Resource,
  RichCursorType,
  SupportedContentType,
  SupportedMode,
} from '../../src'


describe('FlowRunner/initializeOneBlock', () => {
  let dataset: IDataset

  beforeEach(() => {
    dataset = createDefaultDataset()
  })

  it('should return cursor with empty prompt when prompt not provided', () => {
    const
        ctx = dataset.contexts[0],
        flow = ctx.flows[0],
        block = flow.blocks[0],
        runner = new FlowRunner(ctx, new BlockRunnerFactoryStore([
          ['MobilePrimitives\\Message', (block, context) => ({
            block,
            context,
            initialize: () => undefined,
            run: () => block.exits[0]
          })],
        ]))

    const [, prompt] = runner.initializeOneBlock(block, flow.uuid, undefined, undefined)
    expect(prompt).toBeUndefined()
  })

  it('should return cursor with prompt from runner when prompt provided', () => {
    let expectedPrompt: (INumericPromptConfig & IBasePromptConfig) | null = null // todo: this should use a jest.SpyInstance

    const
        ctx = dataset.contexts[0],
        flow = ctx.flows[0],
        block = flow.blocks[0],
        runner = new FlowRunner(ctx, new BlockRunnerFactoryStore([
          ['MobilePrimitives\\Message', (block, context) => ({
            block,
            context,
            initialize: (): INumericPromptConfig & IBasePromptConfig => expectedPrompt = {
              kind: KnownPrompts.Numeric,
              prompt: new Resource(
                'What age are you at?',
                [{ modes: [SupportedMode.SMS],
                   languageId: 'eng',
                   value: 'What age are you at?',
                   contentType: SupportedContentType.TEXT}],
                context),
              value: null,
              isResponseRequired: false,
              isSubmitted: false,
              max: 999,
              min: 999,},
            run: () => block.exits[0]
          })],
        ]))

    const
        richCursor: RichCursorType = runner.initializeOneBlock(block, flow.uuid, undefined, undefined),
        cursor = runner.dehydrateCursor(richCursor)

    expect(cursor[1]).toBe(expectedPrompt)
  })

  it('should return cursor with interaction for block + flow', () => {
    const
        ctx = dataset.contexts[0],
        flow = ctx.flows[0],
        block = flow.blocks[0],
        runner = new FlowRunner(ctx, new BlockRunnerFactoryStore([
          ['MobilePrimitives\\Message', (block, context) => ({
            block,
            context,
            initialize: () => undefined,
            run: () => block.exits[0]
          })],
        ]))

    const [interaction] = runner.initializeOneBlock(block, flow.uuid, undefined, undefined)
    expect(interaction).toEqual(expect.objectContaining({blockId: block.uuid} as Partial<IBlockInteraction>))
    expect(interaction).toEqual(expect.objectContaining({flowId: flow.uuid} as Partial<IBlockInteraction>))
  })
})
