"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConfigWithResourcesForAdvancedSelectOne = void 0;
const __1 = require("../..");
function getConfigWithResourcesForAdvancedSelectOne(context, config) {
    var _a, _b;
    return Object.assign(Object.assign({}, config), { primaryField: __1.getResource(context, config.primaryField).getText(), secondaryFields: (_a = config === null || config === void 0 ? void 0 : config.secondaryFields) === null || _a === void 0 ? void 0 : _a.map(field => __1.getResource(context, field).getText()), choiceRowFields: config.choiceRowFields.map(field => __1.getResource(context, field).getText()), choiceRows: __1.getResource(context, config.choiceRows).getCsv(), responseFields: (_b = config.responseFields) === null || _b === void 0 ? void 0 : _b.map(field => __1.getResource(context, field).getText()) });
}
exports.getConfigWithResourcesForAdvancedSelectOne = getConfigWithResourcesForAdvancedSelectOne;
//# sourceMappingURL=IAdvancedSelectOnePromptConfig.js.map