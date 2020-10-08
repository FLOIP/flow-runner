"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConfigWithResourcesForAdvancedSelectOne = void 0;
function getConfigWithResourcesForAdvancedSelectOne(context, config) {
    var _a;
    return Object.assign(Object.assign({}, config), { primaryField: context.getResource(config.primaryField).getText(), secondaryFields: config.secondaryFields.map(field => context.getResource(field).getText()), choiceRowFields: config.choiceRowFields.map(field => context.getResource(field).getText()), choiceRows: config.choiceRows.map(row => row.map(cell => context.getResource(cell).getText())), responseFields: (_a = config.responseFields) === null || _a === void 0 ? void 0 : _a.map(field => context.getResource(field).getText()) });
}
exports.getConfigWithResourcesForAdvancedSelectOne = getConfigWithResourcesForAdvancedSelectOne;
//# sourceMappingURL=IAdvancedSelectOnePromptConfig.js.map