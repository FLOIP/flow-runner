import IBlock from '../../flow-spec/IBlock'
import IBlockRunner from '../../domain/runners/IBlockRunner'
import IContext from '../../flow-spec/IContext'

export const createStaticFirstExitBlockRunnerFor = (block: IBlock, context: IContext) => ({
  block,
  context,
  initialize: () => undefined,
  run: async () => block.exits[0],
} as IBlockRunner)
