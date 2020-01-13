import {fill, isArray} from 'lodash'
import scanf from "scanf"
import BasePrompt from './BasePrompt'
import {IBasePromptConfig} from './IPrompt'
import ValidationException from '../exceptions/ValidationException'
import {IReadPromptConfig, TReadableType} from './IReadPromptConfig'
import IFlowRunner from '../IFlowRunner'
import {PromptValidationException} from '../..'

export interface IConsolePrompt {
  read(): void
}

export class ReadPrompt
  extends BasePrompt<IReadPromptConfig & IBasePromptConfig>
  implements IConsolePrompt {

  constructor(
    public config: IReadPromptConfig & IBasePromptConfig,
    public interactionId: string,
    public runner: IFlowRunner,
    public console: Console = console) {

    super(config, interactionId, runner)
  }

  read(): void {
    try {
      this.console.log(this.config.prompt)
      const input: TReadableType | TReadableType[] = scanf(this.config.formatString)
      this.value = isArray(input) ? input : [input]
    } catch ({message}) {
      this.value = fill(new Array(this.config.destinationVariables.length), null) // default to null as empties
      this.error = new PromptValidationException(message)
    }
  }

  validate(readValues: IReadPromptConfig['value']): boolean {
    const {destinationVariables} = this.config

    if (readValues == null) {
      throw new ValidationException('Value provided must be a list of string|number')
    }

    if (readValues.length !== destinationVariables.length) {
      throw new ValidationException('Values provided must match length of destinationVariables')
    }

    return true
  }
}

export default ReadPrompt