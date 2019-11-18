"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var IFlow_1 = require("./IFlow");
var lodash_1 = require("lodash");
var ValidationException_1 = tslib_1.__importDefault(require("../domain/exceptions/ValidationException"));
var DeliveryStatus_1 = tslib_1.__importDefault(require("./DeliveryStatus"));
var IdGeneratorUuidV4_1 = tslib_1.__importDefault(require("../domain/IdGeneratorUuidV4"));
function createContextDataObjectFor(contact, userId, orgId, flows, languageId, mode, resources, idGenerator) {
    if (resources === void 0) { resources = []; }
    if (idGenerator === void 0) { idGenerator = new IdGeneratorUuidV4_1.default(); }
    return {
        id: idGenerator.generate(),
        createdAt: (new Date).toISOString().replace('T', ' '),
        deliveryStatus: DeliveryStatus_1.default.QUEUED,
        userId: userId,
        orgId: orgId,
        mode: mode,
        languageId: languageId,
        contact: contact,
        sessionVars: {},
        interactions: [],
        nestedFlowBlockInteractionIdStack: [],
        flows: flows,
        firstFlowId: flows[0].uuid,
        resources: resources,
        platformMetadata: {},
    };
}
exports.createContextDataObjectFor = createContextDataObjectFor;
function findInteractionWith(uuid, _a) {
    var interactions = _a.interactions;
    var interaction = lodash_1.find(interactions, { uuid: uuid });
    if (interaction == null) {
        throw new ValidationException_1.default("Unable to find interaction on context: " + uuid + " in " + interactions.map(function (i) { return i.uuid; }));
    }
    return interaction;
}
exports.findInteractionWith = findInteractionWith;
function findFlowWith(uuid, _a) {
    var flows = _a.flows;
    var flow = lodash_1.find(flows, { uuid: uuid });
    if (flow == null) {
        throw new ValidationException_1.default("Unable to find flow on context: " + uuid + " in " + flows.map(function (f) { return f.uuid; }));
    }
    return flow;
}
exports.findFlowWith = findFlowWith;
function findBlockOnActiveFlowWith(uuid, ctx) {
    return IFlow_1.findBlockWith(uuid, getActiveFlowFrom(ctx));
}
exports.findBlockOnActiveFlowWith = findBlockOnActiveFlowWith;
function findNestedFlowIdFor(interaction, ctx) {
    var flow = findFlowWith(interaction.flowId, ctx);
    var runFlowBlock = IFlow_1.findBlockWith(interaction.blockId, flow);
    var flowId = runFlowBlock.config.flowId;
    if (flowId == null) {
        throw new ValidationException_1.default('Unable to find nested flowId on Core\\RunFlowBlock');
    }
    return flowId;
}
exports.findNestedFlowIdFor = findNestedFlowIdFor;
function getActiveFlowIdFrom(ctx) {
    var firstFlowId = ctx.firstFlowId, nestedFlowBlockInteractionIdStack = ctx.nestedFlowBlockInteractionIdStack;
    if (nestedFlowBlockInteractionIdStack.length === 0) {
        return firstFlowId;
    }
    var interaction = findInteractionWith(lodash_1.last(nestedFlowBlockInteractionIdStack), ctx);
    return findNestedFlowIdFor(interaction, ctx);
}
exports.getActiveFlowIdFrom = getActiveFlowIdFrom;
function getActiveFlowFrom(ctx) {
    return findFlowWith(getActiveFlowIdFrom(ctx), ctx);
}
exports.getActiveFlowFrom = getActiveFlowFrom;
//# sourceMappingURL=IContext.js.map