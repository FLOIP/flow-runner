"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const ResourceResolver_1 = tslib_1.__importDefault(require("../domain/ResourceResolver"));
class Context {
    constructor(id, createdAt, deliveryStatus, mode, languageId, contact, sessionVars, interactions, nestedFlowBlockInteractionIdStack, reversibleOperations, flows, firstFlowId, resources, entryAt, exitAt, userId, orgId, cursor, platformMetadata = {}, logs = {}) {
        this.id = id;
        this.createdAt = createdAt;
        this.deliveryStatus = deliveryStatus;
        this.mode = mode;
        this.languageId = languageId;
        this.contact = contact;
        this.sessionVars = sessionVars;
        this.interactions = interactions;
        this.nestedFlowBlockInteractionIdStack = nestedFlowBlockInteractionIdStack;
        this.reversibleOperations = reversibleOperations;
        this.flows = flows;
        this.firstFlowId = firstFlowId;
        this.resources = resources;
        this.entryAt = entryAt;
        this.exitAt = exitAt;
        this.userId = userId;
        this.orgId = orgId;
        this.cursor = cursor;
        this.platformMetadata = platformMetadata;
        this.logs = logs;
    }
    getResource(resourceId) {
        return new ResourceResolver_1.default(this)
            .resolve(resourceId);
    }
}
exports.Context = Context;
exports.default = Context;
//# sourceMappingURL=Context.js.map