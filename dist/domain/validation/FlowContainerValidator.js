"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFlowStructureErrors = void 0;
const tslib_1 = require("tslib");
const ajv_1 = tslib_1.__importDefault(require("ajv"));
const ajv_formats_1 = tslib_1.__importDefault(require("ajv-formats"));
const validRCs = ['1.0.0-rc1', '1.0.0-rc2', '1.0.0-rc3', '1.0.0-rc4'];
function filePathFromSpecificationVersion(version, schemaFileName) {
    if (!validRCs.includes(version)) {
        return '';
    }
    return `../../../dist/resources/validationSchema/${version}/${schemaFileName}.json`;
}
function getFlowStructureErrors(container, shouldValidateBlocks = true) {
    if (!validRCs.includes(container.specification_version)) {
        return [
            {
                keyword: 'version',
                dataPath: '/container/specification_version',
                schemaPath: '#/properties/specification_version',
                params: [],
                propertyName: 'specification_version',
                message: 'Unsupported specification version',
            },
        ];
    }
    const flowSpecJsonSchema = require(`../../../dist/resources/validationSchema/${container.specification_version}/flowSpecJsonSchema.json`);
    const ajv = new ajv_1.default();
    ajv_formats_1.default(ajv);
    const validate = ajv.compile(flowSpecJsonSchema);
    if (!validate(container)) {
        return validate.errors;
    }
    if (shouldValidateBlocks) {
        const blockSpecificErrors = checkIndividualBlocks(container);
        if (blockSpecificErrors && blockSpecificErrors.length > 0) {
            return blockSpecificErrors;
        }
    }
    const missingResources = checkAllResourcesPresent(container);
    if (missingResources != null) {
        return [
            {
                keyword: 'missing',
                dataPath: '/container/resources',
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
function checkIndividualBlocks(container) {
    let errors = [];
    container.flows.forEach((flow, flowIndex) => {
        flow.blocks.forEach((block, blockIndex) => {
            errors = errors.concat(checkIndividualBlock(block, container, blockIndex, flowIndex));
        });
    });
    return errors;
}
function checkIndividualBlock(block, container, blockIndex, flowIndex) {
    var _a;
    const schemaFileName = blockTypeToInterfaceName(block.type);
    if (schemaFileName != null) {
        const ajv = new ajv_1.default();
        ajv_formats_1.default(ajv);
        const jsonSchema = require(filePathFromSpecificationVersion(container.specification_version, schemaFileName));
        const validate = ajv.compile(jsonSchema);
        if (!validate(block)) {
            return (_a = validate.errors) === null || _a === void 0 ? void 0 : _a.map(error => {
                error.dataPath = '/container/flows/' + flowIndex + '/blocks/' + blockIndex + error.dataPath;
                return error;
            });
        }
    }
    const exitError = checkExitsOnBlock(block);
    if (exitError != null) {
        return [
            {
                keyword: 'invalid',
                dataPath: '/container/flows/' + flowIndex + '/blocks/' + blockIndex + '/exits',
                schemaPath: '#/properties/exits',
                params: [],
                propertyName: 'exits',
                message: exitError,
            },
        ];
    }
    return [];
}
function checkExitsOnBlock(block) {
    if (block.exits.length < 1) {
        return 'There must be at least one exit.';
    }
    if (block.exits[block.exits.length - 1].default != true) {
        return 'The last exit must be a default exit.';
    }
    if (block.exits.slice(0, -1).reduce(function (prev, current, _i) {
        return prev || current.default == true;
    }, false)) {
        return 'There must not be more than one default exit.';
    }
    return null;
}
function blockTypeToInterfaceName(type) {
    switch (type) {
        case 'Core.Log':
            return 'ILogBlock';
        case 'Core.Case':
            return 'ICaseBlock';
        case 'Core.RunBlock':
            return 'IRunFlowBlock';
        case 'Core.Output':
            return 'IOutputBlock';
        case 'Core.SetContactProperty':
            return 'ISetContactPropertyBlock';
        case 'Core.SetGroupMembership':
            return 'ISetGroupMembershipBlock';
        case 'ConsoleIO.Print':
            return 'IPrintBlock';
        case 'ConsoleIO.Read':
            return 'IReadBlock';
        case 'MobilePrimitives.Message':
            return 'IMessageBlock';
        case 'MobilePrimitives.SelectOneResponse':
            return 'ISelectOneResponseBlock';
        case 'MobilePrimitives.SelectManyResponses':
            return 'ISelectManyResponseBlock';
        case 'MobilePrimitives.NumericResponse':
            return 'INumericResponseBlock';
        case 'MobilePrimitives.OpenResponse':
            return 'IOpenResponseBlock';
        case 'SmartDevices.LocationResponse':
            return 'ILocationResponseBlock';
        case 'SmartDevices.PhotoResponse':
            return 'IPhotoResponseBlock';
        default:
            return null;
    }
}
function checkAllResourcesPresent(container) {
    const resourcesRequested = [];
    const allResources = [];
    container.flows.forEach(flow => {
        allResources.push(...flow.resources);
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
    const allResourceStrings = allResources.map(r => r.uuid);
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