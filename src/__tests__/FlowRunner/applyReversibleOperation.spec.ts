import {FlowRunner, IBlockInteraction, IContext, IFlowRunner, IReversibleUpdateOperation} from '../..'

describe('applyReversibleDataOperation', () => {
  let runner: IFlowRunner
  let context: IContext
  let operation: IReversibleUpdateOperation

  beforeEach(() => {
    context = {
      interactions: [] as IBlockInteraction[],
      session_vars: {},
      reversible_operations: [] as IReversibleUpdateOperation[],
    } as IContext
    runner = new FlowRunner(context)
    operation = {
      forward: {$set: {'sampleKey.sampleNestedKey': 'sample forward val'}},
      reverse: {$set: {'sampleKey.sampleNestedKey': 'sample reverse val'}},
    }
  })

  it('should store the transaction on context', async () => {
    expect(context.reversible_operations).toHaveLength(0)
    runner.applyReversibleDataOperation(operation.forward, operation.reverse, context)
    expect(context).toHaveProperty('reversibleOperations.0.forward', operation.forward)
    expect(context).toHaveProperty('reversibleOperations.0.reverse', operation.reverse)
  })

  it('should populate a interactionId that this operation was executed as a part of', async () => {
    context.interactions.push({uuid: 'intx-123'} as IBlockInteraction)

    expect(context.reversible_operations).toHaveLength(0)
    runner.applyReversibleDataOperation(operation.forward, operation.reverse, context)
    expect(context).toHaveProperty('reversibleOperations.0.interactionId', 'intx-123')
  })

  it('should apply the forward operation', async () => {
    expect(context.session_vars).not.toHaveProperty('sampleKey.sampleNestedKey')
    runner.applyReversibleDataOperation(operation.forward, operation.reverse, context)
    expect(context.session_vars).toHaveProperty('sampleKey.sampleNestedKey', 'sample forward val')
  })

  it('should not apply the reversal operation', async () => {
    expect(context.session_vars).not.toHaveProperty('sampleKey.sampleNestedKey')
    runner.applyReversibleDataOperation(operation.forward, operation.reverse, context)
    expect(context.session_vars).not.toHaveProperty('sampleKey.sampleNestedKey', 'sample reverse val')
  })
})
