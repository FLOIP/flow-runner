import IDataset, {createDefaultDataset} from '../fixtures/IDataset'
import FlowRunner, {BlockRunnerFactoryStore} from "../../domain/FlowRunner";
import {IContextInputRequired} from '../../index';
import {createStaticFirstExitBlockRunnerFor} from "../fixtures/BlockRunner";


describe('FlowRunner/runActiveBlockOn', () => {
  let dataset: IDataset

  beforeEach(() => {
    dataset = createDefaultDataset()
  })

  it('should return exit provided by block runner\'s resume()', async () => {
    const
        ctx = dataset.contexts[1] as IContextInputRequired,
        block = ctx.flows[1].blocks[0],
        expectedExit = block.exits[0],
        runner = new FlowRunner(ctx, new BlockRunnerFactoryStore([
          ['MobilePrimitives\\Message', createStaticFirstExitBlockRunnerFor],]))

    const
        richCursor = runner.hydrateRichCursorFrom(ctx),
        exit = await runner.runActiveBlockOn(richCursor, block)

    expect(exit).toBe(expectedExit)
  })

  it('should set interaction selected exit id', async () => {
    const
      ctx = dataset.contexts[1] as IContextInputRequired,
      block = ctx.flows[1].blocks[0],
      expectedExit = block.exits[0],
      runner = new FlowRunner(ctx, new BlockRunnerFactoryStore([
        ['MobilePrimitives\\Message', createStaticFirstExitBlockRunnerFor],])),
      richCursor = runner.hydrateRichCursorFrom(ctx)

    richCursor.interaction.selectedExitId = null // set as incomplete interaction state

    await runner.runActiveBlockOn(richCursor, block)
    expect(richCursor.interaction.selectedExitId).toBe(expectedExit.uuid)
  })

  describe('when prompt present', () => {
    it('should flag on prompt as having been submitted + accepted by the flow runner', async () => {
      const
        ctx = dataset.contexts[1] as IContextInputRequired,
        block = ctx.flows[1].blocks[0],
        runner = new FlowRunner(ctx, new BlockRunnerFactoryStore([
          ['MobilePrimitives\\Message', createStaticFirstExitBlockRunnerFor],]))

      expect(ctx.cursor.promptConfig.isSubmitted).toBeFalsy()
      await runner.runActiveBlockOn(runner.hydrateRichCursorFrom(ctx), block)
      expect(ctx.cursor.promptConfig.isSubmitted).toBeTruthy()
    })

    it('should set interaction value from prompt', async () => {
      const
        ctx = dataset.contexts[1] as IContextInputRequired,
        block = ctx.flows[1].blocks[0],
        runner = new FlowRunner(ctx, new BlockRunnerFactoryStore([
          ['MobilePrimitives\\Message', createStaticFirstExitBlockRunnerFor],])),
        richCursor = runner.hydrateRichCursorFrom(ctx)

      delete richCursor.interaction.value // setup to ensure we get a value during run

      await runner.runActiveBlockOn(richCursor, block)
      expect(richCursor.interaction.value).toBeNull() // `null` is the value from the prompt
    })

    it('should set interaction hasResponse to true', async() => {
      const
        ctx = dataset.contexts[1] as IContextInputRequired,
        block = ctx.flows[1].blocks[0],
        runner = new FlowRunner(ctx, new BlockRunnerFactoryStore([
          ['MobilePrimitives\\Message', createStaticFirstExitBlockRunnerFor],])),
        richCursor = runner.hydrateRichCursorFrom(ctx)

      expect(richCursor.interaction.hasResponse).toBeFalsy()
      await runner.runActiveBlockOn(richCursor, block)
      expect(richCursor.interaction.hasResponse).toBeTruthy()
    })
  })
})
