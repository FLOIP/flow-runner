"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFlowStructureErrors = void 0;
const tslib_1 = require("tslib");
const ajv_1 = tslib_1.__importDefault(require("ajv"));
function getFlowStructureErrors(container) {
    const flowSpecJsonSchema = require('../../../dist/resources/flowSpecJsonSchema.json');
    const ajv = new ajv_1.default();
    const validate = ajv.compile(flowSpecJsonSchema);
    if (!validate(container)) {
        return validate.errors;
    }
    return null;
}
exports.getFlowStructureErrors = getFlowStructureErrors;
//# sourceMappingURL=FlowContainerValidator.js.map