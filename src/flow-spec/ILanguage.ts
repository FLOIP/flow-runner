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

/**
 * Language descriptor used within Flows and Resources: https://floip.gitbook.io/flow-specification/flows#language-objects-and-identifiers
 */
export interface ILanguage {
  /**
   * Language Identifier, e.g. "eng-female", described in https://floip.gitbook.io/flow-specification/flows#language-identifiers
   */
  id: string

  /**
   * Human-readable description for this language and variant.
   */
  label?: string

  /**
   * ISO 639-3 code for the language. This is a 3-letter string, e.g. "eng".
   * "mis" is the ISO 639-3 code for languages not yet included in ISO 639-3.
   *
   * @TJS-pattern ^[a-z][a-z][a-z]$
   */
  iso_639_3: string

  /**
   * Where multiple languages/content sets are used with the same ISO 639-3 code, variant describes the specialization, e.g. "east_africa".
   */
  variant?: string

  /**
   * The BCP 47 locale code for this language, e.g. "en-GB".
   * These codes are often useful in conjunction with speech synthesis and speech recognition tools.
   */
  bcp_47?: string
}
