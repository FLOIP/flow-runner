import {read} from 'yaml-import'
import IDataset from "../IDataset";
import FlowRunner from "../../src/domain/FlowRunner";
import IBlockRunner from "../../src/domain/runners/IBlockRunner";
import IBlock from "../../src/flow-spec/IBlock";
import IBlockInteraction from "../../src/flow-spec/IBlockInteraction";
import {RichCursorInputRequiredType} from "../../src/flow-spec/IContext";
import NumericPrompt from "../../src/domain/prompt/NumericPrompt";


describe('startOneBlock', () => {
  let dataset: IDataset

  beforeEach(() => {
    dataset = read('__tests__/dataset.yml')
  })

  it('should return cursor with empty prompt when prompt not provided', () => {
    const
        ctx = dataset.contexts[0],
        flow = ctx.flows[0],
        block = flow.blocks[0],
        runner = new FlowRunner(ctx, new Map<string, { (block: IBlock): IBlockRunner }>([
          ['MobilePrimitives\\Message', block => ({
            block,
            start: (interaction: IBlockInteraction) => null,
            resume: (cursor: RichCursorInputRequiredType) => block.exits[0]
          })],
        ]))

    const [, prompt] = runner.startOneBlock(block, flow.uuid, null, null)
    expect(prompt).toBeNull()
  })

  it('should return cursor with prompt from runner when prompt provided', () => {
    let expectedPrompt = null // todo: this should use a jest.SpyInstance

    const
        ctx = dataset.contexts[0],
        flow = ctx.flows[0],
        block = flow.blocks[0],
        runner = new FlowRunner(ctx, new Map<string, { (block: IBlock): IBlockRunner }>([
          ['MobilePrimitives\\Message', block => ({
            block,
            start: (interaction: IBlockInteraction) => expectedPrompt = new NumericPrompt(block.uuid, interaction.uuid, null),
            resume: (cursor: RichCursorInputRequiredType) => block.exits[0]
          })],
        ]))

    const [, prompt] = runner.startOneBlock(block, flow.uuid, null, null)
    expect(prompt).toBe(expectedPrompt)
  })

  it('should return cursor with interaction for block + flow', () => {
    const
        ctx = dataset.contexts[0],
        flow = ctx.flows[0],
        block = flow.blocks[0],
        runner = new FlowRunner(ctx, new Map<string, { (block: IBlock): IBlockRunner }>([
          ['MobilePrimitives\\Message', block => ({
            block,
            start: (interaction: IBlockInteraction) => null,
            resume: (cursor: RichCursorInputRequiredType) => block.exits[0] // todo: should we always call resume to get access to block exit? Is there a pattern here?
          })],
        ]))

    const [interaction] = runner.startOneBlock(block, flow.uuid, null, null)
    expect(interaction).toEqual(expect.objectContaining({blockId: block.uuid} as Partial<IBlockInteraction>))
    expect(interaction).toEqual(expect.objectContaining({flowId: flow.uuid} as Partial<IBlockInteraction>))
  })
})
