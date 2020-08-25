import {IBlock, IBlockRunner, IContext} from '../..'

export const createStaticFirstExitBlockRunnerFor = (block: IBlock, context: IContext) => ({
  block,
  context,
  initialize: async () => undefined,
  run: async () => block.exits[0],
} as IBlockRunner)
