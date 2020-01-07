import {isArray} from 'lodash'
import scanf from "scanf"
import BasePrompt from './BasePrompt'
import {IBasePromptConfig} from './IPrompt'
import ValidationException from '../exceptions/ValidationException'
import {IReadError, IReadPromptConfig, TReadableType} from './IReadPromptConfig'
import IFlowRunner from '../IFlowRunner'

export interface IConsolePrompt {
  read(): void
}

export function isReadError(e: IReadPromptConfig['value']): e is IReadError {
  return e != null
    && (e as IReadError).message != null
}

export default class ReadPrompt
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
      this.console.log('Requesting ', JSON.stringify(this.config.destinationVariables))
      const input: TReadableType | TReadableType[] = scanf(this.config.formatString)
      this.value = isArray(input) ? input : [input]
    } catch ({message}) {
      this.value = {message} // so that we're json-serializable throughout the process
    }
  }

  validate(readValues: IReadPromptConfig['value']): boolean {
    const {destinationVariables} = this.config

    if (readValues == null) {
      throw new ValidationException('Value provided must be a list of string|number')
    }

    if (isReadError(readValues)) {
      return true
    }

    if (readValues.length !== destinationVariables.length) {
      throw new ValidationException('Values provided must match length of destinationVariables')
    }

    return true
  }
}