import IDataset, {createDefaultDataset} from '../../__test_fixtures__/fixtures/IDataset'
import FlowRunner from "../../src/domain/FlowRunner";
import ValidationException from "../../src/domain/exceptions/ValidationException";


describe('FlowRunner/stepInto', () => {
  let dataset: IDataset

  beforeEach(() => {
    dataset = createDefaultDataset()
  })

  it('should raise when block type is not RunFlow', () => {
    const
        ctx = dataset.contexts[0],
        block = ctx.flows[0].blocks[0],
        runner = new FlowRunner(ctx)

    expect(FlowRunner.prototype.stepInto.bind(runner, block, ctx))
        .toThrow(ValidationException)
    expect(FlowRunner.prototype.stepInto.bind(runner, block, ctx))
        .toThrow('non-Core\\RunFlow')
  })

  it('should raise when last interaction doesn\'t match provided blockId (aka only allow step ins during active interaction)', () => {
    const
        ctx = dataset.contexts[2],
        block = dataset._blocks[5], // dummy+empty RunFlow
        runner = new FlowRunner(ctx)

    expect(FlowRunner.prototype.stepInto.bind(runner, block, ctx))
        .toThrow(ValidationException)
    expect(FlowRunner.prototype.stepInto.bind(runner, block, ctx))
        .toThrow('doesn\'t match last interaction')
  })

  it('should raise when interactions empty', () => {
    const
        ctx = dataset.contexts[2],
        block = ctx.flows[0].blocks[0],
        runner = new FlowRunner(ctx)

    ctx.interactions = [] // setup for empty interactions
    expect(FlowRunner.prototype.stepInto.bind(runner, block, ctx))
        .toThrow(ValidationException)
    expect(FlowRunner.prototype.stepInto.bind(runner, block, ctx))
        .toThrow('hasn\'t yet been started')
  })

  it('should push run flow interaction onto nested flow block intx stack', () => {
    const
        ctx = dataset.contexts[2],
        block = ctx.flows[0].blocks[0],
        runFlowBlockIntx = ctx.interactions[0],
        runner = new FlowRunner(ctx)

    ctx.nestedFlowBlockInteractionIdStack = [] // setup for known nested flow state
    runner.stepInto(block, ctx)
    expect(ctx.nestedFlowBlockInteractionIdStack.length).toBe(1)
    expect(ctx.nestedFlowBlockInteractionIdStack[0]).toBe(runFlowBlockIntx.uuid)
  })

  describe('returned block', () => {
    it.todo('should return null when first block absent on freshly nested flow')
    it.todo('should return first block when first block present on freshly nested flow')
  })

  it('should tie intx associated with provided run flow block to its first exit', () => {
    const
      ctx = dataset.contexts[2],
      block = ctx.flows[0].blocks[0],
      runFlowBlockIntx = ctx.interactions[0],
      runner = new FlowRunner(ctx)

    runner.stepInto(block, ctx)
    expect(runFlowBlockIntx.selectedExitId).toBe(block.exits[0].uuid)
  })
})
