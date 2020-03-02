import {
  _append,
  createStack,
  createStackFrom, createStackKey, deepTruncateIterationsFrom,
  IEntity,
  IStack, Key, truncateIterationFrom,
} from '../../../domain/behaviours/BacktrackingBehaviour/HierarchicalIterStack'


describe('HierarchicalIterStack', () => {

  describe('_append', () => {
    describe('when stack is empty', () => {
      it('should update head on stack when appending items', async () => {
        const stack: IStack = createStack()
        const entity: IEntity = {uuid: 'abc-12'}

        expect(stack.head).toBeUndefined()
        _append(entity, stack)
        expect(stack.head).toBe(entity)
      })
    })

    describe('when stack not empty', () => {
      it('should leave head the same', async () => {
        const stack: IStack = createStack([{uuid: 'abc-123'}, {uuid: 'abc-234'}])
        const entity: IEntity = {uuid: 'abc-345'}

        expect(stack.head).toEqual({uuid: 'abc-123'})
        _append(entity, stack)
        expect(stack.head).toEqual({uuid: 'abc-123'})
      })
    })

    describe('when first item on subsequent iterations', () => {
      it('should leave head alone', async () => {
        const stack: IStack = createStackFrom([
          [{uuid: 'abc-123'}, {uuid: 'abc-234'}],
          []])
        const entity: IEntity = {uuid: 'abc-345'}

        expect(stack.head).toEqual({uuid: 'abc-123'})
        _append(entity, stack)
        expect(stack.head).toEqual({uuid: 'abc-123'})
      })
    })
  })

  describe('truncateIterationFrom', () => {
    it('should return empty list when empty key provided', async () => {
      const stack: IStack = createStack()
      const key: Key = []

      expect(truncateIterationFrom(key, stack)).toEqual([])
    })

    describe('when on root stack', () => {
      it('should return removed items; from last key iteration index when non-empty key provided', async () => {
        const stack: IStack = createStack([
          {uuid: 'abc-123'},
          {uuid: 'abc-234'},
          {uuid: 'abc-345'},
          {uuid: 'abc-456'},
          {uuid: 'abc-567'}])

        const expectedStack = createStack([
          {uuid: 'abc-123'},
          {uuid: 'abc-234'}])

        const key: Key = [createStackKey(0, 1)]
        expect(truncateIterationFrom(key, stack)).toEqual([
          {uuid: 'abc-345'},
          {uuid: 'abc-456'},
          {uuid: 'abc-567'}])

        expect(stack).toEqual(expectedStack)
      })
    })

    describe('when on nested stack', () => {
      it('should return removed items; from last key iteration index when non-empty key provided', async () => {
        const stack: IStack = createStack([
          createStack([
            {uuid: 'abc-123'},
            {uuid: 'abc-234'},
            {uuid: 'abc-345'},
            {uuid: 'abc-456'},
            {uuid: 'abc-567'}])])

        const expectedStack = createStack([
          createStack([
            {uuid: 'abc-123'},
            {uuid: 'abc-234'}])])

        const key: Key = [createStackKey(0, 0), createStackKey(0, 1)]
        expect(truncateIterationFrom(key, stack)).toEqual([
          {uuid: 'abc-345'},
          {uuid: 'abc-456'},
          {uuid: 'abc-567'}])

        expect(stack).toEqual(expectedStack)
      })
    })
  })

  describe('deepTruncateIterationsFrom', () => {
    it.todo('would make sense to return removed items -- chain recursion with .concat()')

    it('should remove items from deepest stack', async () => {
      const stack: IStack = createStack([
        createStack([
          {uuid: 'abc-123'},
          {uuid: 'abc-234'},
          {uuid: 'abc-345'},
          {uuid: 'abc-456'},
          {uuid: 'abc-567'}]),
        createStackFrom([
          [{uuid: 'bcd-123'}, {uuid: 'bcd-234'}, {uuid: 'bcd-345'}, {uuid: 'bcd-456'}, {uuid: 'bcd-567'}],
          [{uuid: 'cde-123'}, {uuid: 'cde-234'}, {uuid: 'cde-345'}, {uuid: 'cde-456'}, {uuid: 'cde-567'}],
          [{uuid: 'def-123'}, /* key -> */{uuid: 'def-234'}, {uuid: 'def-345'}, {uuid: 'def-456'}, {uuid: 'def-567'}],
          [{uuid: 'efg-123'}, {uuid: 'efg-234'}, {uuid: 'efg-345'}, {uuid: 'efg-456'}, {uuid: 'efg-567'}],
          [{uuid: 'fgh-123'}, {uuid: 'fgh-234'}, {uuid: 'fgh-345'}, {uuid: 'fgh-456'}, {uuid: 'fgh-567'}],
        ]),
        createStack([
          {uuid: 'ghi-123'},
          {uuid: 'ghi-234'},
          {uuid: 'ghi-345'},
          {uuid: 'ghi-456'},
          {uuid: 'ghi-567'}])])

      const expectedStack = createStack([
        createStack([
          {uuid: 'abc-123'},
          {uuid: 'abc-234'},
          {uuid: 'abc-345'},
          {uuid: 'abc-456'},
          {uuid: 'abc-567'}]),
        createStackFrom([
          [{uuid: 'bcd-123'}, {uuid: 'bcd-234'}, {uuid: 'bcd-345'}, {uuid: 'bcd-456'}, {uuid: 'bcd-567'}],
          [{uuid: 'cde-123'}, {uuid: 'cde-234'}, {uuid: 'cde-345'}, {uuid: 'cde-456'}, {uuid: 'cde-567'}],
          [{uuid: 'def-123'}, {uuid: 'def-234'}],
        ])])

      const key: Key = [createStackKey(0, 1), createStackKey(2, 1)]
      deepTruncateIterationsFrom(key, stack)
      expect(stack).toEqual(expectedStack)
    })
  })
})
