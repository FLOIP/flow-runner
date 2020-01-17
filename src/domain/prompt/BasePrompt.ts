/**
 * Flow Interoperability Project (flowinterop.org)
 * Flow Runner
 * Copyright (c) 2019, 2020 Viamo Inc.
 * Authored by: Brett Zabos (brett.zabos@viamo.io)
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
 * documentation files (the "Software"), to deal in the Software without restriction, including without limitation the
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to the following conditions:
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the
 * Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
 * WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
 * OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 **/

// import UUID32 from "../../model/UUID32"
// import UUID64 from "../../model/UUID64"
import IPrompt, {IBasePromptConfig, IPromptConfig} from './IPrompt'
import PromptValidationException from '../exceptions/PromptValidationException'
import IFlowRunner from '../IFlowRunner'
import {TRichCursorInputRequired} from '../..'

// export enum KnownPrompts {
//   Message,
//   Numeric,
//   SelectOne,
//   Open,
// }


// type Validator = <PromptType>(val: PromptType) => boolean
// type x = {<PromptType>(arg: PromptType): PromptType}

export type TGenericPrompt = IPrompt<IPromptConfig<any> & IBasePromptConfig>

export interface IBasePromptConstructor {
  new (): IPrompt<IPromptConfig<any> & IBasePromptConfig>
}

export abstract class BasePrompt<PromptConfigType extends IPromptConfig<PromptConfigType['value']> & IBasePromptConfig>
  implements IPrompt<PromptConfigType> {

  error: PromptValidationException | null = null
  isValid = false

  constructor(
    public config: PromptConfigType & IBasePromptConfig,
    public interactionId: string,
    public runner: IFlowRunner,) {

    // todo: add canPerformEarlyExit() behaviour
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

  fulfill(val: PromptConfigType['value'] | undefined): TRichCursorInputRequired | undefined {
    if (val !== undefined) { // allow prompt.fulfill() for continuation
      this.value = val
    }

    return this.runner.run()
  }

  abstract validate(val?: PromptConfigType['value']): boolean
}

export default BasePrompt