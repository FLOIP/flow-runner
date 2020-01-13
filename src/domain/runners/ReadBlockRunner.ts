import {zipObject} from 'lodash'
import IBlockRunner from './IBlockRunner'
import IBlockExit from '../../flow-spec/IBlockExit'
import IContext, {TRichCursorInputRequired} from '../../flow-spec/IContext'
import IReadBlock from '../../model/block/IReadBlock'
import ReadPrompt from '../prompt/ReadPrompt'
import {IReadPromptConfig, TReadableType} from '../prompt/IReadPromptConfig'
import {KnownPrompts} from '../..'
import IReadBlockInteractionDetails from '../../flow-spec/IReadBlockInteractionDetails'


export class ReadBlockRunner implements IBlockRunner {
  constructor(
    public block: IReadBlock,
    public context: IContext) {}

  initialize(): IReadPromptConfig {
    const {destinationVariables, formatString} = this.block.config
    return {
      kind: KnownPrompts.Read,
      prompt: `Requesting  ${JSON.stringify(destinationVariables)}`,
      destinationVariables,
      formatString,
      isResponseRequired: false,
    }
  }

  run([interaction, prompt]: TRichCursorInputRequired): IBlockExit {
    interaction.value = zipObject(
      this.block.config.destinationVariables,
      (prompt as ReadPrompt).value as TReadableType[])

    const {error} = prompt
    if (error != null) {
      (interaction.details as IReadBlockInteractionDetails).readError = {message: error.message}
    }

    return prompt.isValid
      ? this.block.exits[0]
      : this.block.exits[1]
  }
}

export default ReadBlockRunner