import FlowRunner, {BlockRunnerFactoryStore} from '../../domain/FlowRunner'
import IContext from '../../flow-spec/IContext'
import ValidationException from '../../domain/exceptions/ValidationException'
import IBlockInteraction from '../../flow-spec/IBlockInteraction'


describe('FlowRunner/findInteractionForActiveNestedFlow', () => {
  let runner: FlowRunner

  beforeEach(() => {
    runner = new FlowRunner({} as IContext, new BlockRunnerFactoryStore)
  })

  it('should bail when not nested', async () => {
    const ctx: IContext = {
      nestedFlowBlockInteractionIdStack: [] as string[]
    } as IContext

    expect(FlowRunner.prototype.findInteractionForActiveNestedFlow.bind(runner, ctx)).toThrow(ValidationException)
    expect(FlowRunner.prototype.findInteractionForActiveNestedFlow.bind(runner, ctx)).toThrow('Unable to find interaction for nested flow when not nested')
  })

  it('should bail when interaction not found (empty interactions)', async () => {
    const ctx: IContext = {
      nestedFlowBlockInteractionIdStack: ['abc-123'] as string[],
      interactions: [] as IBlockInteraction[],
    } as IContext

    expect(FlowRunner.prototype.findInteractionForActiveNestedFlow.bind(runner, ctx)).toThrow(ValidationException)
    expect(FlowRunner.prototype.findInteractionForActiveNestedFlow.bind(runner, ctx)).toThrow('Unable to find interaction for deepest flow nesting')
  })

  it('should bail when interaction not found (no matching uuid)', async () => {
    const ctx: IContext = {
      nestedFlowBlockInteractionIdStack: ['abc-123'] as string[],
      interactions: [{uuid: 'abc-111'}, {uuid: 'abc-222'}, {uuid: 'abc-333'}] as IBlockInteraction[],
    } as IContext

    expect(FlowRunner.prototype.findInteractionForActiveNestedFlow.bind(runner, ctx)).toThrow(ValidationException)
    expect(FlowRunner.prototype.findInteractionForActiveNestedFlow.bind(runner, ctx)).toThrow('Unable to find interaction for deepest flow nesting')
  })

  it('should return interaction matching deepest flow nesting', async () => {
    const deepestFlowIntx = {uuid: 'abc-123'}
    const ctx: IContext = {
      nestedFlowBlockInteractionIdStack: ['abc-123'] as string[],
      interactions: [{uuid: 'abc-111'}, deepestFlowIntx, {uuid: 'abc-333'}] as IBlockInteraction[],
    } as IContext

    expect(runner.findInteractionForActiveNestedFlow(ctx)).toBe(deepestFlowIntx)
  })
})