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
import { BasePrompt, IChoice, ISelectManyPromptConfig } from '../..';
export declare const INVALID_AT_LEAST_ONE_SELECTION_REQUIRED = "At least one selection is required, but none provided";
export declare const INVALID_ALL_SELECTIONS_MUST_EXIST_ON_BLOCK = "All selections must be valid choices on block";
export declare const SELECT_MANY_PROMPT_KEY = "SelectMany";
/**
 * Concrete implementation of {@link BasePrompt} to request a selection from multiple choices, optionally requiring at
 * least one, from an {@link IContact}.
 */
export declare class SelectManyPrompt extends BasePrompt<ISelectManyPromptConfig> {
    validate(selections: IChoice['prompt'][]): boolean;
}
//# sourceMappingURL=SelectManyPrompt.d.ts.map