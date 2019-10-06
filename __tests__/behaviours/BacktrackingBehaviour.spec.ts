import {cloneDeep} from 'lodash'
import BacktrackingBehaviour, {
  // IBacktrackingContext,
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


describe('BacktrackingBehaviour', () => {
  let backtracking: BacktrackingBehaviour

  beforeEach(() => {
    backtracking = new BacktrackingBehaviour(
      {platformMetadata: {}} as IContext,
      {navigateTo: (_b, _c) => [{} as IBlockInteraction, undefined]})
  })

  describe('constructor', () => {
    it.todo('should initialize backtracking on context\'s platform metadata')
  })

  describe('insertInteractionUsing', () => {
    describe('sealing this iteration', () => {
      describe('when block has been repeated since start of an iteration', () => {
        it('should step in (aka perform an iteration rollup)', () => {
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
        it('should roll up entire iteration into a stack', () => { // todo: should this nest a stack, or simply append another iteration???
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
          it('should insert at first position', () => {
            const interactionStack: IContextBacktrackingPlatformMetadata['backtracking']['interactionStack'] = createStack()
            const cursor: IContextBacktrackingPlatformMetadata['backtracking']['cursor'] = createKey()
            const interaction = {uuid: 'abc-123'} as IBlockInteraction

            expect(backtracking.insertInteractionUsing(cursor, interaction, interactionStack))

            expect(interactionStack).toEqual(createStack([interaction]))
            expect(cursor).toEqual(createKey(0))
          })
        })

        describe('when on root stack', () => {
          it('should insert at current position', () => {
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
          it('should insert at current position', () => {
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
        it('should step out when head found one level up', () => {
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

        it('should step out multiple times when head found multiple levels up', () => {
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

  })
})
