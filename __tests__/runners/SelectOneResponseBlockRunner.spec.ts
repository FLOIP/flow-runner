import SelectOneResponseBlockRunner from '../../src/domain/runners/SelectOneResponseBlockRunner'
import IContext, {CursorInputRequiredType} from '../../src/flow-spec/IContext'
// import IDataset, {createDefaultDataset} from '../../__test_fixtures__/fixtures/IDataset'
import IBlockExit from '../../src/flow-spec/IBlockExit'
import ISelectOneResponseBlock from '../../src/model/block/ISelectOneResponseBlock'
import IContact from '../../src/flow-spec/IContact'
import IBlockInteraction from '../../src/flow-spec/IBlockInteraction'
import {ISelectOnePromptConfig} from '../../src'

describe('SelectOneResponseBlockRunner', () => {
  // let dataset: IDataset

  beforeEach(() => {
    // dataset = createDefaultDataset()
  })

  describe('run', () => {
    it('sanity // should return an exit when some exist', () => {
      const block: ISelectOneResponseBlock = {
        exits: [
          {test: '@(contact.age > 73)'} as IBlockExit,
          {test: '@(contact.age > 50)'} as IBlockExit,
          {test: '@(contact.age > 25)'} as IBlockExit,
          {test: '@(contact.age > 8)'} as IBlockExit,
          {test: '@(contact.age > 0)'} as IBlockExit,
        ]
      } as ISelectOneResponseBlock

      const ctx: IContext = {
        contact: {
          id: 'contact-123',
          name: 'Bert',
          age: 12,
        } as IContact,

        cursor: [
          {} as IBlockInteraction,
          {} as ISelectOnePromptConfig,
        ] as any as CursorInputRequiredType,
      } as IContext

      const runner = new SelectOneResponseBlockRunner(block, ctx)
      const exit: IBlockExit = runner.run()
      expect(exit).toBe(block.exits[3])
    })
  })
})