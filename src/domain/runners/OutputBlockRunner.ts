import IBlockRunner from './IBlockRunner'
import IBlockExit from '../../flow-spec/IBlockExit'
import IContext, {TRichCursor} from '../../flow-spec/IContext'
import IOutputBlock from '../../model/block/IOutputBlock'
import {evaluateToString} from '../..'


export class OutputBlockRunner implements IBlockRunner {
  constructor(
    public block: IOutputBlock,
    public context: IContext) {}

  initialize(): undefined {
    return
  }

  run(cursor: TRichCursor): IBlockExit {
    // todo: should we be setting hasRepsonse to `true` here?
    cursor[0].value = evaluateToString(this.block.config.value, this.context)
    return this.block.exits[0]
  }
}

export default OutputBlockRunner