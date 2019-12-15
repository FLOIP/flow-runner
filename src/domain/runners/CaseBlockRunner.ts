import IBlockRunner from './IBlockRunner'
import {
  findDefaultBlockExitOn,
  IBlockExitTestRequired,
} from '../..'
import {findFirstTruthyEvaluatingBlockExitOn} from '../../flow-spec/IBlock'
import IContext from '../../flow-spec/IContext'
import ICaseBlock from '../../model/block/ICaseBlock'

export default class CaseBlockRunner implements IBlockRunner {
  constructor(
    public block: ICaseBlock,
    public context: IContext) {}

  initialize(): undefined {
    return undefined
  }

  run(): IBlockExitTestRequired {
    return findFirstTruthyEvaluatingBlockExitOn(this.block, this.context)
      ?? findDefaultBlockExitOn(this.block) as IBlockExitTestRequired
  }
}