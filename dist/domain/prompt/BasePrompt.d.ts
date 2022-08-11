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
import { IBlock, IFlowRunner, IPrompt, IPromptConfig, IRichCursorInputRequired, PromptValidationException } from '../..';
export declare type TGenericPrompt = IPrompt;
/**
 * Abstract implementation of {@link IPrompt}, intended to be consumed as a common parent for concrete {@link IPrompt}
 * implementations.
 */
export declare abstract class BasePrompt<T extends IPromptConfig<T['value']>> implements IPrompt<T> {
    config: T;
    interactionId: string;
    runner: IFlowRunner;
    error: PromptValidationException | null;
    constructor(config: T, interactionId: string, runner: IFlowRunner);
    /** Retrieve local {@link IPromptConfig.value} */
    get value(): T['value'];
    /**
     * Set local {@link IPromptConfig.value}. This action is guarded by {@link validate}, where the result of
     * {@link validate} is applied to {@link isValid}. Any exceptions raised by {@link validate} are applied to
     * {@link error} property.
     *
     * It's important to note that {@link value} property will be set (proxied onto local {@link IPromptConfig.value})
     * regardless of any {@link PromptValidationException}s raised. */
    set value(val: T['value']);
    /** Whether or not a value has been set on this instance. */
    get isEmpty(): boolean;
    get block(): IBlock | undefined;
    fulfill(val: T['value'] | undefined): Promise<IRichCursorInputRequired | undefined>;
    isValid(): boolean;
    /**
     * Template method to be implemented by concrete {@link IPrompt} implementations.
     * @param val
     */
    abstract validate(val?: T['value']): boolean;
}
//# sourceMappingURL=BasePrompt.d.ts.map