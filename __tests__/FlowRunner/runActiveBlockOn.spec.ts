import IDataset, {createDefaultDataset} from '../../__test_fixtures__/fixtures/IDataset'
import FlowRunner, {BlockRunnerFactoryStore} from "../../src/domain/FlowRunner";
import {IContextInputRequired} from '../../src';
import {createStaticFirstExitBlockRunnerFor} from "../../__test_fixtures__/fixtures/BlockRunner";


describe('FlowRunner/runActiveBlockOn', () => {
  let dataset: IDataset

  beforeEach(() => {
    dataset = createDefaultDataset()
  })

  it('should return exit provided by block runner\'s resume()', () => {
    const
        ctx = dataset.contexts[1] as IContextInputRequired,
        block = ctx.flows[1].blocks[0],
        expectedExit = block.exits[0],
        runner = new FlowRunner(ctx, new BlockRunnerFactoryStore([
          ['MobilePrimitives\\Message', createStaticFirstExitBlockRunnerFor],]))

    const
        richCursor = runner.hydrateRichCursorFrom(ctx),
        exit = runner.runActiveBlockOn(richCursor, block)

    expect(exit).toBe(expectedExit)
  })

  it('should set interaction selected exit id', () => {
    const
      ctx = dataset.contexts[1] as IContextInputRequired,
      block = ctx.flows[1].blocks[0],
      expectedExit = block.exits[0],
      runner = new FlowRunner(ctx, new BlockRunnerFactoryStore([
        ['MobilePrimitives\\Message', createStaticFirstExitBlockRunnerFor],])),
      richCursor = runner.hydrateRichCursorFrom(ctx)

    richCursor.interaction.selectedExitId = null // set as incomplete interaction state

    runner.runActiveBlockOn(richCursor, block)
    expect(richCursor.interaction.selectedExitId).toBe(expectedExit.uuid)
  })

  describe('when prompt present', () => {
    it('should flag on prompt as having been submitted + accepted by the flow runner', () => {
      const
        ctx = dataset.contexts[1] as IContextInputRequired,
        block = ctx.flows[1].blocks[0],
        runner = new FlowRunner(ctx, new BlockRunnerFactoryStore([
          ['MobilePrimitives\\Message', createStaticFirstExitBlockRunnerFor],]))

      expect(ctx.cursor.promptConfig.isSubmitted).toBeFalsy()
      runner.runActiveBlockOn(runner.hydrateRichCursorFrom(ctx), block)
      expect(ctx.cursor.promptConfig.isSubmitted).toBeTruthy()
    })

    it('should set interaction value from prompt', () => {
      const
        ctx = dataset.contexts[1] as IContextInputRequired,
        block = ctx.flows[1].blocks[0],
        runner = new FlowRunner(ctx, new BlockRunnerFactoryStore([
          ['MobilePrimitives\\Message', createStaticFirstExitBlockRunnerFor],])),
        richCursor = runner.hydrateRichCursorFrom(ctx)

      delete richCursor.interaction.value // setup to ensure we get a value during run

      runner.runActiveBlockOn(richCursor, block)
      expect(richCursor.interaction.value).toBeNull() // `null` is the value from the prompt
    })

    it('should set interaction hasResponse to true', () => {
      const
        ctx = dataset.contexts[1] as IContextInputRequired,
        block = ctx.flows[1].blocks[0],
        runner = new FlowRunner(ctx, new BlockRunnerFactoryStore([
          ['MobilePrimitives\\Message', createStaticFirstExitBlockRunnerFor],])),
        richCursor = runner.hydrateRichCursorFrom(ctx)

      expect(richCursor.interaction.hasResponse).toBeFalsy()
      runner.runActiveBlockOn(richCursor, block)
      expect(richCursor.interaction.hasResponse).toBeTruthy()
    })
  })
})
