"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Context = void 0;
const index_1 = require("../../index");
class Context {
    constructor(id, createdAt, deliveryStatus, mode, languageId, contact, sessionVars, interactions, nestedFlowBlockInteractionIdStack, reversibleOperations, flows, firstFlowId, resources, entryAt, exitAt, userId, orgId, cursor, platformMetadata = {}, logs = {}) {
        this.platformMetadata = {};
        this.logs = {};
        this.logs = logs;
        this.platformMetadata = platformMetadata;
        this.cursor = cursor;
        this.orgId = orgId;
        this.userId = userId;
        this.exitAt = exitAt;
        this.entryAt = entryAt;
        this.resources = resources;
        this.firstFlowId = firstFlowId;
        this.flows = flows;
        this.reversibleOperations = reversibleOperations;
        this.nestedFlowBlockInteractionIdStack = nestedFlowBlockInteractionIdStack;
        this.interactions = interactions;
        this.sessionVars = sessionVars;
        this.contact = contact;
        this.languageId = languageId;
        this.mode = mode;
        this.deliveryStatus = deliveryStatus;
        this.createdAt = createdAt;
        this.id = id;
    }
    getResource(resourceId) {
        return new index_1.ResourceResolver(this).resolve(resourceId);
    }
}
exports.Context = Context;
(function (Context) {
    class Builder {
        constructor() {
            this.createdAt = index_1.createFormattedDate();
            this.deliveryStatus = index_1.DeliveryStatus.QUEUED;
            this.mode = index_1.SupportedMode.OFFLINE;
            this.sessionVars = {};
            this.interactions = [];
            this.nestedFlowBlockInteractionIdStack = [];
            this.reversibleOperations = [];
            this.platformMetadata = {};
            this.logs = {};
        }
        setId(id) {
            this.id = id;
            return this;
        }
        setCreatedAt(createdAt) {
            this.createdAt = createdAt;
            return this;
        }
        setDeliveryStatus(deliveryStatus) {
            this.deliveryStatus = deliveryStatus;
            return this;
        }
        setMode(mode) {
            this.mode = mode;
            return this;
        }
        setLanguageId(languageId) {
            this.languageId = languageId;
            return this;
        }
        setContact(contact) {
            this.contact = contact;
            return this;
        }
        setSessionVars(sessionVars) {
            this.sessionVars = sessionVars;
            return this;
        }
        setInteractions(interactions) {
            this.interactions = interactions;
            return this;
        }
        setNestedFlowBlockInteractionIdStack(nestedFlowBlockInteractionIdStack) {
            this.nestedFlowBlockInteractionIdStack = nestedFlowBlockInteractionIdStack;
            return this;
        }
        setReversibleOperations(reversibleOperations) {
            this.reversibleOperations = reversibleOperations;
            return this;
        }
        setFlows(flows) {
            this.flows = flows;
            return this;
        }
        setFirstFlowId(firstFlowId) {
            this.firstFlowId = firstFlowId;
            return this;
        }
        setResources(resources) {
            this.resources = resources;
            return this;
        }
        setEntryAt(entryAt) {
            this.entryAt = entryAt;
            return this;
        }
        setExitAt(exitAt) {
            this.exitAt = exitAt;
            return this;
        }
        setUserId(userId) {
            this.userId = userId;
            return this;
        }
        setOrgId(orgId) {
            this.orgId = orgId;
            return this;
        }
        setCursor(cursor) {
            this.cursor = cursor;
            return this;
        }
        setPlatformMetadata(platformMetadata) {
            this.platformMetadata = platformMetadata;
            return this;
        }
        setLogs(logs) {
            this.logs = logs;
            return this;
        }
        build() {
            index_1.assertNotNull(this.id, () => 'Context.Builder.setId() must be called before build()');
            index_1.assertNotNull(this.languageId, () => 'Context.Builder.setLanguageId() must be called before build()');
            index_1.assertNotNull(this.contact, () => 'Context.Builder.setContact() must be called before build()');
            index_1.assertNotNull(this.flows, () => 'Context.Builder.setFlows() must be called before build()');
            index_1.assertNotNull(this.firstFlowId, () => 'Context.Builder.setFirstFlowId() must be called before build()');
            index_1.assertNotNull(this.resources, () => 'Context.Builder.setResources() must be called before build()');
            return new Context(this.id, this.createdAt, this.deliveryStatus, this.mode, this.languageId, this.contact, this.sessionVars, this.interactions, this.nestedFlowBlockInteractionIdStack, this.reversibleOperations, this.flows, this.firstFlowId, this.resources, this.entryAt, this.exitAt, this.userId, this.orgId, this.cursor, this.platformMetadata, this.logs);
        }
    }
    Context.Builder = Builder;
})(Context = exports.Context || (exports.Context = {}));
//# sourceMappingURL=Context.js.map