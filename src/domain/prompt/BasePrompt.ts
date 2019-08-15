// import UUID32 from "../../model/UUID32"
// import UUID64 from "../../model/UUID64"
import IPrompt, {IBasePromptConfig, IPromptConfig} from './IPrompt'
import PromptValidationException from '../exceptions/PromptValidationException'
import IBlockInteraction from '../../flow-spec/IBlockInteraction'
import IBlock from '../../flow-spec/IBlock'
// import {KnownPrompts} from "./IPrompt";

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
    // todo: figure out a nice pattern for hydrating UUIDs
    public block: IBlock,
    public interaction: IBlockInteraction,
    public config: PromptConfigType & IBasePromptConfig) {

    // todo: add canPerformEarlyExit() behaviour
  }

  get value(): PromptConfigType['value'] {
    // todo: need a simple way to specify type as typeof <IPrompt['value']> corresponding to generics injection for this instance
    return this.config.value
  }

  set value(val: PromptConfigType['value']) {
    try {
      this.validate(val)
    } catch (e) {
      if (!(e instanceof PromptValidationException)) {
        throw e
      }

      this.error = e
    }

    this.config.value = val
  }

  abstract validate(val?: PromptConfigType['value']): boolean
}