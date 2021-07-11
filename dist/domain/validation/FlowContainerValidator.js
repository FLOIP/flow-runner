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
                dataPath: '/containers/0/specification_version',
                schemaPath: '#/properties/specification_version/valid',
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
    const missingResources = checkAllResourcesPresent(container);
    if (missingResources != null) {
        return [
            {
                keyword: 'missing',
                dataPath: '/containers/0/resources',
                schemaPath: '#/properties/resources',
                params: [],
                propertyName: 'resources',
                message: 'Resources specified in block configurations are missing from resources: ' + missingResources.join(','),
            },
        ];
    }
    return null;
}
exports.getFlowStructureErrors = getFlowStructureErrors;
function checkAllResourcesPresent(container) {
    const resourcesRequested = [];
    container.flows.forEach(flow => {
        flow.blocks.forEach(block => {
            if (block.type == 'MobilePrimitives.Message') {
                const b = block;
                resourcesRequested.push(b.config.prompt);
            }
            if (block.type == 'MobilePrimitives.SelectOneResponse') {
                const b = block;
                if (b.config.prompt != undefined) {
                    resourcesRequested.push(b.config.prompt);
                }
                if (b.config.question_prompt != undefined) {
                    resourcesRequested.push(b.config.question_prompt);
                }
            }
            if (block.type == 'MobilePrimitives.SelectManyResponse') {
                const b = block;
                if (b.config.prompt != undefined) {
                    resourcesRequested.push(b.config.prompt);
                }
                if (b.config.question_prompt != undefined) {
                    resourcesRequested.push(b.config.question_prompt);
                }
            }
            if (block.type == 'MobilePrimitives.OpenResponse') {
                const b = block;
                resourcesRequested.push(b.config.prompt);
            }
            if (block.type == 'MobilePrimitives.NumericResponse') {
                const b = block;
                resourcesRequested.push(b.config.prompt);
            }
        });
    });
    const missingResources = [];
    const allResourceStrings = container.resources.map(r => r.uuid);
    resourcesRequested.forEach(resourcesString => {
        if (!allResourceStrings.includes(resourcesString)) {
            missingResources.push(resourcesString);
        }
    });
    if (missingResources.length > 0) {
        return missingResources;
    }
    else {
        return null;
    }
}
//# sourceMappingURL=FlowContainerValidator.js.map