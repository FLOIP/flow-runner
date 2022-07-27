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

import {IBlockConfig} from '../..'

export interface ISelectOneResponseBlockConfig extends IBlockConfig {
  /**
   * The question prompt that should be displayed to the contact,
   * e.g. "What is your favorite kind of ice cream? Reply 1 for chocolate, 2 for vanilla, and 3 for strawberry."
   * Either prompt or question_prompt should be provided.
   * (For legacy compatibility, implementations may omit prompts completely
   * when guidance has been given to the Contact in a previous block, but this is not recommended.
   * In this case, the block will wait silently for a response.)
   * @format uuid
   */
  prompt?: string

  /**
   * For instances when the question prompt should be separated from the presentation of choices,
   * e.g. "What is your favorite kind of ice cream?".
   * If included, blocks must provide suitable resources within choices to present the choices on each supported mode.
   * For the IVR mode, they must also provide digit_prompts.
   * @format uuid
   */
  question_prompt?: string

  /** Set of choices to select from */
  choices: Record<string, Choice>

  /** optional IVR-specific config */
  ivr?: IvrConfig
}

interface Choice {
  /**
   * Key identifying this choice. This is what will be written into the block output (block.value)
   * when a contact selects this choice, e.g. "chocolate" or "Somewhat Agree"
   */
  name: string

  /** This test applies to IVR flows */
  ivr_test?: IvrTest

  /**
   * These tests apply to non-IVR flows.
   * There may be multiple tests per choice: any matching test will indicate that the choice has been selected
   */
  text_tests?: TextTest[]

  /**
   * Resource used to present/display/announce this choice to contacts, appropriate for the language and mode
   * @format uuid
   */
  prompt: string
}

interface IvrTest {
  /**
   * The first choice with an expression that evaluates to a truthy value is the selected choice.
   * Often this expression would examine the raw response from the contact, e.g. "block.response = 1".
   * IVR responses are not expected to vary across languages, so this test applies to all.
   * @format floip-expression
   */
  test_expression: string
}

interface TextTest {
  /**
   * Language Identifier for which this test applies.
   * If omitted, the test will apply to all languages.
   * Multiple tests may apply to the same language
   */
  language?: string

  /**
   * The first choice with an expression that evaluates to a truthy value is the selected choice.
   * Often this expression would examine the raw response from the contact, e.g. "block.response = 1".
   * @format floip-expression
   */
  test_expression: string
}

interface IvrConfig {
  /**
   * An ordered set of audio prompts, with the same length as choices,
   * with content such as "Press 1", "Press 2", "Press 3".
   * This is required when using question_prompt to present choices individually.
   * @format uuids
   */
  digit_prompts?: string[]

  /**
   * Indicates that the choices should be presented in a random order to each Contact.
   * (Used to minimize response order bias in surveying). Default false.
   * Requires the use of question_prompt, choices_prompt, and ivr.digit_prompts to present choices individually.
   */
  randomize_choice_order?: boolean
}
