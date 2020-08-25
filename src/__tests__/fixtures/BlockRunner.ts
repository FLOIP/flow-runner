import {IBlock, IBlockRunner, IContext} from '../..'

export function createStaticFirstExitBlockRunnerFor(block: IBlock, context: IContext): IBlockRunner {
  return {
    block,
    context,
    initialize: async () => undefined,
    run: async () => block.exits[0],
  } as IBlockRunner
}
