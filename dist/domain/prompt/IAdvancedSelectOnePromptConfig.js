"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConfigWithResourcesForAdvancedSelectOne = void 0;
const __1 = require("../..");
function getConfigWithResourcesForAdvancedSelectOne(context, config) {
    var _a;
    return Object.assign(Object.assign({}, config), { primaryField: __1.getResource(context, config.primaryField).getText(), secondaryFields: config.secondaryFields.map(field => __1.getResource(context, field).getText()), choiceRowFields: config.choiceRowFields.map(field => __1.getResource(context, field).getText()), choiceRows: config.choiceRows.map(row => row.map(cell => __1.getResource(context, cell).getText())), responseFields: (_a = config.responseFields) === null || _a === void 0 ? void 0 : _a.map(field => __1.getResource(context, field).getText()) });
}
exports.getConfigWithResourcesForAdvancedSelectOne = getConfigWithResourcesForAdvancedSelectOne;
//# sourceMappingURL=IAdvancedSelectOnePromptConfig.js.map