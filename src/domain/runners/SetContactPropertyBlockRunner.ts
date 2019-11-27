import IBlockRunner from './IBlockRunner'
import ISetContactPropertyBlock from '../../model/block/ISetContactPropertyBlock'
import IContext from '../../flow-spec/IContext'
import IBlockExit from '../../flow-spec/IBlockExit'

export default class SetContactPropertyBlockRunner implements IBlockRunner {
  constructor(public block: ISetContactPropertyBlock, public context: IContext) {
    //
  }

  initialize(): undefined {
    return undefined
  }

  run(): IBlockExit {
    const {contact} = this.context
    const {propertyName, propertyValue} = this.block.config

    contact[propertyName] = propertyValue

    return this.block.exits[0]
  }
}
