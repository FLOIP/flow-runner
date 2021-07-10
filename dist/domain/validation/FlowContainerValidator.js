"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFlowStructureErrors = void 0;
const tslib_1 = require("tslib");
const ajv_1 = tslib_1.__importDefault(require("ajv"));
const ajv_formats_1 = tslib_1.__importDefault(require("ajv-formats"));
function getFlowStructureErrors(container) {
    let flowSpecJsonSchema;
    if (container.specification_version == '1.0.0-rc1') {
        flowSpecJsonSchema = require('../../../dist/resources/validationSchema/1.0.0-rc1/flowSpecJsonSchema.json');
    }
    else if (container.specification_version == '1.0.0-rc2') {
        flowSpecJsonSchema = require('../../../dist/resources/validationSchema/1.0.0-rc2/flowSpecJsonSchema.json');
    }
    else {
        return [
            {
                keyword: 'version',
                dataPath: 'container',
                schemaPath: 'container',
                params: [],
                propertyName: 'specification_version',
                message: 'Unsupported specification version',
            },
        ];
    }
    const ajv = new ajv_1.default();
    ajv_formats_1.default(ajv);
    const validate = ajv.compile(flowSpecJsonSchema);
    if (!validate(container)) {
        return validate.errors;
    }
    return null;
}
exports.getFlowStructureErrors = getFlowStructureErrors;
//# sourceMappingURL=FlowContainerValidator.js.map