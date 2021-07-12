import {first, last} from 'lodash'
import {
  BacktrackingBehaviour,
  BasicBacktrackingBehaviour,
  IBlock,
  IBlockInteraction,
  IContext,
  IFlow,
  IPrompt,
  NON_INTERACTIVE_BLOCK_TYPES,
  PeekDirection,
} from '../..'

describe('BasicBacktrackingBehaviour', () => {
  let backtracking: BasicBacktrackingBehaviour

  beforeEach(() => {
    backtracking = new BasicBacktrackingBehaviour(
      {vendor_metadata: {}} as IContext,
      {navigateTo: async (_b, _c) => ({interaction: {} as IBlockInteraction, prompt: undefined})},
      {
        buildPromptFor: async (_b: IBlock, _i: IBlockInteraction): Promise<IPrompt | undefined> => undefined,
      }
    )
  })

  describe('peek', () => {
    let virtualPrompt: IPrompt

    beforeEach(() => {
      backtracking.context = {
        interactions: [
          // assumption: all of these are interactive
          {uuid: 'intx-123'},
          {uuid: 'intx-234'},
          {uuid: 'intx-345', flow_id: 'flow-123', block_id: 'block-123', value: 'value #345'},
          {uuid: 'intx-456'},
          {uuid: 'intx-567'},
          {uuid: 'intx-678', flow_id: 'flow-123', block_id: 'block-123', value: 'value #678'},
        ] as IBlockInteraction[],
        flows: [{uuid: 'flow-123', blocks: [{uuid: 'block-123'} as IBlock]} as IFlow] as IFlow[],
      } as IContext

      virtualPrompt = {} as IPrompt

      jest.spyOn(backtracking.promptBuilder, 'buildPromptFor').mockReturnValue(Promise.resolve(virtualPrompt))
    })

    it('should return prompt for last interaction when no args provided', async () => {
      const block: IBlock = backtracking.context.flows[0].blocks[0]
      const interaction: IBlockInteraction = last(backtracking.context.interactions)!

      const cursor = await backtracking.peek()
      expect(backtracking.promptBuilder.buildPromptFor).toHaveBeenCalledWith(block, interaction)
      expect(interaction.value).toBeTruthy()
      expect(cursor.prompt).toBe(virtualPrompt)
      expect(cursor.prompt.value).toEqual(interaction.value)
    })

    it('should return prompt for first interaction when default args provided and `fromLeft` is truthy', async () => {
      // set up for fromLeft // reverse traversal
      const firstInteraction = backtracking.context.interactions[0]
      backtracking.context.interactions[0] = backtracking.context.interactions[5]
      backtracking.context.interactions[5] = firstInteraction

      const block: IBlock = backtracking.context.flows[0].blocks[0]
      const interaction: IBlockInteraction = first(backtracking.context.interactions)!

      const cursor = await backtracking.peek(0, backtracking.context, PeekDirection.RIGHT)
      expect(backtracking.promptBuilder.buildPromptFor).toHaveBeenCalledWith(block, interaction)
      expect(interaction.value).toBeTruthy()
      expect(cursor.prompt).toBe(virtualPrompt)
      expect(cursor.prompt.value).toEqual(interaction.value)
    })

    it('should use interaction `steps` places from the end of interactions list', async () => {
      const block: IBlock = backtracking.context.flows[0].blocks[0]
      const interaction: IBlockInteraction = backtracking.context.interactions[2]

      const cursor = await backtracking.peek(3)
      expect(backtracking.promptBuilder.buildPromptFor).toHaveBeenCalledWith(block, interaction)
      expect(interaction.value).toBeTruthy()
      expect(cursor.prompt).toBe(virtualPrompt)
      expect(cursor.prompt.value).toEqual(interaction.value)
    })

    it('should skip over non-interactive blocks', async () => {
      backtracking.context.interactions[3].type = first(NON_INTERACTIVE_BLOCK_TYPES)!
      backtracking.context.interactions[4].type = first(NON_INTERACTIVE_BLOCK_TYPES)!

      const block: IBlock = backtracking.context.flows[0].blocks[0]
      const interaction: IBlockInteraction = backtracking.context.interactions[2]

      const cursor = await backtracking.peek(1)
      expect(backtracking.promptBuilder.buildPromptFor).toHaveBeenCalledWith(block, interaction)
      expect(interaction.value).toBeTruthy()
      expect(cursor.prompt).toBe(virtualPrompt)
      expect(cursor.prompt.value).toEqual(interaction.value)
    })

    it('should raise when trying to step back further than can be stepped', async () => {
      await expect(BacktrackingBehaviour.prototype.peek.bind(backtracking)(7)).rejects.toThrow(
        'Unable to backtrack to an interaction that far back {"steps":7}'
      )
    })
  })
})
