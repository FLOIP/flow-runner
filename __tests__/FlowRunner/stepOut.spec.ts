import IDataset, {createDefaultDataset} from '../../__test_fixtures__/fixtures/IDataset'
import FlowRunner, {BlockRunnerFactoryStore} from '../../src/domain/FlowRunner'
import {cloneDeep, last} from 'lodash'
import IBlockInteraction from '../../src/flow-spec/IBlockInteraction'

describe('FlowRunner/stepOut', () => {
  let dataset: IDataset

  beforeEach(() => {
    dataset = createDefaultDataset()
  })

  describe('when not nested', () => {
    it('should return null when not nested', () => {
      const
          ctx = dataset.contexts[0],
          runner = new FlowRunner(ctx, new BlockRunnerFactoryStore)

      expect(ctx.nestedFlowBlockInteractionIdStack.length).toBe(0)
      expect(runner.stepOut(ctx)).toBeUndefined()
    })

    it('should leave last interaction as it is', () => {
      const
          ctx = dataset.contexts[1],
          lastIntx = cloneDeep(last(ctx.interactions)),
          runner = new FlowRunner(ctx, new BlockRunnerFactoryStore)

      expect(ctx.nestedFlowBlockInteractionIdStack.length).toBe(0)
      runner.stepOut(ctx)
      expect(last(ctx.interactions)).toEqual(lastIntx)
    })
  })

  describe('when nested', () => {
    it('should pop last interaction off nested flow interaction stack', () => {
      const
          ctx = dataset.contexts[2],
          snapshottedNFBIStack = cloneDeep(ctx.nestedFlowBlockInteractionIdStack),
          runner = new FlowRunner(ctx, new BlockRunnerFactoryStore)

      expect(ctx.nestedFlowBlockInteractionIdStack.length).toBeGreaterThan(0)
      runner.stepOut(ctx)
      expect(ctx.nestedFlowBlockInteractionIdStack).toEqual(snapshottedNFBIStack.slice(0, -1))
    })

    it('should leave active interaction\'s selected exit as null to indicate we\'ve finished executing the flow', () => {
      const
          ctx = dataset.contexts[2],
          activeIntx = last(ctx.interactions) as IBlockInteraction,
          runner = new FlowRunner(ctx, new BlockRunnerFactoryStore)

      expect(ctx.nestedFlowBlockInteractionIdStack.length).toBeGreaterThan(0)
      activeIntx.details.selectedExitId = null // pre-condition for "not-yet-stepped-out" state
      runner.stepOut(ctx)
      expect(activeIntx.details.selectedExitId).toBe(null)
    })

    describe('connecting block', () => {
      it('should return block last RunFlow was connected to in original flow', () => {
        const
          ctx = dataset.contexts[2],
          lastRunFlowBlock = ctx.flows[0].blocks[0],
          runFlowDestinationBlock = ctx.flows[0].blocks[1],
          runner = new FlowRunner(ctx, new BlockRunnerFactoryStore)

        expect(ctx.nestedFlowBlockInteractionIdStack.length).toBeGreaterThan(0)
        expect(lastRunFlowBlock.exits[0].destinationBlock).toBe(runFlowDestinationBlock.uuid)
        const nextBlock = runner.stepOut(ctx)
        expect(nextBlock).toBe(runFlowDestinationBlock)
      })

      it('should return null if last RunFlow was end of original flow', () => {
        const
          ctx = dataset.contexts[2],
          lastRunFlowBlock = ctx.flows[0].blocks[0],
          runner = new FlowRunner(ctx, new BlockRunnerFactoryStore)

        delete lastRunFlowBlock.exits[0].destinationBlock

        expect(ctx.nestedFlowBlockInteractionIdStack.length).toBeGreaterThan(0)
        expect(lastRunFlowBlock.exits[0].destinationBlock).toBeUndefined()
        const nextBlock = runner.stepOut(ctx)
        expect(nextBlock).toBeUndefined()
      })
    })
  })
})