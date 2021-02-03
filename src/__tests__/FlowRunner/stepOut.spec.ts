import {createDefaultDataset, IDataset} from '../fixtures/IDataset'
import {ContextService, FlowRunner, IBlock, IBlockExit, IBlockInteraction, IContext, IContextService} from '../..'
import {cloneDeep, last} from 'lodash'

describe('FlowRunner/stepOut', () => {
  let dataset: IDataset

  beforeEach(() => {
    dataset = createDefaultDataset()
  })

  describe('when not nested', () => {
    it('should raise when attempting to unnest', async () => {
      const ctx = dataset.contexts[0]
      const runner = new FlowRunner(ctx)

      expect(ctx.nested_flow_block_interaction_id_stack).toHaveLength(0)
      expect(FlowRunner.prototype.stepOut.bind(runner, ctx)).toThrow('Unable to complete a nested flow when not nested.')
    })

    it('should leave last interaction as it is', async () => {
      const ctx = dataset.contexts[1]
      const lastIntx = cloneDeep(last(ctx.interactions))
      const runner = new FlowRunner(ctx)

      expect(ctx.nested_flow_block_interaction_id_stack).toHaveLength(0)

      try {
        runner.stepOut(ctx)
      } catch (e) {
        /* do nothing */
      }

      expect(last(ctx.interactions)).toEqual(lastIntx)
    })
  })

  describe('when nested', () => {
    it("should raise when attempting to unnest and unable to find interaction we're nested under", () => {
      const runner = new FlowRunner({} as IContext)
      const ctx = {
        nested_flow_block_interaction_id_stack: ['non-existant-interactionId'],
        interactions: [] as IBlockInteraction[],
      } as IContext

      expect(FlowRunner.prototype.stepOut.bind(runner, ctx)).toThrow(
        'Unable to find interaction on context: non-existant-interactionId in []'
      )
    })

    it('should unnest (aka: pop last interaction off nested flow interaction stack)', async () => {
      const ctx = dataset.contexts[2]
      const snapshottedNFBIStack = cloneDeep(ctx.nested_flow_block_interaction_id_stack)
      const runner = new FlowRunner(ctx)

      expect(ctx.nested_flow_block_interaction_id_stack.length).toBeGreaterThan(0)
      runner.stepOut(ctx)
      expect(ctx.nested_flow_block_interaction_id_stack).toEqual(snapshottedNFBIStack.slice(0, -1))
    })

    it("should leave active interaction's selected exit as null to indicate we've finished executing the flow", async () => {
      const ctx = dataset.contexts[2]

      ctx.interactions.push(
        dataset._block_interactions.find(({uuid}) => uuid === '1c7317fc-b644-4da4-b1ff-1807ce55c17e') as IBlockInteraction
      )

      const activeIntx = last(ctx.interactions) as IBlockInteraction
      const runner = new FlowRunner(ctx)

      expect(ctx.nested_flow_block_interaction_id_stack.length).toBeGreaterThan(0)

      // pre-condition for "not-yet-stepped-out" state
      delete activeIntx.selectedExitId
      runner.stepOut(ctx)

      // todo: incorrect; needs to be a concrete exit with a null destinationBlock --- @bzabos: I believe this is resolved as of latest nestedFlow refactor.
      expect(activeIntx.selectedExitId).toBeUndefined()
    })

    it("should tie run flow block's intx associated with provided run flow block to its first exit", async () => {
      // needs: [a, b, run-flow-intx, nested-flow-intx-a, nested-flow-intx-b, <<step-out>>]
      const originFlowId = 'flow-123'

      // last( nestedFlowBlockInteractionStack )
      const originBlockInteractionId = 'intx-345'
      const runFlowBlock = {
        uuid: 'block-123',
        exits: [{uuid: 'exit-123', destination_block: 'block-234'} as IBlockExit],
      } as IBlock
      const runFlowBlockIntx: IBlockInteraction = {
        uuid: originBlockInteractionId,
        blockId: 'block-123',
      } as IBlockInteraction
      const interactions: IBlockInteraction[] = [
        // intx-a
        {uuid: 'intx-123'},
        // intx-b
        {uuid: 'intx-234'},
        // run-flow-intx
        runFlowBlockIntx,
        // nested-flow-intx-a
        {uuid: 'intx-456', originFlowId, originBlockInteractionId},
        // nested-flow-intx-b
        {uuid: 'intx-567', originFlowId, originBlockInteractionId},
        // << (step out)
      ] as IBlockInteraction[]

      const runner = new FlowRunner({} as IContext)
      runner._contextService = Object.assign({}, ContextService, {
        findBlockOnActiveFlowWith(_uuid: string, ctx: IContext): IBlock {
          return ctx.flows[0].blocks.find(({uuid}) => _uuid === uuid) as IBlock
        },
      } as Partial<IContextService>)

      runner.stepOut({
        flows: [
          {
            uuid: originFlowId,
            blocks: [runFlowBlock, {uuid: 'block-234'} as IBlock],
          },
        ],
        interactions,
        first_flow_id: originFlowId,
        nested_flow_block_interaction_id_stack: [originBlockInteractionId],
      } as IContext)

      expect(runFlowBlockIntx.selectedExitId).toBe(runFlowBlock.exits[0].uuid)
    })

    describe('connecting block', () => {
      it('should return block last RunFlow was connected to in original flow', async () => {
        const ctx = dataset.contexts[2]
        const lastRunFlowBlock = ctx.flows[0].blocks[0]
        const runFlowDestinationBlock = ctx.flows[0].blocks[1]
        const runner = new FlowRunner(ctx)

        expect(ctx.nested_flow_block_interaction_id_stack.length).toBeGreaterThan(0)
        expect(lastRunFlowBlock.exits[0].destination_block).toBe(runFlowDestinationBlock.uuid)
        const nextBlock = runner.stepOut(ctx)
        expect(nextBlock).toBe(runFlowDestinationBlock)
      })

      it('should return null if last RunFlow was end of original flow', async () => {
        const ctx = dataset.contexts[2]
        const lastRunFlowBlock = ctx.flows[0].blocks[0]
        const runner = new FlowRunner(ctx)

        delete lastRunFlowBlock.exits[0].destination_block

        expect(ctx.nested_flow_block_interaction_id_stack.length).toBeGreaterThan(0)
        expect(lastRunFlowBlock.exits[0].destination_block).toBeUndefined()
        const nextBlock = runner.stepOut(ctx)
        expect(nextBlock).toBeUndefined()
      })
    })
  })
})
