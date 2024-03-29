"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdvancedSelectOnePrompt = exports.ADVANCED_SELECT_ONE_PROMPT_KEY = void 0;
const __1 = require("../..");
exports.ADVANCED_SELECT_ONE_PROMPT_KEY = 'AdvancedSelectOne';
class AdvancedSelectOnePrompt extends __1.BasePrompt {
    /**
     * This is commented out, because It's literally impossible for this to pass, as a CSV is needed in order to handle this, and the CSV
     * data never gets put into FlowRunner.
     **/
    validate( /*selectedRow?: IAdvancedSelectOne[] , choiceRows?: string[][]*/) {
        /*const {choiceRowFields, isResponseRequired} = this.config
    
        assertNotNull(
          choiceRows,
          () => 'choiceRows must be non-null',
          message => new ValidationException(message)
        )
    
        if (isResponseRequired) {
          const hasSelectedRow = choiceRows.some(row =>
            selectedRow?.every(selection => {
              const columnIndex = choiceRowFields.indexOf(selection.name)
              if (columnIndex < 0) {
                throw new ValidationException(`Failed to find a column called: ${selection.name}`)
              } else {
                return selection.value === row[columnIndex]
              }
            })
          )
          if (!hasSelectedRow) {
            throw new ValidationException(`Failed to find the given row: ${selectedRow}`)
          }
        }*/
        return true;
    }
}
exports.AdvancedSelectOnePrompt = AdvancedSelectOnePrompt;
//# sourceMappingURL=AdvancedSelectOnePrompt.js.map