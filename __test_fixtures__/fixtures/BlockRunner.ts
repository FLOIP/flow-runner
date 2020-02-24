import IBlock from '../../src/flow-spec/IBlock'
import IBlockRunner from '../../src/domain/runners/IBlockRunner'
import IContext from '../../src/flow-spec/IContext'

export const createStaticFirstExitBlockRunnerFor = (block: IBlock, context: IContext) => ({
  block,
  context,
  initialize: () => undefined,
  run: async () => block.exits[0],
} as IBlockRunner)
