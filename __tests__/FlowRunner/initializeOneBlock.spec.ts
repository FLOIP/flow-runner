import {read} from 'yaml-import'
import IDataset from "../fixtures/IDataset";
import FlowRunner, {BlockRunnerFactoryStore} from "../../src/domain/FlowRunner";
import IBlockInteraction from "../../src/flow-spec/IBlockInteraction";
import {RichCursorType} from "../../src/flow-spec/IContext";
import {IBasePromptConfig, KnownPrompts} from "../../src/domain/prompt/IPrompt";
import {INumericPromptConfig} from "../../src"


describe('FlowRunner/initializeOneBlock', () => {
  let dataset: IDataset

  beforeEach(() => {
    dataset = read('__tests__/fixtures/dataset.yml')
  })

  it('should return cursor with empty prompt when prompt not provided', () => {
    const
        ctx = dataset.contexts[0],
        flow = ctx.flows[0],
        block = flow.blocks[0],
        runner = new FlowRunner(ctx, new BlockRunnerFactoryStore([
          ['MobilePrimitives\\Message', block => ({
            block,
            initialize: () => undefined,
            run: () => block.exits[0]
          })],
        ]))

    const [, prompt] = runner.initializeOneBlock(block, flow.uuid, undefined, undefined)
    expect(prompt).toBeUndefined()
  })

  it('should return cursor with prompt from runner when prompt provided', () => {
    let expectedPrompt: (INumericPromptConfig & IBasePromptConfig) | null = null // todo: this should use a jest.SpyInstance

    const
        ctx = dataset.contexts[0],
        flow = ctx.flows[0],
        block = flow.blocks[0],
        runner = new FlowRunner(ctx, new BlockRunnerFactoryStore([
          ['MobilePrimitives\\Message', block => ({
            block,
            initialize: (): INumericPromptConfig & IBasePromptConfig => expectedPrompt = {
              kind: KnownPrompts.Numeric,
              value: null,
              isResponseRequired: false,
              isSubmitted: false,
              max: 999,
              maxLength: 999,
              min: 999,},
            run: () => block.exits[0]
          })],
        ]))

    const
        richCursor: RichCursorType = runner.initializeOneBlock(block, flow.uuid, undefined, undefined),
        cursor = runner.dehydrateCursor(richCursor)

    expect(cursor[1]).toBe(expectedPrompt)
  })

  it('should return cursor with interaction for block + flow', () => {
    const
        ctx = dataset.contexts[0],
        flow = ctx.flows[0],
        block = flow.blocks[0],
        runner = new FlowRunner(ctx, new BlockRunnerFactoryStore([
          ['MobilePrimitives\\Message', block => ({
            block,
            initialize: () => undefined,
            run: () => block.exits[0] // todo: should we always call resume to get access to block exit? Is there a pattern here?
          })],
        ]))

    const [interaction] = runner.initializeOneBlock(block, flow.uuid, undefined, undefined)
    expect(interaction).toEqual(expect.objectContaining({blockId: block.uuid} as Partial<IBlockInteraction>))
    expect(interaction).toEqual(expect.objectContaining({flowId: flow.uuid} as Partial<IBlockInteraction>))
  })
})
