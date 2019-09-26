import {last} from 'lodash'
import IDataset, {createDefaultDataset} from '../../__test_fixtures__/fixtures/IDataset'
import FlowRunner, {BlockRunnerFactoryStore} from "../../src/domain/FlowRunner";
import IBlockInteraction from "../../src/flow-spec/IBlockInteraction";
import {findInteractionWith, RichCursorType} from '../../src'
import {IBasePromptConfig, KnownPrompts} from '../../src';
import {createStaticFirstExitBlockRunnerFor} from "../../__test_fixtures__/fixtures/BlockRunner";
import {INumericPromptConfig} from '../../src';

// todo: abstract some of the setup

describe('FlowRunner/navigateTo', () => {
  let dataset: IDataset

  beforeEach(() => {
    dataset = createDefaultDataset()
  })

  it('should push an additional interaction onto context\'s interaction stack', () => {
    const
        ctx = dataset.contexts[0],
        block = ctx.flows[0].blocks[0],
        runner = new FlowRunner(ctx, new BlockRunnerFactoryStore([
          ['MobilePrimitives\\Message', createStaticFirstExitBlockRunnerFor],]))

    expect(ctx.interactions.length).toBe(0)
    runner.navigateTo(block, ctx)
    expect(ctx.interactions.length).toBe(1)
  })

  describe('simple cursor', () => {
    it('should overwrite on context when prev cursor absent and return same instance', () => {
      const
          ctx = dataset.contexts[0],
          block = ctx.flows[0].blocks[0],
          runner = new FlowRunner(ctx, new BlockRunnerFactoryStore([
            ['MobilePrimitives\\Message', createStaticFirstExitBlockRunnerFor],]))

      expect(ctx.cursor).toBeFalsy()
      const richCursor = runner.navigateTo(block, ctx)
      expect(richCursor).toBeTruthy()
      expect(ctx.cursor).toEqual(runner.dehydrateCursor(richCursor))
    })

    it('should overwrite on context when prev cursor present and return same instance', () => {
      const
          ctx = dataset.contexts[0],
          block = ctx.flows[0].blocks[0],
          runner = new FlowRunner(ctx, new BlockRunnerFactoryStore([
            ['MobilePrimitives\\Message', createStaticFirstExitBlockRunnerFor],]))

      const
          previousIntxId = 'some-fake-block-interaction-uuid',
          promptConfig: INumericPromptConfig & IBasePromptConfig = {
            kind: KnownPrompts.Numeric,
            prompt: 'What age are you at?',
            value: null,
            isResponseRequired: false,
            isSubmitted: false,
            max: 999,
            min: 999,},
          prevCursor = ctx.cursor = [previousIntxId, promptConfig],
          richCursor = runner.navigateTo(block, ctx),
          cursor = runner.dehydrateCursor(richCursor)

      expect(cursor).not.toEqual(prevCursor)
      expect(ctx.cursor).toEqual(cursor)
    })

    it('should have interactionId from newly created+pushed interaction', () => {
      const
          ctx = dataset.contexts[0],
          block = ctx.flows[0].blocks[0],
          runner = new FlowRunner(ctx, new BlockRunnerFactoryStore([
            ['MobilePrimitives\\Message', createStaticFirstExitBlockRunnerFor],]))

      const [interactionId,] = runner.navigateTo(block, ctx)
      expect(interactionId).toBe((last(ctx.interactions) as IBlockInteraction))
    })

    it('should have prompt from runner when provided', () => {
      const
          ctx = dataset.contexts[0],
          block = ctx.flows[0].blocks[0],
          messageBlockRunner = createStaticFirstExitBlockRunnerFor(block, ctx),

          runner = new FlowRunner(ctx, new BlockRunnerFactoryStore([
            ['MobilePrimitives\\Message', () => messageBlockRunner]])),

          startSpy = jest.spyOn(messageBlockRunner, 'initialize')
              .mockImplementation((): INumericPromptConfig & IBasePromptConfig => ({
                kind: KnownPrompts.Numeric,
                prompt: 'What age are you at?',
                value: null,
                isResponseRequired: false,
                isSubmitted: false,
                max: 999,
                min: 999,}))

      const
          richCursor: RichCursorType = runner.navigateTo(block, ctx),
          cursor = runner.dehydrateCursor(richCursor),
          expectedPrompt: INumericPromptConfig & IBasePromptConfig = startSpy.mock.results[0].value

      expect(cursor[1]).toBe(expectedPrompt)
    })

    it('should have null prompt from runner when null provided', () => {
      const
          ctx = dataset.contexts[0],
          block = ctx.flows[0].blocks[0],
          runner = new FlowRunner(ctx, new BlockRunnerFactoryStore([
            ['MobilePrimitives\\Message', createStaticFirstExitBlockRunnerFor],]))

      const [, prompt] = runner.navigateTo(block, ctx)
      expect(prompt).toBeUndefined()
    })
  })

  describe('interaction', () => {
    it('should have block provided', () => {
      const
          ctx = dataset.contexts[0],
          block = ctx.flows[0].blocks[0],
          runner = new FlowRunner(ctx, new BlockRunnerFactoryStore([
            ['MobilePrimitives\\Message', createStaticFirstExitBlockRunnerFor],]))

      expect(ctx.nestedFlowBlockInteractionIdStack.length).toBe(0)
      runner.navigateTo(block, ctx)
      expect(ctx.interactions[0].blockId).toBe(block.uuid)
    })

    describe('flowId', () => {
      it('should be from root flow when not nested', () => {
        const
            ctx = dataset.contexts[0],
            block = ctx.flows[0].blocks[0],
            runner = new FlowRunner(ctx, new BlockRunnerFactoryStore([
              ['MobilePrimitives\\Message', createStaticFirstExitBlockRunnerFor],]))

        expect(ctx.nestedFlowBlockInteractionIdStack.length).toBe(0)
        expect(ctx.firstFlowId).toBeTruthy()

        runner.navigateTo(block, ctx)
        expect(ctx.interactions[0].flowId).toBe(ctx.firstFlowId)
      })

      it('should be from nested flow when nested once', () => {
        const
            ctx = dataset.contexts[2], // RunFlow->(Message)->Message
            block = ctx.flows[1].blocks[0], // todo: actually, ths needs to be the first block on the nested flow!
            runner = new FlowRunner(ctx, new BlockRunnerFactoryStore([
              ['MobilePrimitives\\Message', createStaticFirstExitBlockRunnerFor],]))

        expect(ctx.nestedFlowBlockInteractionIdStack.length).toBe(1)
        expect(findInteractionWith(last(ctx.nestedFlowBlockInteractionIdStack) as string, ctx).flowId)
            .toBe(ctx.flows[0].uuid)

        runner.navigateTo(block, ctx)

        expect(ctx.interactions[1].flowId).toBe(ctx.flows[1].uuid)
      })

      it.todo('should be from deepest nested flow when deeply nested')
    })

    describe('originFlowId', () => {
      it('should be absent when on root flow', () => {
        const
            ctx = dataset.contexts[0],
            block = ctx.flows[0].blocks[0],
            runner = new FlowRunner(ctx, new BlockRunnerFactoryStore([
              ['MobilePrimitives\\Message', createStaticFirstExitBlockRunnerFor],]))

        expect(ctx.nestedFlowBlockInteractionIdStack.length).toBe(0)
        expect(ctx.interactions.length).toBe(0)

        runner.navigateTo(block, ctx)

        expect(ctx.interactions[0].originFlowId).toBeUndefined()
      })

      it('should be from root flow when nested once', () => {
        const
            ctx = dataset.contexts[2], // RunFlow->(Message)->Message
            block = ctx.flows[1].blocks[0],
            runner = new FlowRunner(ctx, new BlockRunnerFactoryStore([
              ['MobilePrimitives\\Message', createStaticFirstExitBlockRunnerFor],]))

        expect(ctx.nestedFlowBlockInteractionIdStack.length).toBe(1)
        expect(findInteractionWith(last(ctx.nestedFlowBlockInteractionIdStack) as string, ctx).flowId)
            .toBe(ctx.flows[0].uuid)

        runner.navigateTo(block, ctx)

        expect(ctx.interactions[1].originFlowId).toBe(ctx.flows[0].uuid)
      })

      it.todo('should be from deepest nested flow when deeply nested')
    })

    describe('originInteractionId', () => {
      it('should be absent when on root flow', () => {
        const
            ctx = dataset.contexts[0],
            block = ctx.flows[0].blocks[0],
            runner = new FlowRunner(ctx, new BlockRunnerFactoryStore([
              ['MobilePrimitives\\Message', createStaticFirstExitBlockRunnerFor],]))

        expect(ctx.nestedFlowBlockInteractionIdStack.length).toBe(0)
        expect(ctx.interactions.length).toBe(0)

        runner.navigateTo(block, ctx)

        expect(ctx.interactions[0].originBlockInteractionId).toBeUndefined()
      })

      it('should be from root flow\'s interaction when nested once', () => {
        const
            ctx = dataset.contexts[2], // RunFlow->(Message)->Message
            block = ctx.flows[1].blocks[0],
            runner = new FlowRunner(ctx, new BlockRunnerFactoryStore([
              ['MobilePrimitives\\Message', createStaticFirstExitBlockRunnerFor],]))

        expect(ctx.nestedFlowBlockInteractionIdStack.length).toBe(1)
        expect(findInteractionWith(last(ctx.nestedFlowBlockInteractionIdStack) as string, ctx).flowId)
            .toBe(ctx.flows[0].uuid)

        runner.navigateTo(block, ctx)

        expect(ctx.interactions[1].originBlockInteractionId).toBe(ctx.interactions[0].uuid)
      })

      it.todo('should be from deepest nested flow\'s interaction when deeply nested')
    })
  })

  describe('previous interaction', () => {
    it('should populate exitAt onto it when prev present', () => {
      const
          ctx = dataset.contexts[1],
          block = ctx.flows[1].blocks[0],
          runner = new FlowRunner(ctx, new BlockRunnerFactoryStore([
            ['MobilePrimitives\\Message', createStaticFirstExitBlockRunnerFor],])),
          lastIntx = last(ctx.interactions) as IBlockInteraction

      expect(ctx.interactions.length).toBeGreaterThan(0)
      expect(lastIntx.exitAt).toBeNull()
      runner.navigateTo(block, ctx)
      expect(lastIntx.exitAt).toBe(new Date().toISOString()) // todo: this is a fragile time-sensitive test; make it not so
    })
  })
})
