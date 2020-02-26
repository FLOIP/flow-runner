import IDataset, {createDefaultDataset} from '../../__test_fixtures__/fixtures/IDataset'
import FlowRunner from '../../src/domain/FlowRunner'
import {cloneDeep, last} from 'lodash'
import IBlockInteraction from '../../src/flow-spec/IBlockInteraction'
import IContext, {IContextService} from '../../src/flow-spec/IContext'
import IBlock from '../../src/flow-spec/IBlock'
import IBlockExit from '../../src/flow-spec/IBlockExit'
import * as contextService from '../../src/flow-spec/IContext'

describe('FlowRunner/stepOut', () => {
  let dataset: IDataset

  beforeEach(() => {
    dataset = createDefaultDataset()
  })

  describe('when not nested', () => {
    it('should return null when not nested', async () => {
      const
          ctx = dataset.contexts[0],
          runner = new FlowRunner(ctx)

      expect(ctx.nestedFlowBlockInteractionIdStack.length).toBe(0)
      expect(runner.stepOut(ctx)).toBeUndefined()
    })

    it('should leave last interaction as it is', async () => {
      const
          ctx = dataset.contexts[1],
          lastIntx = cloneDeep(last(ctx.interactions)),
          runner = new FlowRunner(ctx)

      expect(ctx.nestedFlowBlockInteractionIdStack.length).toBe(0)
      runner.stepOut(ctx)
      expect(last(ctx.interactions)).toEqual(lastIntx)
    })
  })

  describe('when nested', () => {
    it('should pop last interaction off nested flow interaction stack', async () => {
      const
          ctx = dataset.contexts[2],
          snapshottedNFBIStack = cloneDeep(ctx.nestedFlowBlockInteractionIdStack),
          runner = new FlowRunner(ctx)

      expect(ctx.nestedFlowBlockInteractionIdStack.length).toBeGreaterThan(0)
      runner.stepOut(ctx)
      expect(ctx.nestedFlowBlockInteractionIdStack).toEqual(snapshottedNFBIStack.slice(0, -1))
    })

    it('should leave active interaction\'s selected exit as null to indicate we\'ve finished executing the flow', async () => {
      const
          ctx = dataset.contexts[2]

      ctx.interactions.push(
        dataset._block_interactions.find(({uuid}) =>
          uuid === '1c7317fc-b644-4da4-b1ff-1807ce55c17e') as IBlockInteraction)

      const
        activeIntx = last(ctx.interactions) as IBlockInteraction,
        runner = new FlowRunner(ctx)

      expect(ctx.nestedFlowBlockInteractionIdStack.length).toBeGreaterThan(0)
      activeIntx.selectedExitId = null // pre-condition for "not-yet-stepped-out" state
      runner.stepOut(ctx)

      // todo: incorrect; needs to be a concrete exit with a null destinationBlock
      expect(activeIntx.selectedExitId).toBe(null)
    })

    it('should tie run flow block\'s intx associated with provided run flow block to its first exit', async () => {
      // needs: [a, b, run-flow-intx, nested-flow-intx-a, nested-flow-intx-b, <<step-out>>]
      const originFlowId = 'flow-123'
      const originBlockInteractionId = 'intx-345' // last( nestedFlowBlockInteractionStack )
      const runFlowBlock = {uuid: 'block-123', exits: [{uuid: 'exit-123', destinationBlock: 'block-234'} as IBlockExit]} as IBlock
      const runFlowBlockIntx: IBlockInteraction = {uuid: originBlockInteractionId, blockId: 'block-123'} as IBlockInteraction
      const interactions: IBlockInteraction[] = [
        {uuid: 'intx-123'}, // intx-a
        {uuid: 'intx-234'}, // intx-b
        runFlowBlockIntx, // run-flow-intx
        {uuid: 'intx-456', originFlowId, originBlockInteractionId}, // nested-flow-intx-a
        {uuid: 'intx-567', originFlowId, originBlockInteractionId}, // nested-flow-intx-b
                                                                    // << (step out)
      ] as IBlockInteraction[]

      const runner = new FlowRunner({} as IContext)
      runner._contextService = Object.assign({}, contextService, {
        findBlockOnActiveFlowWith(_uuid: string, ctx: IContext): IBlock {
          return ctx.flows[0].blocks.find(({uuid}) => _uuid === uuid) as IBlock
        },
      } as Partial<IContextService>)

      runner.stepOut({
        flows: [{
          uuid: originFlowId,
          blocks: [
            runFlowBlock,
            {uuid: 'block-234'} as IBlock]}],
        interactions,
        nestedFlowBlockInteractionIdStack: [originBlockInteractionId]} as IContext)

      expect(runFlowBlockIntx.selectedExitId).toBe(runFlowBlock.exits[0].uuid)
    })

    it.todo('should reconcile exit at timestamps somehow') // todo: verify this

    describe('connecting block', () => {
      it('should return block last RunFlow was connected to in original flow', async () => {
        const
          ctx = dataset.contexts[2],
          lastRunFlowBlock = ctx.flows[0].blocks[0],
          runFlowDestinationBlock = ctx.flows[0].blocks[1],
          runner = new FlowRunner(ctx)

        expect(ctx.nestedFlowBlockInteractionIdStack.length).toBeGreaterThan(0)
        expect(lastRunFlowBlock.exits[0].destinationBlock).toBe(runFlowDestinationBlock.uuid)
        const nextBlock = runner.stepOut(ctx)
        expect(nextBlock).toBe(runFlowDestinationBlock)
      })

      it('should return null if last RunFlow was end of original flow', async () => {
        const
          ctx = dataset.contexts[2],
          lastRunFlowBlock = ctx.flows[0].blocks[0],
          runner = new FlowRunner(ctx)

        delete lastRunFlowBlock.exits[0].destinationBlock

        expect(ctx.nestedFlowBlockInteractionIdStack.length).toBeGreaterThan(0)
        expect(lastRunFlowBlock.exits[0].destinationBlock).toBeUndefined()
        const nextBlock = runner.stepOut(ctx)
        expect(nextBlock).toBeUndefined()
      })
    })
  })
})