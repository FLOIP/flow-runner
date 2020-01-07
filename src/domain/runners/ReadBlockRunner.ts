import {zipObject} from 'lodash'
import IBlockRunner from './IBlockRunner'
import IBlockExit from '../../flow-spec/IBlockExit'
import IContext, {RichCursorInputRequiredType} from '../../flow-spec/IContext'
import IReadBlock from '../../model/block/IReadBlock'
import ReadPrompt, {isReadError} from '../prompt/ReadPrompt'
import {IReadError, TReadableType} from '../prompt/IReadPromptConfig'
import IReadBlockConfig from '../../model/block/IReadBlockConfig'


export default class ReadBlockRunner implements IBlockRunner {
  constructor(
    public block: IReadBlock,
    public context: IContext) {}

  initialize(): undefined {
    return
  }

  run([interaction, prompt]: RichCursorInputRequiredType): IBlockExit {
    interaction.value = this._zipInput(
      (prompt as ReadPrompt).value,
      this.block.config.destinationVariables)

    return prompt.isValid
      ? this.block.exits[0]
      : this.block.exits[1]
  }

  _zipInput(input: TReadableType[] | IReadError | undefined, propertyNames: IReadBlockConfig['destinationVariables']) {
    if (input == null || isReadError(input)) {
      return input
    }

    return zipObject(propertyNames, input)
  }
}