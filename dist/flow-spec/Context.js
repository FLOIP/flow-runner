"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Context = void 0;
const __1 = require("..");
class Context {
    constructor(id, created_at, delivery_status, mode, language_id, contact, groups, session_vars, interactions, nested_flow_block_interaction_id_stack, reversible_operations, flows, first_flow_id, resources, entry_at, exit_at, user_id, org_id, cursor, vendor_metadata = {}, logs = {}) {
        this.vendor_metadata = {};
        this.logs = {};
        this.logs = logs;
        this.vendor_metadata = vendor_metadata;
        this.cursor = cursor;
        this.org_id = org_id;
        this.user_id = user_id;
        this.exit_at = exit_at;
        this.entry_at = entry_at;
        this.resources = resources;
        this.first_flow_id = first_flow_id;
        this.flows = flows;
        this.reversible_operations = reversible_operations;
        this.nested_flow_block_interaction_id_stack = nested_flow_block_interaction_id_stack;
        this.interactions = interactions;
        this.session_vars = session_vars;
        this.contact = contact;
        this.groups = groups;
        this.language_id = language_id;
        this.mode = mode;
        this.delivery_status = delivery_status;
        this.created_at = created_at;
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
            this.created_at = __1.createFormattedDate();
            this.delivery_status = __1.DeliveryStatus.QUEUED;
            this.mode = __1.SupportedMode.OFFLINE;
            this.session_vars = {};
            this.interactions = [];
            this.nested_flow_block_interaction_id_stack = [];
            this.reversible_operations = [];
            this.vendor_metadata = {};
            this.logs = {};
        }
        setId(id) {
            this.id = id;
            return this;
        }
        setCreatedAt(created_at) {
            this.created_at = created_at;
            return this;
        }
        setDeliveryStatus(delivery_status) {
            this.delivery_status = delivery_status;
            return this;
        }
        setMode(mode) {
            this.mode = mode;
            return this;
        }
        setLanguageId(language_id) {
            this.language_id = language_id;
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
        setSessionVars(session_vars) {
            this.session_vars = session_vars;
            return this;
        }
        setInteractions(interactions) {
            this.interactions = interactions;
            return this;
        }
        setNestedFlowBlockInteractionIdStack(nested_flow_block_interaction_id_stack) {
            this.nested_flow_block_interaction_id_stack = nested_flow_block_interaction_id_stack;
            return this;
        }
        setReversibleOperations(reversible_operations) {
            this.reversible_operations = reversible_operations;
            return this;
        }
        setFlows(flows) {
            this.flows = flows;
            return this;
        }
        setFirstFlowId(first_flow_id) {
            this.first_flow_id = first_flow_id;
            return this;
        }
        setResources(resources) {
            this.resources = resources;
            return this;
        }
        setEntryAt(entry_at) {
            this.entry_at = entry_at;
            return this;
        }
        setExitAt(exit_at) {
            this.exit_at = exit_at;
            return this;
        }
        setUserId(user_id) {
            this.user_id = user_id;
            return this;
        }
        setOrgId(org_id) {
            this.org_id = org_id;
            return this;
        }
        setCursor(cursor) {
            this.cursor = cursor;
            return this;
        }
        setPlatformMetadata(vendor_metadata) {
            this.vendor_metadata = vendor_metadata;
            return this;
        }
        setLogs(logs) {
            this.logs = logs;
            return this;
        }
        build() {
            __1.assertNotNull(this.id, () => 'Context.Builder.setId() must be called before build()');
            __1.assertNotNull(this.language_id, () => 'Context.Builder.setLanguageId() must be called before build()');
            __1.assertNotNull(this.contact, () => 'Context.Builder.setContact() must be called before build()');
            __1.assertNotNull(this.groups, () => 'Context.Builder.setGroups() must be called before build()');
            __1.assertNotNull(this.flows, () => 'Context.Builder.setFlows() must be called before build()');
            __1.assertNotNull(this.first_flow_id, () => 'Context.Builder.setFirstFlowId() must be called before build()');
            __1.assertNotNull(this.resources, () => 'Context.Builder.setResources() must be called before build()');
            return new Context(this.id, this.created_at, this.delivery_status, this.mode, this.language_id, this.contact, this.groups, this.session_vars, this.interactions, this.nested_flow_block_interaction_id_stack, this.reversible_operations, this.flows, this.first_flow_id, this.resources, this.entry_at, this.exit_at, this.user_id, this.org_id, this.cursor, this.vendor_metadata, this.logs);
        }
    }
    Context.Builder = Builder;
})(Context = exports.Context || (exports.Context = {}));
//# sourceMappingURL=Context.js.map