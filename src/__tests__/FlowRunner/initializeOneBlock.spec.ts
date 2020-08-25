import {createDefaultDataset, IDataset} from '../fixtures/IDataset'
import {BlockRunnerFactoryStore, FlowRunner, IBlockInteraction, INumericPromptConfig, IRichCursor, NUMERIC_PROMPT_KEY} from '../..'

describe('FlowRunner/initializeOneBlock', () => {
  let dataset: IDataset

  beforeEach(() => {
    dataset = createDefaultDataset()
  })

  it('should return cursor with empty prompt when prompt not provided', async () => {
    const ctx = dataset.contexts[0]
    const flow = ctx.flows[0]
    const block = flow.blocks[0]
    const runner = new FlowRunner(
      ctx,
      new BlockRunnerFactoryStore([
        [
          'MobilePrimitives\\Message',
          (block, context) => ({
            block,
            context,
            initialize: async () => undefined,
            run: async () => block.exits[0],
          }),
        ],
      ])
    )

    const {prompt} = await runner.initializeOneBlock(block, flow.uuid, undefined, undefined)
    expect(prompt).toBeUndefined()
  })

  it('should return cursor with prompt from runner when prompt provided', async () => {
    // todo: this should use a jest.SpyInstance
    let expectedPrompt: INumericPromptConfig | null = null

    const ctx = dataset.contexts[0]
    const flow = ctx.flows[0]
    const block = flow.blocks[0]
    const runner = new FlowRunner(
      ctx,
      new BlockRunnerFactoryStore([
        [
          'MobilePrimitives\\Message',
          (block, context) => ({
            block,
            context,
            initialize: async (): Promise<INumericPromptConfig> =>
              (expectedPrompt = {
                kind: NUMERIC_PROMPT_KEY,
                prompt: 'What age are you at?',
                value: null,
                isResponseRequired: false,
                isSubmitted: false,
                max: 999,
                min: 999,
              }),
            run: async () => block.exits[0],
          }),
        ],
      ])
    )

    const richCursor: IRichCursor = await runner.initializeOneBlock(block, flow.uuid, undefined, undefined)
    const cursor = runner.dehydrateCursor(richCursor)

    expect(cursor.promptConfig).toBe(expectedPrompt)
  })

  it('should return cursor with interaction for block + flow', async () => {
    const ctx = dataset.contexts[0]
    const flow = ctx.flows[0]
    const block = flow.blocks[0]
    const runner = new FlowRunner(
      ctx,
      new BlockRunnerFactoryStore([
        [
          'MobilePrimitives\\Message',
          (block, context) => ({
            block,
            context,
            initialize: async () => undefined,
            run: async () => block.exits[0],
          }),
        ],
      ])
    )

    const {interaction} = await runner.initializeOneBlock(block, flow.uuid, undefined, undefined)
    expect(interaction).toEqual(expect.objectContaining({blockId: block.uuid} as Partial<IBlockInteraction>))
    expect(interaction).toEqual(expect.objectContaining({flowId: flow.uuid} as Partial<IBlockInteraction>))
  })
})
