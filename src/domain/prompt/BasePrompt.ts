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
import {
  findBlockWith,
  findFlowWith,
  findInteractionWith,
  IBlock,
  IFlowRunner,
  IPrompt,
  IPromptConfig,
  IRichCursorInputRequired,
  ValidationException,
} from '../..'

export type TGenericPrompt = IPrompt<IPromptConfig<any>>

/**
 * Abstract implementation of {@link IPrompt}, intended to be consumed as a common parent for concrete {@link IPrompt}
 * implementations.
 */
export abstract class BasePrompt<T extends IPromptConfig<T['value']>> implements IPrompt<T> {
  constructor(public config: T, public interactionId: string, public runner: IFlowRunner) {
    // todo: add canPerformEarlyExit() behaviour
  }

  /** Retrieve local {@link IPromptConfig.value} */
  get value(): T['value'] {
    // todo: need a simple way to specify type as typeof <IPrompt['value']> corresponding to generics injection for this instance
    return this.config.value
  }

  /** Set local {@link IPromptConfig.value} */
  set value(val: T['value']) {
    this.config.value = val
  }

  /** Whether or not a value has been set on this instance. */
  get isEmpty(): boolean {
    return this.value === undefined
  }

  get block(): IBlock | undefined {
    const ctx = this.runner.context
    const intx = findInteractionWith(this.interactionId, ctx)
    const flow = findFlowWith(intx.flowId, ctx)

    try {
      return findBlockWith(intx.blockId, flow)
    } catch (e) {
      if (!(e instanceof ValidationException)) {
        throw e
      }

      return
    }
  }

  async fulfill(val: T['value'] | undefined): Promise<IRichCursorInputRequired | undefined> {
    this.value = val
    this.validateOrThrow(val)

    return this.runner.run()
  }

  public isValid(): boolean {
    return this.validate(this.config.value)
  }

  /**
   * Template method to be implemented by concrete {@link IPrompt} implementations.
   * @param val
   * @throws PromptValidationException
   */
  abstract validateOrThrow(val?: T['value']): void

  validate(val?: T['value']): boolean {
    try {
      this.validateOrThrow(val)
      return true
    } catch (e) {
      return false
    }
  }
}
