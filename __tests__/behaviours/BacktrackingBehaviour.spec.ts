import {cloneDeep, first, last} from 'lodash'
import BacktrackingBehaviour, {
  IContextBacktrackingPlatformMetadata,
} from '../../src/domain/behaviours/BacktrackingBehaviour/BacktrackingBehaviour'
import IContext from '../../src/flow-spec/IContext'
import IBlockInteraction from '../../src/flow-spec/IBlockInteraction'
import {
  _append,
  _loop,
  createKey,
  createStack,
  createStackFrom,
  createStackKey,
  getStackFor,
  IEntity,
} from '../../src/domain/behaviours/BacktrackingBehaviour/HierarchicalIterStack'
import IFlow from '../../src/flow-spec/IFlow'
import IRunFlowBlockConfig from "../../src/model/block/IRunFlowBlockConfig"
import {IBasePromptConfig, IPromptConfig} from '../../src'
import {NON_INTERACTIVE_BLOCK_TYPES} from '../../src/domain/FlowRunner'
import IPrompt from '../../src/domain/prompt/IPrompt'
import IBlock from '../../src/flow-spec/IBlock'


describe('BacktrackingBehaviour', () => {
  let backtracking: BacktrackingBehaviour

  beforeEach(() => {
    backtracking = new BacktrackingBehaviour(
      {platformMetadata: {}} as IContext,
      {navigateTo: (_b, _c) => ({interaction: {} as IBlockInteraction, prompt: undefined})},
      {buildPromptFor: (_b: IBlock, _i: IBlockInteraction):
          IPrompt<IPromptConfig<any> & IBasePromptConfig> | undefined => undefined})
  })

  describe('constructor', () => {
    it.todo('should initialize backtracking on context\'s platform metadata')
  })

  describe('insertInteractionUsing', () => {
    describe('sealing this iteration', () => {
      describe('when block has been repeated since start of an iteration', () => {
        it('should step in (aka perform an iteration rollup)', async () => {
          const interactions = [
            {blockId: '0', uuid: 'abc-0'},
            {blockId: '1', uuid: 'abc-1'},
            {blockId: '2', uuid: 'abc-2'},
            {blockId: '3', uuid: 'abc-3'}]

          const interactionStack = createStack([...interactions])

          const cursor: IContextBacktrackingPlatformMetadata['backtracking']['cursor'] = createKey(3)
          const interaction = {blockId: '1', uuid: 'abc-4'} as IBlockInteraction

          backtracking.insertInteractionUsing(cursor, interaction, interactionStack)

          expect(interactionStack).toEqual(createStack([
            interactions[0],
            _loop(
              createStack([interactions[1], interactions[2], interactions[3]]),
              [interaction])]))

          expect(cursor).toEqual([
            ['stack', 0, 1],
            ['stack', 1, 0]])
        })

        // it.todo('should carry tail with us') // ??? Nah, leave as is until we step out, then erase
      })

      describe('when block is at start of iteration', () => {
        it('should roll up entire iteration into a stack', async () => { // todo: should this nest a stack, or simply append another iteration???
          const interactions = [
            {blockId: '0', uuid: 'abc-0'},
            {blockId: '1', uuid: 'abc-1'},
            {blockId: '2', uuid: 'abc-2'},
            {blockId: '3', uuid: 'abc-3'}]

          const interactionStack = createStack([...interactions])

          const cursor: IContextBacktrackingPlatformMetadata['backtracking']['cursor'] = createKey(3)
          const interaction = {blockId: '0', uuid: 'abc-4'} as IBlockInteraction

          backtracking.insertInteractionUsing(cursor, interaction, interactionStack)

          expect(interactionStack).toEqual(createStack([
            _loop(
              createStack([interactions[0], interactions[1], interactions[2], interactions[3]]),
              [interaction])]))

          expect(cursor).toEqual([
            ['stack', 0, 0],
            ['stack', 1, 0]])
        })
      })

      describe('when block has not been repeated since start of iteration', () => {
        describe('when using fresh key', () => {
          it('should insert at first position', async () => {
            const interactionStack: IContextBacktrackingPlatformMetadata['backtracking']['interactionStack'] = createStack()
            const cursor: IContextBacktrackingPlatformMetadata['backtracking']['cursor'] = createKey()
            const interaction = {uuid: 'abc-123'} as IBlockInteraction

            expect(backtracking.insertInteractionUsing(cursor, interaction, interactionStack))

            expect(interactionStack).toEqual(createStack([interaction]))
            expect(cursor).toEqual(createKey(0))
          })
        })

        describe('when on root stack', () => {
          it('should insert at current position', async () => {
            const interactions = [
              {blockId: '0', uuid: 'abc-0'},
              {blockId: '1', uuid: 'abc-1'},
              {blockId: '2', uuid: 'abc-2'},
              {blockId: '3', uuid: 'abc-3'}]

            const interactionStack = createStack([...interactions])

            const cursor: IContextBacktrackingPlatformMetadata['backtracking']['cursor'] = createKey(3)
            const interaction = {blockId: '4', uuid: 'abc-4'} as IBlockInteraction

            backtracking.insertInteractionUsing(cursor, interaction, interactionStack)

            expect(interactionStack).toEqual(createStack([...interactions, interaction]))
            expect(cursor).toEqual(createKey(4))
          })
        })

        describe('when on nested stack', () => {
          it('should insert at current position', async () => {
            const sourceInteractions = createStackFrom([
              [{blockId: '1', uuid: 'abc-1'} as IEntity, createStackFrom([
                [{blockId: '2', uuid: 'abc-2'} as IEntity, {blockId: '3', uuid: 'abc-3'} as IEntity, {blockId: '4', uuid: 'abc-4'} as IEntity],
                [{blockId: '2', uuid: 'abc-5'} as IEntity, createStackFrom([
                  [{blockId: '3', uuid: 'abc-6'} as IEntity, {blockId: '4', uuid: 'abc-7'} as IEntity],
                  [{blockId: '3', uuid: 'abc-8'} as IEntity, {blockId: '4', uuid: 'abc-9'} as IEntity, {blockId: '5', uuid: 'abc-10'} as IEntity]])]])
              ]])

            const interactionStack = cloneDeep(sourceInteractions) as IContextBacktrackingPlatformMetadata['backtracking']['interactionStack']

            const cursor: IContextBacktrackingPlatformMetadata['backtracking']['cursor'] = [createStackKey(0, 1), createStackKey(1, 1), createStackKey(1, 2)]
            const interaction = {blockId: '6', uuid: 'abc-11'} as IBlockInteraction

            backtracking.insertInteractionUsing(cursor, interaction, interactionStack)

            const expected = cloneDeep(sourceInteractions) as IContextBacktrackingPlatformMetadata['backtracking']['interactionStack']
            _append(interaction, getStackFor(cursor, expected))

            expect(interactionStack).toEqual(expected)
            expect(cursor).toEqual([createStackKey(0, 1), createStackKey(1, 1), createStackKey(1, 3)])
          })
        })
      })

      describe('when block matches any stack\'s first block', () => {
        it('should step out when head found one level up', async () => {
          const sourceInteractions = createStackFrom([
            [{blockId: '1', uuid: 'abc-1'} as IEntity, createStackFrom([
                [{blockId: '2', uuid: 'abc-2'} as IEntity, {blockId: '3', uuid: 'abc-3'} as IEntity, {blockId: '4', uuid: 'abc-4'} as IEntity],
                [{blockId: '2', uuid: 'abc-5'} as IEntity, createStackFrom([
                    [{blockId: '3', uuid: 'abc-6'} as IEntity, {blockId: '4', uuid: 'abc-7'} as IEntity],
                    [{blockId: '3', uuid: 'abc-8'} as IEntity, {blockId: '4', uuid: 'abc-9'} as IEntity, {blockId: '5', uuid: 'abc-10'} as IEntity]])]])
                // [{blockId: '2', uuid: 'abc-11'}, {blockId: '3', uuid: 'abc-12'}, {blockId: '4', uuid: 'abc-13'}, {blockId: '5', uuid: 'abc-14'}]]]
            ]])

          const interactionStack = cloneDeep(sourceInteractions) as IContextBacktrackingPlatformMetadata['backtracking']['interactionStack']

          const cursor: IContextBacktrackingPlatformMetadata['backtracking']['cursor'] = [createStackKey(0, 1), createStackKey(1, 1), createStackKey(1, 2)]
          const interaction = {blockId: '2', uuid: 'abc-11'} as IBlockInteraction

          backtracking.insertInteractionUsing(cursor, interaction, interactionStack)

          const expected = cloneDeep(sourceInteractions) as IContextBacktrackingPlatformMetadata['backtracking']['interactionStack']
          _loop(getStackFor([createStackKey(0, 1), createStackKey(1, 1)], expected), [interaction])

          expect(interactionStack).toEqual(expected)
          expect(cursor).toEqual([createStackKey(0, 1), createStackKey(2, 0)])
        })

        it('should step out multiple times when head found multiple levels up', async () => {
          const sourceInteractions = createStackFrom([
            [{blockId: '1', uuid: 'abc-1'} as IEntity, createStackFrom([
              [{blockId: '2', uuid: 'abc-2'} as IEntity, {blockId: '3', uuid: 'abc-3'} as IEntity, {blockId: '4', uuid: 'abc-4'} as IEntity],
              [{blockId: '2', uuid: 'abc-5'} as IEntity, createStackFrom([
                [{blockId: '3', uuid: 'abc-6'} as IEntity, {blockId: '4', uuid: 'abc-7'} as IEntity],
                [{blockId: '3', uuid: 'abc-8'} as IEntity, {blockId: '4', uuid: 'abc-9'} as IEntity, {blockId: '5', uuid: 'abc-10'} as IEntity]])]])
              // [{blockId: '2', uuid: 'abc-11'}, {blockId: '3', uuid: 'abc-12'}, {blockId: '4', uuid: 'abc-13'}, {blockId: '5', uuid: 'abc-14'}]]]
            ]])

          const interactionStack = cloneDeep(sourceInteractions) as IContextBacktrackingPlatformMetadata['backtracking']['interactionStack']

          const cursor: IContextBacktrackingPlatformMetadata['backtracking']['cursor'] = [createStackKey(0, 1), createStackKey(1, 1), createStackKey(1, 2)]
          const interaction = {blockId: '1', uuid: 'abc-11'} as IBlockInteraction

          backtracking.insertInteractionUsing(cursor, interaction, interactionStack)

          const expected = cloneDeep(sourceInteractions) as IContextBacktrackingPlatformMetadata['backtracking']['interactionStack']
          _loop(expected, [interaction])

          expect(interactionStack).toEqual(expected)
          expect(cursor).toEqual([createStackKey(1, 0)])
        })

        it.todo('should step out all the way to root when found in root')

        it.todo('should wipe interactions after current key')
      })

      describe('when stacked, but block doesn\'t match any heads', () => {
        it.todo('should insert where we\'re at') // see:
      })
    })

    // todo: when blockId matches current key: replace current interaction on hierarchy --- todo: how do we differentiate between appending and replacing?
    //       when blockId different than on current key: insert new interaction _before_ key

    // todo: test stepping forward and making a change.

    // todo: update keys on all interactions forward in this iteration

    // todo: more thorough testing of multi-back-tracking
  })

  describe('findIndexOfSuggestionFor', () => {
    it.todo('...')
  })

  describe('jumpTo', () => {
    let interactions: IBlockInteraction[]
    let meta: IContextBacktrackingPlatformMetadata['backtracking']

    beforeEach(() => {
      interactions = [{uuid: 'abc-123'}, {uuid: 'abc-234', blockId: 'block/abc-234'}, {uuid: 'abc-345'}] as IBlockInteraction[]

      backtracking.context.interactions = cloneDeep(interactions)
      backtracking.context.firstFlowId = 'flow/abc-123'
      backtracking.context.flows = [{uuid: 'flow/abc-123', blocks: [{uuid: 'block/abc-234'}]} as IFlow]
      backtracking.context.nestedFlowBlockInteractionIdStack = []

      meta = (backtracking.context.platformMetadata as IContextBacktrackingPlatformMetadata).backtracking
      meta.interactionStack = createStack(cloneDeep(interactions))
    })

    it('should initialize ghost stack as a clone of current stack', async () => {
      const expectedGhostStack = createStack(cloneDeep(interactions))

      expect(meta.ghostInteractionStacks).toEqual([])
      backtracking.jumpTo({uuid: 'abc-234', blockId: 'block/abc-234'} as IBlockInteraction, backtracking.context)
      expect(meta.ghostInteractionStacks).toEqual([expectedGhostStack])
      expect(meta.ghostInteractionStacks).not.toBe(meta.interactionStack)
    })

    it('should set cursor to point in time before the interaction we jump to; this gives space to run the block we\'re jumping to in place', async () => {
      expect(meta.cursor).toEqual(createKey())
      backtracking.jumpTo({uuid: 'abc-234', blockId: 'block/abc-234'} as IBlockInteraction, backtracking.context)
      expect(meta.cursor).toEqual(createKey(0))
    })

    it('should truncate interactions off main context interactions list from jumped to onward', async () => {
      expect(backtracking.context.interactions).toEqual(interactions)
      backtracking.jumpTo({uuid: 'abc-234', blockId: 'block/abc-234'} as IBlockInteraction, backtracking.context)
      expect(backtracking.context.interactions).toEqual(interactions.slice(0, 1))
    })

    it('should truncate hierarchical stack to match interactions list', async () => {
      backtracking.jumpTo({uuid: 'abc-234', blockId: 'block/abc-234'} as IBlockInteraction, backtracking.context)
      expect(meta.interactionStack).toEqual(createStack(interactions.slice(0, 1)))
    })

    describe('nested flow reconciliation', () => {
      beforeEach(() => {
        interactions = [
          {uuid: 'intx-123-1'},
          {uuid: 'intx-234-1', type: 'Core\\RunFlow', blockId: 'block-234', flowId: 'flow-123'}, // nestedFlow::stepIn()
          {uuid: 'intx-567-1', blockId: 'block-567', flowId: '234'},
          {uuid: 'intx-678-1'},
          {uuid: 'intx-789-1', type: 'Core\\RunFlow', blockId: 'block-789', flowId: 'flow-234'}, // nestedFlow::stepIn()
          {uuid: 'intx-890-1'},
          {uuid: 'intx-901-1', blockId: 'block-901', flowId: 'flow-345'},
          {uuid: 'intx-012-1'},
          {uuid: 'intx-345-1'}, // // nestedFlow::stepOut() x2 --- both have null endings, and so we step out twice aka back up to flow-123
          {uuid: 'intx-456-1'},
        ] as IBlockInteraction[]

        backtracking.context.flows = [
          {uuid: 'flow-123', blocks: [
              {uuid: 'block-123'},
              {uuid: 'block-234', config: {flowId: 'flow-234'} as IRunFlowBlockConfig},
              {uuid: 'block-345'},
              {uuid: 'block-456'}]},
          {uuid: 'flow-234', blocks: [
              {uuid: 'block-567'},
              {uuid: 'block-678'},
              {uuid: 'block-789', config: {flowId: 'flow-345'} as IRunFlowBlockConfig}]},
          {uuid: 'flow-345', blocks: [
              {uuid: 'block-890'},
              {uuid: 'block-901'},
              {uuid: 'block-012'}]},
        ] as IFlow[]

        backtracking.context.interactions = cloneDeep(interactions)
        backtracking.context.firstFlowId = 'flow-123'
        backtracking.context.nestedFlowBlockInteractionIdStack = [
          'intx-234-1',
          'intx-789-1',
        ]

        meta = (backtracking.context.platformMetadata as IContextBacktrackingPlatformMetadata).backtracking
        meta.interactionStack = createStack(cloneDeep(interactions))
      })

      it('leave nesting at the same place if not jumping past a nesting', async () => {
        expect(backtracking.context.nestedFlowBlockInteractionIdStack).toEqual(['intx-234-1', 'intx-789-1'])
        backtracking.jumpTo({uuid: 'intx-901-1', blockId: 'block-901'} as IBlockInteraction, backtracking.context)
        expect(backtracking.context.nestedFlowBlockInteractionIdStack).toEqual(['intx-234-1', 'intx-789-1'])
      })

      it('should handle peeling off one level of nesting when jumping past one run-flow block interaction', async () => {
        expect(backtracking.context.nestedFlowBlockInteractionIdStack).toEqual(['intx-234-1', 'intx-789-1'])
        backtracking.jumpTo({uuid: 'intx-567-1', blockId: 'block-567'} as IBlockInteraction, backtracking.context)
        expect(backtracking.context.nestedFlowBlockInteractionIdStack).toEqual(['intx-234-1'])
      })

      it('should handle peeling off all nesting when jumping to interaction at top level', async () => {
        expect(backtracking.context.nestedFlowBlockInteractionIdStack).toEqual(['intx-234-1', 'intx-789-1'])
        backtracking.jumpTo({uuid: 'intx-234-1', blockId: 'block-234'} as IBlockInteraction, backtracking.context)
        expect(backtracking.context.nestedFlowBlockInteractionIdStack).toEqual([])
      })
    })
  })

  describe('syncGhost', () => {
    // key:   [1, 2, 3, 4, 5]
    //                  ^
    //
    // ghost: [1, 2, 3, 8, 9, 4, 5] - forward; remove 8, 9
    //                        ^
    //        [1, 2, 3, 4, 5] - matches; leave as is
    //                  ^
    //        [1, 2, 3, [[7, 4, 5]]] - nested once + on first iteration; pull first iteration out + flatten it, remove those in between
    //                       ^
    //        [1, 2, 3, [[7, 8]
    //                   [7, 8]
    //                   [7, 4, 8]
    //                   [7, 4, 5, 8]
    //                  ]] - nested multiple times + on non-first iteration + iterations exist after it;
    //
    // We want to begin collapsing the hierarchy and slurp these out into the parent iteration, because keys need to match.

    it('should at least execute', async () => {
      backtracking.syncGhostTo(createKey(), createKey(), createStack())
    })

    describe('when key for suggestion is ahead by a couple indices', () => {
      it('should yank the items in between', async () => {
        const keyForSuggestion = createKey(5)
        const key = createKey(3)
        const ghost = createStack([{uuid: '1'}, {uuid: '2'}, {uuid: '3'}, {uuid: '8'}, {uuid: '9'}, {uuid: '4'}, {uuid: '5'}])

        backtracking.syncGhostTo(key, keyForSuggestion, ghost)
        expect(ghost).toEqual(createStack([{uuid: '1'}, {uuid: '2'}, {uuid: '3'}, {uuid: '4'}, {uuid: '5'}]))
      })
    })

    describe('when keys match', () => {
      it('should leave keys alone', async () => {
        const keyForSuggestion = createKey(3)
        const key = createKey(3)
        const ghost = createStack(['1', '2', '3', '4', '5'].map(uuid => ({uuid})))

        backtracking.syncGhostTo(key, keyForSuggestion, ghost)
        expect(keyForSuggestion).toEqual(createKey(3))
        expect(key).toEqual(createKey(3))
      })

      it('should leave ghost stack alone', async () => {
        const keyForSuggestion = createKey(3)
        const key = createKey(3)
        const ghost = createStack(['1', '2', '3', '4', '5'].map(uuid => ({uuid})))

        backtracking.syncGhostTo(key, keyForSuggestion, ghost)
        expect(ghost).toEqual(createStack(['1', '2', '3', '4', '5'].map(uuid => ({uuid}))))
      })
    })

    describe('when key for suggestion is nested once + on first iteration', () => {
      // [1, 2, 3, [[7, 4, 5]]]
      it('should hoist nested iteration into containing iteration, and remove items in between key + key for suggestion', () => {
        const keyForSuggestion = [createStackKey(0, 3), createStackKey(0, 1)]
        const key = createKey(3)
        const ghost = createStack([{uuid: '1'}, {uuid: '2'}, {uuid: '3'}, createStack([{uuid: '7'}, {uuid: '4'}, {uuid: '5'}])])

        backtracking.syncGhostTo(key, keyForSuggestion, ghost)
        expect(ghost).toEqual(createStack(['1', '2', '3', '4', '5'].map(uuid => ({uuid}))))
      })
    })

    // todo: fix this test, it's breaking
    xdescribe('when key for suggestion is nested multiple times deeper + on non-first iteration + iterations exist afterwards', () => {
      // [1, 2, 3, [[7, 8],
      //            [7, 8],
      //            [7, [[8, 4],
      //                     ^
      //                 [8, 4]],
      //            [7, 8, 4, 5],
      //           ]]

      // Result:
      // [1, 2, 3, 4, [
      //           ^
      //                [ [[8, 4]] ],
      //                [7, 8, 4, 5],
      //              ]

      // Currently, we end up with `[[8, 4]]` lying immediately between 4 + last stack, rather than inside of last stack
      it(`should remove iterations before iteration having key for suggestion 
            + hoist iteration having key for suggestion to match key 
            + remove items in between key + key for suggestion
            + leave subsequent iterations intact
            + leave trailing items intact
            `, () => {
        const keyForSuggestion = [createStackKey(0, 3), createStackKey(2, 1), createStackKey(0, 1)]
        const key = createKey(3)
        const ghost = createStack([
          {uuid: '1'}, {uuid: '2'}, {uuid: '3'}, createStackFrom([
            [{uuid: '7'}, {uuid: '8'}],
            [{uuid: '7'}, {uuid: '8'}],
            [{uuid: '7'}, createStackFrom([
              [{uuid: '8'}, {uuid: '4'}],
              [{uuid: '8'}, {uuid: '4'}]])],
            [{uuid: '7'}, {uuid: '8'}, {uuid: '4'}, {uuid: '5'}]])])

        backtracking.syncGhostTo(key, keyForSuggestion, ghost)
        expect(ghost).toEqual(createStack([
            {uuid: '1'}, {uuid: '2'}, {uuid: '3'}, {uuid: '4'}, createStackFrom([
                [createStack([{uuid: '8'}, {uuid: '4'}])], // todo: is this right? should we be flattening more carefully? do we want our 7 in front still?
                [{uuid: '7'}, {uuid: '8'}, {uuid: '4'}, {uuid: '5'}]])]))
      })
    })

    it.todo('should update head on ghost when splicing and dicing')
    it.todo('should behave predictably when key to match points to deep nesting')
    it.todo('should behave predictably when key to match points to element in main iteration')
    it.todo('should behave predictably when key to match point to start of everything')
  })

  describe('peek', () => {
    let pseudoPrompt: IPrompt<any>

    beforeEach(() => {
      backtracking.context = {
        interactions: [
          {uuid: 'intx-123'},
          {uuid: 'intx-234'},
          {uuid: 'intx-345', flowId: 'flow-123', blockId: 'block-123', value: 'value #345'},
          {uuid: 'intx-456'},
          {uuid: 'intx-567'},
          {uuid: 'intx-678', flowId: 'flow-123', blockId: 'block-123', value: 'value #678'},
        ] as IBlockInteraction[],
        flows: [
          {uuid: 'flow-123', blocks: [{uuid: 'block-123'} as IBlock]} as IFlow
        ] as IFlow[],
      } as IContext

      pseudoPrompt = {} as IPrompt<any>

      jest.spyOn(backtracking.promptBuilder, 'buildPromptFor')
        .mockReturnValue(pseudoPrompt)
    })

    it('should return prompt for last interaction when no args provided', () => {
      const block: IBlock = backtracking.context.flows[0].blocks[0]
      const interaction: IBlockInteraction = last(backtracking.context.interactions)!

      const prompt = backtracking.peek()!
      expect(backtracking.promptBuilder.buildPromptFor).toHaveBeenCalledWith(block, interaction)
      expect(interaction.value).toBeTruthy()
      expect(prompt).toBe(pseudoPrompt)
      expect(prompt.value).toEqual(interaction.value)
    })

    it('should use interaction `steps` places from the end of interactions list', () => {
      const block: IBlock = backtracking.context.flows[0].blocks[0]
      const interaction: IBlockInteraction = backtracking.context.interactions[2]

      const prompt = backtracking.peek(4)!
      expect(backtracking.promptBuilder.buildPromptFor).toHaveBeenCalledWith(block, interaction)
      expect(interaction.value).toBeTruthy()
      expect(prompt).toBe(pseudoPrompt)
      expect(prompt.value).toEqual(interaction.value)
    })

    it('should skip over non-interactive blocks', () => {
      backtracking.context.interactions[3].type = first(NON_INTERACTIVE_BLOCK_TYPES)!
      backtracking.context.interactions[4].type = first(NON_INTERACTIVE_BLOCK_TYPES)!

      const block: IBlock = backtracking.context.flows[0].blocks[0]
      const interaction: IBlockInteraction = backtracking.context.interactions[2]

      const prompt = backtracking.peek(2)!
      expect(backtracking.promptBuilder.buildPromptFor).toHaveBeenCalledWith(block, interaction)
      expect(interaction.value).toBeTruthy()
      expect(prompt).toBe(pseudoPrompt)
      expect(prompt.value).toEqual(interaction.value)
    })

    it('should raise when trying to step back further than can be stepped', () => {
      expect(BacktrackingBehaviour.prototype.peek.bind(backtracking, 7))
        .toThrow('Unable to backtrack to an interaction that far back {"steps":7}')
    })
  })
})
