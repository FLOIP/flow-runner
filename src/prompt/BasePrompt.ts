/*
 * Copyright (c) Viamo, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 */
import {
  findBlockWith,
  findFlowWith,
  findInteractionWith,
  IBlock,
  IFlowRunner,
  IPrompt,
  IPromptConfig,
  IRichCursorInputRequired,
  PromptValidationException,
  ValidationException,
} from '..'

export type TGenericPrompt = IPrompt<IPromptConfig<any>>

/**
 * Abstract implementation of {@link IPrompt}, intended to be consumed as a common parent for concrete {@link IPrompt}
 * implementations.
 */
export abstract class BasePrompt<T extends IPromptConfig<T['value']>> implements IPrompt<T> {
  error: PromptValidationException | null = null

  constructor(public config: T, public interactionId: string, public runner: IFlowRunner) {
    // todo: add canPerformEarlyExit() behaviour
  }

  /** Retrieve local {@link IPromptConfig.value} */
  get value(): T['value'] {
    // todo: need a simple way to specify type as typeof <IPrompt['value']> corresponding to generics injection for this instance
    return this.config.value
  }

  /**
   * Set local {@link IPromptConfig.value}. This action is guarded by {@link validate}, where the result of
   * {@link validate} is applied to {@link isValid}. Any exceptions raised by {@link validate} are applied to
   * {@link error} property.
   *
   * It's important to note that {@link value} property will be set (proxied onto local {@link IPromptConfig.value})
   * regardless of any {@link PromptValidationException}s raised. */
  set value(val: T['value']) {
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
    // allow prompt.fulfill() for continuation
    if (val !== undefined) {
      this.value = val
    }

    return this.runner.run()
  }

  public isValid(): boolean {
    try {
      return this.validate(this.config.value)
    } catch (e) {
      return false
    }
  }

  /**
   * Template method to be implemented by concrete {@link IPrompt} implementations.
   * @param val
   */
  abstract validate(val?: T['value']): boolean
}
