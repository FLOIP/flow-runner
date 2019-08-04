import {read} from 'yaml-import'
import IDataset from "../IDataset";
import FlowRunner, {BlockRunnerFactoryStore} from "../../src/domain/FlowRunner";
import IBlockInteraction from "../../src/flow-spec/IBlockInteraction";
import {IContextInputRequired, RichCursorInputRequiredType} from "../../src/flow-spec/IContext";
import NumericPrompt from "../../src/domain/prompt/NumericPrompt";


describe('FlowRunner/resumeOneBlock', () => {
  let dataset: IDataset

  beforeEach(() => {
    dataset = read('__tests__/dataset.yml')
  })

  it('should return exit provided by block runner\'s resume()', () => {
    const
        ctx = dataset.contexts[1] as IContextInputRequired,
        block = ctx.flows[1].blocks[0],
        expectedExit = block.exits[0],
        runner = new FlowRunner(ctx, new BlockRunnerFactoryStore([ // todo: reuse fixture from navigateTo().spec
          ['MobilePrimitives\\Message', block => ({
            block,
            start: (interaction: IBlockInteraction) => null,
            resume: (cursor: RichCursorInputRequiredType) => expectedExit
          })],
        ]))

    ctx.cursor[1] = new NumericPrompt(block.uuid, ctx.cursor[0], null) // setup b/c we don't yet have a 100% serializable prompt

    const exit = runner.resumeOneBlock(block, ctx)
    expect(exit).toBe(expectedExit)
  })
})