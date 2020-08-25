import {
  findInteractionWith,
  FlowRunner,
  IContextInputRequired,
  IMessagePromptConfig,
  IPromptConfig,
  IRichCursorInputRequired,
  MessagePrompt,
} from '../..'
import {createDefaultDataset, IDataset} from '../fixtures/IDataset'

describe('BasePrompt', () => {
  let dataset: IDataset

  beforeEach(() => {
    dataset = createDefaultDataset()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('default state', () => {
    describe('error', () => {
      it('should default its error state to empty to simply UI rendering', async () => {
        const config: IPromptConfig<any> = dataset._prompts[0]
        const
          ctx = dataset.contexts[1] as IContextInputRequired
        const runner = new FlowRunner(ctx)
        const prompt = new MessagePrompt(
          config as IMessagePromptConfig,
          'abc-123',
          runner)

        expect(prompt.error).toBeNull()
      })
    })
  })

  describe('fulfill', () => {
    it('should set provided value onto itself', async () => {
      const config: IPromptConfig<any> = dataset._prompts[0]
      const
        ctx = dataset.contexts[1] as IContextInputRequired
      const runner = new FlowRunner(ctx)
      const prompt = new MessagePrompt(
        config as IMessagePromptConfig,
        'abc-123',
        runner)

      jest.spyOn(runner, 'run')
        .mockImplementation(async () => undefined)

      delete config.value
      await prompt.fulfill(null)
      expect(config.value).toBeNull()
    })

    it('should return result of calling run on its runner', async () => {
      const config: IPromptConfig<any> = dataset._prompts[0]
      const
        ctx = dataset.contexts[1] as IContextInputRequired
      const runner = new FlowRunner(ctx)
      const prompt = new MessagePrompt(
        config as IMessagePromptConfig,
        'abc-123',
        runner)
      const richCursor = runner.hydrateRichCursorFrom(ctx) as IRichCursorInputRequired

      jest.spyOn(runner, 'run')
        .mockImplementation(async () => richCursor)

      const cursor = await prompt.fulfill(null)
      expect(cursor).toBe(richCursor)
    })
  })

  describe('block', () => {
    it('should return block when block exists on runner', () => {
      const config: IPromptConfig<any> = dataset._prompts[0]
      const firstInteractionId = '09894745-38ba-456f-aab4-720b7d09d5b3'
      const
        ctx = dataset.contexts[1] as IContextInputRequired
      const runner = new FlowRunner(ctx)
      const prompt = new MessagePrompt(
        config as IMessagePromptConfig,
        firstInteractionId,
        runner)

      expect(prompt.block).toBe(ctx.flows[1].blocks[0])
    })

    it.skip('should return block on flow specified by interaction and not necessarily active flow', () => {
      // first flow, first (+ only) block: 42e635ea-bc57-4c68-a8d6-20f648968bec
      // first flow: 957a8923-428a-420f-8053-d23927e0eea0

    })

    it('should return null when block absent on runner (and not raise)', () => {
      const config: IPromptConfig<any> = dataset._prompts[0]
      const
        ctx = dataset.contexts[1] as IContextInputRequired
      const runner = new FlowRunner(ctx)
      const firstInteractionId = '09894745-38ba-456f-aab4-720b7d09d5b3'
      const prompt = new MessagePrompt(
        config as IMessagePromptConfig,
        firstInteractionId,
        runner,
      )

      findInteractionWith(firstInteractionId, ctx)!.blockId = 'some-absent-block'
      expect(prompt.block).toBeUndefined()
    })
  })
})
