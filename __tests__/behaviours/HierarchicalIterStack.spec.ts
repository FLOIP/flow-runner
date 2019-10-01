import {
  _append, _loop,
  createStack, createStackFrom,
  IEntity,
  IStack,
} from '../../src/domain/behaviours/BacktrackingBehaviour/HierarchicalIterStack'


describe('HierarchicalIterStack', () => {

  describe('_append', () => {
    describe('when stack is empty', () => {
      it('should update head on stack when appending items', () => {
        const stack: IStack = createStack()
        const entity: IEntity = {uuid: 'abc-12'}

        expect(stack.head).toBeUndefined()
        _append(entity, stack)
        expect(stack.head).toBe(entity)
      })
    })

    describe('when stack not empty', () => {
      it('should leave head the same', () => {
        const stack: IStack = createStack([{uuid: 'abc-123'}, {uuid: 'abc-234'}])
        const entity: IEntity = {uuid: 'abc-345'}

        expect(stack.head).toEqual({uuid: 'abc-123'})
        _append(entity, stack)
        expect(stack.head).toEqual({uuid: 'abc-123'})
      })
    })

    describe('when first item on subsequent iterations', () => {
      it('should leave head alone', () => {
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

})
