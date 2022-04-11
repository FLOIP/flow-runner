"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFlowStructureErrors = void 0;
const tslib_1 = require("tslib");
const ajv_1 = tslib_1.__importDefault(require("ajv"));
const ajv_formats_1 = tslib_1.__importDefault(require("ajv-formats"));
const lodash_1 = require("lodash");
function getJsonSchemaFrom(version, schemaFileName) {
    try {
        return require(`../../../dist/resources/validationSchema/${version}/${schemaFileName}.json`);
    }
    catch (_e) {
        return null;
    }
}
function getFlowStructureErrors(container, shouldValidateBlocks = true) {
    const flowSpecJsonSchema = getJsonSchemaFrom(container.specification_version, 'flowSpecJsonSchema');
    if (flowSpecJsonSchema == null) {
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
                dataPath: '/flows/*/resources',
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
        const blockJsonSchema = getJsonSchemaFrom(container.specification_version, schemaFileName);
        if (blockJsonSchema == null) {
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
        const validate = ajv.compile(blockJsonSchema);
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
    let allResources = [];
    if (container.specification_version < '1.0.0-rc4') {
        allResources = lodash_1.get(container, 'resources');
    }
    else {
        allResources = [];
    }
    container.flows.forEach(flow => {
        if (container.specification_version >= '1.0.0-rc4') {
            allResources.push(...flow.resources);
        }
        flow.blocks.forEach(block => {
            resourcesRequested.push(...collectResourceUuidsFromBlock(block));
        });
    });
    const allResourceStrings = allResources.map(r => r.uuid);
    const missingResources = lodash_1.difference(resourcesRequested, allResourceStrings);
    if (missingResources.length > 0) {
        return missingResources;
    }
    else {
        return null;
    }
}
function collectResourceUuidsFromBlock(block) {
    const uuids = [];
    if (block.type == 'MobilePrimitives.Message') {
        const b = block;
        uuids.push(b.config.prompt);
    }
    if (block.type == 'MobilePrimitives.SelectOneResponse') {
        const b = block;
        if (b.config.prompt != undefined) {
            uuids.push(b.config.prompt);
        }
        if (b.config.question_prompt != undefined) {
            uuids.push(b.config.question_prompt);
        }
    }
    if (block.type == 'MobilePrimitives.SelectManyResponse') {
        const b = block;
        if (b.config.prompt != undefined) {
            uuids.push(b.config.prompt);
        }
        if (b.config.question_prompt != undefined) {
            uuids.push(b.config.question_prompt);
        }
    }
    if (block.type == 'MobilePrimitives.OpenResponse') {
        const b = block;
        uuids.push(b.config.prompt);
    }
    if (block.type == 'MobilePrimitives.NumericResponse') {
        const b = block;
        uuids.push(b.config.prompt);
    }
    if (block.type == 'Core.Log') {
        const b = block;
        uuids.push(b.config.message);
    }
    return uuids;
}
//# sourceMappingURL=FlowContainerValidator.js.map