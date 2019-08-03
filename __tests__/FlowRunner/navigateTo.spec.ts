import {last} from 'lodash'
import {read} from 'yaml-import'
import IDataset from "../IDataset";
import FlowRunner, {BlockRunnerFactoryStore} from "../../src/domain/FlowRunner";
import IBlockRunner from "../../src/domain/runners/IBlockRunner";
import IBlock from "../../src/flow-spec/IBlock";
import IBlockInteraction from "../../src/flow-spec/IBlockInteraction";
import {RichCursorInputRequiredType} from "../../src/flow-spec/IContext";
import NumericPrompt from "../../src/domain/prompt/NumericPrompt";
import IPrompt from "../../src/flow-spec/IPrompt";
import {PromptExpectationsType} from "../../src/domain/prompt/BasePrompt";


describe('FlowRunner/navigateTo', () => {
  let dataset: IDataset

  beforeEach(() => {
    dataset = read('__tests__/dataset.yml')
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
      const cursor = runner.navigateTo(block, ctx)
      expect(cursor).toBeTruthy()
      expect(ctx.cursor).toBe(cursor)
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
          cursor = runner.navigateTo(block, ctx)

      expect(cursor).not.toBe(prevCursor)
      expect(ctx.cursor).toBe(cursor)
    })

    it('should have interaction id from newly created+pushed interaction', () => {
      const
          ctx = dataset.contexts[0],
          block = ctx.flows[0].blocks[0],
          runner = new FlowRunner(ctx, new BlockRunnerFactoryStore([
            ['MobilePrimitives\\Message', createStaticMessageBlockRunnerFor],]))

      const [interactionId,] = runner.navigateTo(block, ctx)
      expect(interactionId).toBe((last(ctx.interactions) as IBlockInteraction).uuid)
    })

    it('should have prompt from runner when provided', () => {
      const
          ctx = dataset.contexts[0],
          block = ctx.flows[0].blocks[0],
          messageBlockRunner = createStaticMessageBlockRunnerFor(block),

          runner = new FlowRunner(ctx, new BlockRunnerFactoryStore([
            ['MobilePrimitives\\Message', block => messageBlockRunner]])),

          startSpy = jest.spyOn(messageBlockRunner, 'start')
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
    it('should have flow id from root flow when not nested')
    it('should have flow id from deepest nested flow when nested')

    it('should have origin interaction id absent when on root flow')
    it('should have origin interaction id from root flow when nested once')
    it('should have origin interaction id from parent flow when nested > once')

    it('should have block provided')
  })

  it('should populate exitAt onto previous interaction when present')
})


const createStaticMessageBlockRunnerFor = (block: IBlock) => ({
  block,
  start: (interaction: IBlockInteraction) => null,
  resume: (cursor: RichCursorInputRequiredType) => block.exits[0]
} as IBlockRunner)
