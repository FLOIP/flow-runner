"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const ResourceResolver_1 = tslib_1.__importDefault(require("../domain/ResourceResolver"));
class Context {
    constructor(contact, createdAt, cursor, deliveryStatus, entryAt, exitAt, firstFlowId, flows, id, interactions, languageId, mode, nestedFlowBlockInteractionIdStack, resources, sessionVars, userId) {
        this.contact = contact;
        this.createdAt = createdAt;
        this.cursor = cursor;
        this.deliveryStatus = deliveryStatus;
        this.entryAt = entryAt;
        this.exitAt = exitAt;
        this.firstFlowId = firstFlowId;
        this.flows = flows;
        this.id = id;
        this.interactions = interactions;
        this.languageId = languageId;
        this.mode = mode;
        this.nestedFlowBlockInteractionIdStack = nestedFlowBlockInteractionIdStack;
        this.resources = resources;
        this.sessionVars = sessionVars;
        this.userId = userId;
    }
    getResource(resourceId) {
        return new ResourceResolver_1.default(this)
            .resolve(resourceId);
    }
}
exports.default = Context;
//# sourceMappingURL=Context.js.map