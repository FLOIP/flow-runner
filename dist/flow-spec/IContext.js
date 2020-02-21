"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const IFlow_1 = require("./IFlow");
const IBlock_1 = require("./IBlock");
const lodash_1 = require("lodash");
const ValidationException_1 = tslib_1.__importDefault(require("../domain/exceptions/ValidationException"));
const DeliveryStatus_1 = tslib_1.__importDefault(require("./DeliveryStatus"));
const SupportedMode_1 = tslib_1.__importDefault(require("./SupportedMode"));
const IdGeneratorUuidV4_1 = tslib_1.__importDefault(require("../domain/IdGeneratorUuidV4"));
const DateFormat_1 = tslib_1.__importDefault(require("../domain/DateFormat"));
function createContextDataObjectFor(contact, userId, orgId, flows, languageId, mode = SupportedMode_1.default.OFFLINE, resources = [], idGenerator = new IdGeneratorUuidV4_1.default()) {
    return {
        id: idGenerator.generate(),
        createdAt: DateFormat_1.default(),
        deliveryStatus: DeliveryStatus_1.default.QUEUED,
        userId,
        orgId,
        mode,
        languageId,
        contact,
        sessionVars: {},
        interactions: [],
        nestedFlowBlockInteractionIdStack: [],
        reversibleOperations: [],
        flows,
        firstFlowId: flows[0].uuid,
        resources,
        platformMetadata: {},
        logs: {},
    };
}
exports.createContextDataObjectFor = createContextDataObjectFor;
function findInteractionWith(uuid, { interactions }) {
    const interaction = lodash_1.findLast(interactions, { uuid });
    if (interaction == null) {
        throw new ValidationException_1.default(`Unable to find interaction on context: ${uuid} in ${interactions.map(i => i.uuid)}`);
    }
    return interaction;
}
exports.findInteractionWith = findInteractionWith;
function findFlowWith(uuid, { flows }) {
    const flow = lodash_1.find(flows, { uuid });
    if (flow == null) {
        throw new ValidationException_1.default(`Unable to find flow on context: ${uuid} in ${flows.map(f => f.uuid)}`);
    }
    return flow;
}
exports.findFlowWith = findFlowWith;
function findBlockOnActiveFlowWith(uuid, ctx) {
    return IFlow_1.findBlockWith(uuid, getActiveFlowFrom(ctx));
}
exports.findBlockOnActiveFlowWith = findBlockOnActiveFlowWith;
function findNestedFlowIdFor(interaction, ctx) {
    const flow = findFlowWith(interaction.flowId, ctx);
    const runFlowBlock = IFlow_1.findBlockWith(interaction.blockId, flow);
    const flowId = runFlowBlock.config.flowId;
    if (flowId == null) {
        throw new ValidationException_1.default('Unable to find nested flowId on Core\\RunFlow');
    }
    return flowId;
}
exports.findNestedFlowIdFor = findNestedFlowIdFor;
function getActiveFlowIdFrom(ctx) {
    const { firstFlowId, nestedFlowBlockInteractionIdStack } = ctx;
    if (nestedFlowBlockInteractionIdStack.length === 0) {
        return firstFlowId;
    }
    const interaction = findInteractionWith(lodash_1.last(nestedFlowBlockInteractionIdStack), ctx);
    return findNestedFlowIdFor(interaction, ctx);
}
exports.getActiveFlowIdFrom = getActiveFlowIdFrom;
function getActiveFlowFrom(ctx) {
    return findFlowWith(getActiveFlowIdFrom(ctx), ctx);
}
exports.getActiveFlowFrom = getActiveFlowFrom;
function isLastBlockOn({ nestedFlowBlockInteractionIdStack }, block) {
    return nestedFlowBlockInteractionIdStack.length === 0 && IBlock_1.isLastBlock(block);
}
exports.isLastBlockOn = isLastBlockOn;
exports.contextService = {
    findInteractionWith,
    findFlowWith,
    findBlockOnActiveFlowWith,
    findNestedFlowIdFor,
    getActiveFlowIdFrom,
    getActiveFlowFrom,
    isLastBlockOn,
};
//# sourceMappingURL=IContext.js.map