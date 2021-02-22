import {createDefaultDataset, IDataset} from '../fixtures/IDataset'
import {FlowRunner, ValidationException} from '../..'

describe('FlowRunner/stepInto', () => {
  let dataset: IDataset

  beforeEach(() => {
    dataset = createDefaultDataset()
  })

  it('should raise when block type is not RunFlow', async () => {
    const ctx = dataset.contexts[0]
    const block = ctx.flows[0].blocks[0]
    const runner = new FlowRunner(ctx)

    expect(FlowRunner.prototype.stepInto.bind(runner, block, ctx)).toThrow(ValidationException)
    expect(FlowRunner.prototype.stepInto.bind(runner, block, ctx)).toThrow('non-Core.RunFlow')
  })

  it("should raise when last interaction doesn't match provided block_id (aka only allow step ins during active interaction)", async () => {
    const ctx = dataset.contexts[2]
    const block = dataset._blocks[5] // dummy+empty RunFlow
    const runner = new FlowRunner(ctx)

    expect(FlowRunner.prototype.stepInto.bind(runner, block, ctx)).toThrow(ValidationException)
    expect(FlowRunner.prototype.stepInto.bind(runner, block, ctx)).toThrow("doesn't match last interaction")
  })

  it('should raise when interactions empty', async () => {
    const ctx = dataset.contexts[2]
    const block = ctx.flows[0].blocks[0]
    const runner = new FlowRunner(ctx)

    ctx.interactions = [] // setup for empty interactions
    expect(FlowRunner.prototype.stepInto.bind(runner, block, ctx)).toThrow(ValidationException)
    expect(FlowRunner.prototype.stepInto.bind(runner, block, ctx)).toThrow("hasn't yet been started")
  })

  it('should push run flow interaction onto nested flow block intx stack', async () => {
    const ctx = dataset.contexts[2]
    const block = ctx.flows[0].blocks[0]
    const runFlowBlockIntx = ctx.interactions[0]
    const runner = new FlowRunner(ctx)

    ctx.nested_flow_block_interaction_id_stack = [] // setup for known nested flow state
    runner.stepInto(block, ctx)
    expect(ctx.nested_flow_block_interaction_id_stack).toHaveLength(1)
    expect(ctx.nested_flow_block_interaction_id_stack[0]).toBe(runFlowBlockIntx.uuid)
  })

  describe('returned block', () => {
    it.todo('should return null when first block absent on freshly nested flow')
    it.todo('should return first block when first block present on freshly nested flow')
  })

  it("should leave run flow interaction's selected exit and exitAt empty until we've exited last block in the flow", async () => {
    const ctx = dataset.contexts[2]
    const block = ctx.flows[0].blocks[0]
    const runFlowBlockIntx = ctx.interactions[0]
    const runner = new FlowRunner(ctx)

    delete runFlowBlockIntx.selected_exit_id // setup for known incomplete + un-exited interaction state
    runner.stepInto(block, ctx)
    expect(runFlowBlockIntx.selected_exit_id).toBeUndefined()
  })
})
