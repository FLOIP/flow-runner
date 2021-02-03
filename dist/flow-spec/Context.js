"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Context = void 0;
const __1 = require("..");
class Context {
    constructor(id, createdAt, deliveryStatus, mode, languageId, contact, groups, sessionVars, interactions, nestedFlowBlockInteractionIdStack, reversibleOperations, flows, firstFlowId, resources, entryAt, exitAt, userId, orgId, cursor, platformMetadata = {}, logs = {}) {
        this.platform_metadata = {};
        this.logs = {};
        this.logs = logs;
        this.platform_metadata = platformMetadata;
        this.cursor = cursor;
        this.org_id = orgId;
        this.user_id = userId;
        this.exit_at = exitAt;
        this.entry_at = entryAt;
        this.resources = resources;
        this.first_flow_id = firstFlowId;
        this.flows = flows;
        this.reversible_operations = reversibleOperations;
        this.nested_flow_block_interaction_id_stack = nestedFlowBlockInteractionIdStack;
        this.interactions = interactions;
        this.session_vars = sessionVars;
        this.contact = contact;
        this.groups = groups;
        this.language_id = languageId;
        this.mode = mode;
        this.delivery_status = deliveryStatus;
        this.created_at = createdAt;
        this.id = id;
    }
    getResource(resourceId) {
        return new __1.ResourceResolver(this).resolve(resourceId);
    }
}
exports.Context = Context;
(function (Context) {
    class Builder {
        constructor() {
            this.createdAt = __1.createFormattedDate();
            this.deliveryStatus = __1.DeliveryStatus.QUEUED;
            this.mode = __1.SupportedMode.OFFLINE;
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
        setGroups(groups) {
            this.groups = groups;
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
            __1.assertNotNull(this.id, () => 'Context.Builder.setId() must be called before build()');
            __1.assertNotNull(this.languageId, () => 'Context.Builder.setLanguageId() must be called before build()');
            __1.assertNotNull(this.contact, () => 'Context.Builder.setContact() must be called before build()');
            __1.assertNotNull(this.groups, () => 'Context.Builder.setGroups() must be called before build()');
            __1.assertNotNull(this.flows, () => 'Context.Builder.setFlows() must be called before build()');
            __1.assertNotNull(this.firstFlowId, () => 'Context.Builder.setFirstFlowId() must be called before build()');
            __1.assertNotNull(this.resources, () => 'Context.Builder.setResources() must be called before build()');
            return new Context(this.id, this.createdAt, this.deliveryStatus, this.mode, this.languageId, this.contact, this.groups, this.sessionVars, this.interactions, this.nestedFlowBlockInteractionIdStack, this.reversibleOperations, this.flows, this.firstFlowId, this.resources, this.entryAt, this.exitAt, this.userId, this.orgId, this.cursor, this.platformMetadata, this.logs);
        }
    }
    Context.Builder = Builder;
})(Context = exports.Context || (exports.Context = {}));
//# sourceMappingURL=Context.js.map