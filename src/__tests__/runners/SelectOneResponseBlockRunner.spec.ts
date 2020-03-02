import SelectOneResponseBlockRunner from '../../domain/runners/SelectOneResponseBlockRunner'
import IContext, {findBlockOnActiveFlowWith, findInteractionWith} from '../../flow-spec/IContext'
import IBlockExit from '../../flow-spec/IBlockExit'
import ISelectOneResponseBlock from '../../model/block/ISelectOneResponseBlock'
import IDataset, {createDefaultDataset} from '../fixtures/IDataset'
import IContact from '../../flow-spec/IContact'

describe('SelectOneResponseBlockRunner', () => {
  let dataset: IDataset

  beforeEach(() => {
    dataset = createDefaultDataset()
  })

  describe('run', () => {
    it('sanity // should return an exit when some exist', async () => {
      const ctx: IContext = dataset.contexts[1]
      ;(ctx.contact as IContactWithAge).age = 12

      const interaction = findInteractionWith(ctx.cursor!.interactionId, ctx)
      const block: ISelectOneResponseBlock = Object.assign(findBlockOnActiveFlowWith(interaction.blockId, ctx), {
        exits: [
          {test: '@(contact.age > 73)'} as IBlockExit,
          {test: '@(contact.age > 50)'} as IBlockExit,
          {test: '@(contact.age > 25)'} as IBlockExit,
          {test: '@(contact.age > 8)'} as IBlockExit,
          {test: '@(contact.age > 0)'} as IBlockExit,
        ]
      }) as ISelectOneResponseBlock

      const runner = new SelectOneResponseBlockRunner(block, ctx)
      const exit: IBlockExit = await runner.run()
      expect(exit).toBe(block.exits[3])
    })

    it.todo('should raise an exception when an expression is provided that doesn\'t evaluate to bool.')
  })
})

interface IContactWithAge extends IContact {
  age: number
}
