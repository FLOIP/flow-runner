import {last} from 'lodash'
import {read} from 'yaml-import'
import IDataset from "../fixtures/IDataset";
import FlowRunner, {BlockRunnerFactoryStore} from "../../src/domain/FlowRunner";
import IBlockInteraction from "../../src/flow-spec/IBlockInteraction";
import {findInteractionWith} from "../../src/flow-spec/IContext";
import NumericPrompt from "../../src/domain/prompt/NumericPrompt";
import IPrompt from "../../src/flow-spec/IPrompt";
import {PromptExpectationsType} from "../../src/domain/prompt/BasePrompt";
import {createStaticMessageBlockRunnerFor} from "../fixtures/BlockRunner";

// todo: abstract some of the setup

describe('FlowRunner/navigateTo', () => {
  let dataset: IDataset

  beforeEach(() => {
    dataset = read('__tests__/fixtures/dataset.yml')
  })

  it('should push an additional interaction onto context\'s interaction stack', () => {
    const
        ctx = dataset.contexts[0],
        block = ctx.flows[0].blocks[0],
        runner = new FlowRunner(ctx, new BlockRunnerFactoryStore([
          ['MobilePrimitives\\Message', createStaticMessageBlockRunnerFor],]))

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
            ['MobilePrimitives\\Message', createStaticMessageBlockRunnerFor],]))

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
            ['MobilePrimitives\\Message', createStaticMessageBlockRunnerFor],]))

      const
          previousIntxId = 'some-fake-block-interaction-uuid',
          prevCursor = ctx.cursor = [previousIntxId, new NumericPrompt(block.uuid, previousIntxId, null)],
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
            ['MobilePrimitives\\Message', createStaticMessageBlockRunnerFor],]))

      const [interactionId,] = runner.navigateTo(block, ctx)
      expect(interactionId).toBe((last(ctx.interactions) as IBlockInteraction))
    })

    it('should have prompt from runner when provided', () => {
      const
          ctx = dataset.contexts[0],
          block = ctx.flows[0].blocks[0],
          messageBlockRunner = createStaticMessageBlockRunnerFor(block),

          runner = new FlowRunner(ctx, new BlockRunnerFactoryStore([
            ['MobilePrimitives\\Message', block => messageBlockRunner]])),

          startSpy = jest.spyOn(messageBlockRunner, 'initialize')
              .mockImplementation((interaction: IBlockInteraction) =>
                  new NumericPrompt(block.uuid, interaction.uuid, null))

      const
          [, prompt] = runner.navigateTo(block, ctx),
          expectedPrompt: IPrompt<PromptExpectationsType> = startSpy.mock.results[0].value

      expect(prompt).toBe(expectedPrompt)
    })

    it('should have null prompt from runner when null provided', () => {
      const
          ctx = dataset.contexts[0],
          block = ctx.flows[0].blocks[0],
          runner = new FlowRunner(ctx, new BlockRunnerFactoryStore([
            ['MobilePrimitives\\Message', createStaticMessageBlockRunnerFor],]))

      const [, prompt] = runner.navigateTo(block, ctx)
      expect(prompt).toBeNull()
    })
  })

  describe('interaction', () => {
    it('should have block provided', () => {
      const
          ctx = dataset.contexts[0],
          block = ctx.flows[0].blocks[0],
          runner = new FlowRunner(ctx, new BlockRunnerFactoryStore([
            ['MobilePrimitives\\Message', createStaticMessageBlockRunnerFor],]))

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
              ['MobilePrimitives\\Message', createStaticMessageBlockRunnerFor],]))

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
              ['MobilePrimitives\\Message', createStaticMessageBlockRunnerFor],]))

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
              ['MobilePrimitives\\Message', createStaticMessageBlockRunnerFor],]))

        expect(ctx.nestedFlowBlockInteractionIdStack.length).toBe(0)
        expect(ctx.interactions.length).toBe(0)

        runner.navigateTo(block, ctx)

        expect(ctx.interactions[0].originFlowId).toBe(null)
      })

      it('should be from root flow when nested once', () => {
        const
            ctx = dataset.contexts[2], // RunFlow->(Message)->Message
            block = ctx.flows[1].blocks[0],
            runner = new FlowRunner(ctx, new BlockRunnerFactoryStore([
              ['MobilePrimitives\\Message', createStaticMessageBlockRunnerFor],]))

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
              ['MobilePrimitives\\Message', createStaticMessageBlockRunnerFor],]))

        expect(ctx.nestedFlowBlockInteractionIdStack.length).toBe(0)
        expect(ctx.interactions.length).toBe(0)

        runner.navigateTo(block, ctx)

        expect(ctx.interactions[0].originBlockInteractionId).toBe(null)
      })

      it('should be from root flow\'s interaction when nested once', () => {
        const
            ctx = dataset.contexts[2], // RunFlow->(Message)->Message
            block = ctx.flows[1].blocks[0],
            runner = new FlowRunner(ctx, new BlockRunnerFactoryStore([
              ['MobilePrimitives\\Message', createStaticMessageBlockRunnerFor],]))

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
            ['MobilePrimitives\\Message', createStaticMessageBlockRunnerFor],])),
          lastIntx = last(ctx.interactions) as IBlockInteraction

      expect(ctx.interactions.length).toBeGreaterThan(0)
      expect(lastIntx.exitAt).toBeNull()
      runner.navigateTo(block, ctx)
      expect(lastIntx.exitAt).toBeInstanceOf(Date)
    })
  })
})
