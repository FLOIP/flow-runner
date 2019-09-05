import IBlock from '../../flow-spec/IBlock'
import IBlockInteraction from '../../flow-spec/IBlockInteraction'
import IBlockExit from '../../flow-spec/IBlockExit'
import {RichCursorType} from '../..'
import {IPromptConfig} from '../..'
import IResourceResolver from '../IResourceResolver'

export default interface IBlockRunner {
  block: IBlock
  resources: IResourceResolver

  initialize(interaction?: IBlockInteraction): IPromptConfig<any> | undefined

  run(cursor?: RichCursorType): IBlockExit
}