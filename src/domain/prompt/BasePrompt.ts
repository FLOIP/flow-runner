// import UUID32 from "../../model/UUID32"
// import UUID64 from "../../model/UUID64"
import IPrompt, {IBasePromptConfig, IPromptConfig} from './IPrompt'
import PromptValidationException from '../exceptions/PromptValidationException'
import IFlowRunner from '../IFlowRunner'
import {RichCursorInputRequiredType} from '../..'

// export enum KnownPrompts {
//   Message,
//   Numeric,
//   SelectOne,
//   Open,
// }


// type Validator = <PromptType>(val: PromptType) => boolean
// type x = {<PromptType>(arg: PromptType): PromptType}

export default abstract class BasePrompt<PromptConfigType extends IPromptConfig<PromptConfigType['value']> & IBasePromptConfig>
  implements IPrompt<PromptConfigType> {

  error: PromptValidationException | null = null
  isValid = false

  constructor(
    public config: PromptConfigType & IBasePromptConfig,
    // todo: figure out a nice pattern for hydrating UUIDs
    public interactionId: string,
    public runner: IFlowRunner,) {

    // todo: add canPerformEarlyExit() behaviour
    // todo: should perform initial validate() here?
  }

  get value(): PromptConfigType['value'] {
    // todo: need a simple way to specify type as typeof <IPrompt['value']> corresponding to generics injection for this instance
    return this.config.value
  }

  set value(val: PromptConfigType['value']) {
    try {
      this.isValid = this.validate(val)
    } catch (e) {
      if (!(e instanceof PromptValidationException)) {
        throw e
      }

      this.error = e
    }

    this.config.value = val
  }

  get isEmpty() {
    return this.value === undefined
  }

  fulfill(val: PromptConfigType['value']): RichCursorInputRequiredType | undefined {
    this.value = val
    return this.runner.run()
  }

  abstract validate(val?: PromptConfigType['value']): boolean
}