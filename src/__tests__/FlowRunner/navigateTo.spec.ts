import {last} from 'lodash'
import {createDefaultDataset, IDataset} from '../fixtures/IDataset'
import {
  BlockRunnerFactoryStore,
  findInteractionWith,
  FlowRunner,
  IBlockInteraction,
  INumericPromptConfig,
  IRichCursor,
  NUMERIC_PROMPT_KEY,
} from '../..'


import {createStaticFirstExitBlockRunnerFor} from '../fixtures/BlockRunner'

// todo: abstract some of the setup

describe('FlowRunner/navigateTo', () => {
  let dataset: IDataset

  beforeEach(() => {
    dataset = createDefaultDataset()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('should push an additional interaction onto context\'s interaction stack', async () => {
    const ctx = dataset.contexts[0]
    const block = ctx.flows[0].blocks[0]
    const runner = new FlowRunner(ctx, new BlockRunnerFactoryStore([
      ['MobilePrimitives\\Message', createStaticFirstExitBlockRunnerFor],
    ]))

    expect(ctx.interactions).toHaveLength(0)
    await runner.navigateTo(block, ctx)
    expect(ctx.interactions).toHaveLength(1)
  })

  describe('simple cursor', () => {
    it('should overwrite on context when prev cursor absent and return same instance', async () => {
      const ctx = dataset.contexts[0]
      const block = ctx.flows[0].blocks[0]
      const runner = new FlowRunner(ctx, new BlockRunnerFactoryStore([
        ['MobilePrimitives\\Message', createStaticFirstExitBlockRunnerFor],
      ]))

      expect(ctx.cursor).toBeFalsy()
      const richCursor = await runner.navigateTo(block, ctx)
      expect(richCursor).toBeTruthy()
      expect(ctx.cursor).toEqual(runner.dehydrateCursor(richCursor))
    })

    it('should overwrite on context when prev cursor present and return same instance', async () => {
      const ctx = dataset.contexts[0]
      const block = ctx.flows[0].blocks[0]
      const runner = new FlowRunner(ctx, new BlockRunnerFactoryStore([
        ['MobilePrimitives\\Message', createStaticFirstExitBlockRunnerFor],
      ]))

      // todo: remove this once it's been pushed out to isolated behaviour
      jest.spyOn(runner, 'cacheInteractionByBlockName')
        .mockImplementation(() => {
        })

      const previousIntxId = 'some-fake-block-interaction-uuid'
      const promptConfig: INumericPromptConfig = {
        kind: NUMERIC_PROMPT_KEY,
        prompt: 'What age are you at?',
        value: null,
        isResponseRequired: false,
        isSubmitted: false,
        max: 999,
        min: 999,
      }
      const prevCursor = ctx.cursor = {interactionId: previousIntxId, promptConfig}
      const richCursor = await runner.navigateTo(block, ctx)
      const cursor = runner.dehydrateCursor(richCursor)

      expect(cursor).not.toEqual(prevCursor)
      expect(ctx.cursor).toEqual(cursor)
    })

    it('should have interactionId from newly created+pushed interaction', async () => {
      const ctx = dataset.contexts[0]
      const block = ctx.flows[0].blocks[0]
      const runner = new FlowRunner(ctx, new BlockRunnerFactoryStore([
        ['MobilePrimitives\\Message', createStaticFirstExitBlockRunnerFor],
      ]))

      const {interaction} = await runner.navigateTo(block, ctx)
      expect(interaction).toBe((last(ctx.interactions) as IBlockInteraction))
    })

    it('should have prompt from runner when provided', async () => {
      const ctx = dataset.contexts[0]
      const block = ctx.flows[0].blocks[0]
      const messageBlockRunner = createStaticFirstExitBlockRunnerFor(block, ctx)

      const runner = new FlowRunner(ctx, new BlockRunnerFactoryStore([
        ['MobilePrimitives\\Message', () => messageBlockRunner],
      ]))

      const startSpy = jest.spyOn(messageBlockRunner, 'initialize')
        .mockImplementation(async (): Promise<INumericPromptConfig> => ({
          kind: NUMERIC_PROMPT_KEY,
          prompt: 'What age are you at?',
          value: null,
          isResponseRequired: false,
          isSubmitted: false,
          max: 999,
          min: 999,
        }))

      const richCursor: IRichCursor = await runner.navigateTo(block, ctx)
      const cursor = runner.dehydrateCursor(richCursor)
      const expectedPrompt: Promise<INumericPromptConfig> = startSpy.mock.results[0].value

      expect(cursor.promptConfig).toBe(await expectedPrompt)
    })

    it('should have null prompt from runner when null provided', async () => {
      const ctx = dataset.contexts[0]
      const block = ctx.flows[0].blocks[0]
      const runner = new FlowRunner(ctx, new BlockRunnerFactoryStore([
        ['MobilePrimitives\\Message', createStaticFirstExitBlockRunnerFor],
      ]))

      const {prompt} = await runner.navigateTo(block, ctx)
      expect(prompt).toBeUndefined()
    })
  })

  describe('interaction', () => {
    it('should have block provided', async () => {
      const ctx = dataset.contexts[0]
      const block = ctx.flows[0].blocks[0]
      const runner = new FlowRunner(ctx, new BlockRunnerFactoryStore([
        ['MobilePrimitives\\Message', createStaticFirstExitBlockRunnerFor],
      ]))

      expect(ctx.nestedFlowBlockInteractionIdStack).toHaveLength(0)
      await runner.navigateTo(block, ctx)
      expect(ctx.interactions[0].blockId).toBe(block.uuid)
    })

    describe('flowId', () => {
      it('should be from root flow when not nested', async () => {
        const ctx = dataset.contexts[0]
        const block = ctx.flows[0].blocks[0]
        const runner = new FlowRunner(ctx, new BlockRunnerFactoryStore([
          ['MobilePrimitives\\Message', createStaticFirstExitBlockRunnerFor],
        ]))

        expect(ctx.nestedFlowBlockInteractionIdStack).toHaveLength(0)
        expect(ctx.firstFlowId).toBeTruthy()

        await runner.navigateTo(block, ctx)
        expect(ctx.interactions[0].flowId).toBe(ctx.firstFlowId)
      })

      it('should be from nested flow when nested once', async () => { // todo: not anymore?

        // RunFlow->(Message)->Message
        const ctx = dataset.contexts[2]

        // todo: actually, this needs to be the first block on the nested flow!
        const block = ctx.flows[1].blocks[0]
        const runner = new FlowRunner(ctx, new BlockRunnerFactoryStore([
          ['MobilePrimitives\\Message', createStaticFirstExitBlockRunnerFor],
        ]))

        // todo: remove this once it's been pushed out to isolated behaviour
        jest.spyOn(runner, 'cacheInteractionByBlockName')
          .mockImplementation(() => {
          })

        expect(ctx.nestedFlowBlockInteractionIdStack).toHaveLength(1)
        expect(findInteractionWith(last(ctx.nestedFlowBlockInteractionIdStack) as string, ctx).flowId)
          .toBe(ctx.flows[0].uuid)

        await runner.navigateTo(block, ctx)

        expect(ctx.interactions[1].flowId).toBe(ctx.flows[1].uuid)
      })

      it.todo('should be from deepest nested flow when deeply nested')
    })

    describe('originFlowId', () => {
      it('should be absent when on root flow', async () => {
        const ctx = dataset.contexts[0]
        const block = ctx.flows[0].blocks[0]
        const runner = new FlowRunner(ctx, new BlockRunnerFactoryStore([
          ['MobilePrimitives\\Message', createStaticFirstExitBlockRunnerFor],
        ]))

        expect(ctx.nestedFlowBlockInteractionIdStack).toHaveLength(0)
        expect(ctx.interactions).toHaveLength(0)

        await runner.navigateTo(block, ctx)

        expect(ctx.interactions[0].originFlowId).toBeUndefined()
      })

      it('should be from root flow when nested once', async () => {
        // RunFlow->(Message)->Message
        const ctx = dataset.contexts[2]
        const block = ctx.flows[1].blocks[0]
        const runner = new FlowRunner(ctx, new BlockRunnerFactoryStore([
          ['MobilePrimitives\\Message', createStaticFirstExitBlockRunnerFor],
        ]))

        // todo: remove this once it's been pushed out to isolated behaviour
        jest.spyOn(runner, 'cacheInteractionByBlockName')
          .mockImplementation(() => {
          })

        expect(ctx.nestedFlowBlockInteractionIdStack).toHaveLength(1)
        expect(findInteractionWith(last(ctx.nestedFlowBlockInteractionIdStack) as string, ctx).flowId)
          .toBe(ctx.flows[0].uuid)

        await runner.navigateTo(block, ctx)

        expect(ctx.interactions[1].originFlowId).toBe(ctx.flows[0].uuid)
      })

      it.todo('should be from deepest nested flow when deeply nested')
    })

    describe('originInteractionId', () => {
      it('should be absent when on root flow', async () => {
        const ctx = dataset.contexts[0]
        const block = ctx.flows[0].blocks[0]
        const runner = new FlowRunner(ctx, new BlockRunnerFactoryStore([
          ['MobilePrimitives\\Message', createStaticFirstExitBlockRunnerFor],
        ]))

        expect(ctx.nestedFlowBlockInteractionIdStack).toHaveLength(0)
        expect(ctx.interactions).toHaveLength(0)

        await runner.navigateTo(block, ctx)

        expect(ctx.interactions[0].originBlockInteractionId).toBeUndefined()
      })

      it('should be from root flow\'s interaction when nested once', async () => {
        // RunFlow->(Message)->Message
        const ctx = dataset.contexts[2]
        const block = ctx.flows[1].blocks[0]
        const runner = new FlowRunner(ctx, new BlockRunnerFactoryStore([
          ['MobilePrimitives\\Message', createStaticFirstExitBlockRunnerFor],
        ]))

        // todo: remove this once it's been pushed out to isolated behaviour
        jest.spyOn(runner, 'cacheInteractionByBlockName')
          .mockImplementation(() => {
          })

        expect(ctx.nestedFlowBlockInteractionIdStack).toHaveLength(1)
        expect(findInteractionWith(last(ctx.nestedFlowBlockInteractionIdStack) as string, ctx).flowId)
          .toBe(ctx.flows[0].uuid)

        await runner.navigateTo(block, ctx)

        expect(ctx.interactions[1].originBlockInteractionId).toBe(ctx.interactions[0].uuid)
      })

      it.todo('should be from deepest nested flow\'s interaction when deeply nested')
    })
  })
})
