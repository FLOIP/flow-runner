import {read} from 'yaml-import'
import IDataset from "../fixtures/IDataset";
import FlowRunner, {BlockRunnerFactoryStore} from "../../src/domain/FlowRunner";
import {IContextInputRequired} from "../../src/flow-spec/IContext";
import NumericPrompt from "../../src/domain/prompt/NumericPrompt";
import {createStaticMessageBlockRunnerFor} from "../fixtures/BlockRunner";


describe('FlowRunner/runActiveBlockOn', () => {
  let dataset: IDataset

  beforeEach(() => {
    dataset = read('__tests__/fixtures/dataset.yml')
  })

  it('should return exit provided by block runner\'s resume()', () => {
    const
        ctx = dataset.contexts[1] as IContextInputRequired,
        block = ctx.flows[1].blocks[0],
        expectedExit = block.exits[0],
        runner = new FlowRunner(ctx, new BlockRunnerFactoryStore([
          ['MobilePrimitives\\Message', createStaticMessageBlockRunnerFor],]))

    ctx.cursor[1] = new NumericPrompt(block.uuid, ctx.cursor[0], null) // setup b/c we don't yet have a 100% serializable prompt
    const richCursor = runner.hydrateRichCursorFrom(ctx)

    const exit = runner.runActiveBlockOn(richCursor, block)
    expect(exit).toBe(expectedExit)
  })

  it('should flag prompt as having been submitted + accepted by the flow runner', () => {
    const
        ctx = dataset.contexts[1] as IContextInputRequired,
        block = ctx.flows[1].blocks[0],
        runner = new FlowRunner(ctx, new BlockRunnerFactoryStore([
          ['MobilePrimitives\\Message', createStaticMessageBlockRunnerFor],])),
        prompt = new NumericPrompt(block.uuid, ctx.cursor[0], null)

    ctx.cursor[1] = prompt // setup b/c we don't yet have a 100% serializable prompt

    expect(prompt.isSubmitted).toBeFalsy()
    runner.runActiveBlockOn(runner.hydrateRichCursorFrom(ctx), block)
    expect(prompt.isSubmitted).toBeTruthy()
  })
})
