import {
  findBlockOnActiveFlowWith,
  findInteractionWith,
  IBlockExit,
  IContact,
  IContext,
  ISelectOneResponseBlock,
  SelectOneResponseBlockRunner,
} from '../..'
import {createDefaultDataset, IDataset} from '../fixtures/IDataset'

describe('SelectOneResponseBlockRunner', () => {
  let dataset: IDataset

  beforeEach(() => {
    dataset = createDefaultDataset()
  })

  describe('run', () => {
    it('sanity // should return an exit when some exist', async () => {
      const ctx: IContext = dataset.contexts[1]
      ;(ctx.contact as IContactWithAge).age = '12'

      const interaction = findInteractionWith(ctx.cursor!.interactionId, ctx)
      const block: ISelectOneResponseBlock = Object.assign(findBlockOnActiveFlowWith(interaction.block_id, ctx), {
        exits: [
          {test: '@(contact.age > 73)'} as IBlockExit,
          {test: '@(contact.age > 50)'} as IBlockExit,
          {test: '@(contact.age > 25)'} as IBlockExit,
          {test: '@(contact.age > 8)'} as IBlockExit,
          {test: '@(contact.age > 0)'} as IBlockExit,
        ],
      }) as ISelectOneResponseBlock

      const runner = new SelectOneResponseBlockRunner(block, ctx)
      const exit: IBlockExit = await runner.run()
      expect(exit).toBe(block.exits[3])
    })

    it.todo("should raise an exception when an expression is provided that doesn't evaluate to bool.")
  })
})

interface IContactWithAge extends IContact {
  age: string
}
