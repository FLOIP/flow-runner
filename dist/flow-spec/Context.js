"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var ResourceResolver_1 = tslib_1.__importDefault(require("../domain/ResourceResolver"));
var Context = (function () {
    function Context(id, createdAt, deliveryStatus, mode, languageId, contact, sessionVars, interactions, nestedFlowBlockInteractionIdStack, flows, firstFlowId, resources, entryAt, exitAt, userId, orgId, cursor, platformMetadata) {
        if (platformMetadata === void 0) { platformMetadata = {}; }
        this.id = id;
        this.createdAt = createdAt;
        this.deliveryStatus = deliveryStatus;
        this.mode = mode;
        this.languageId = languageId;
        this.contact = contact;
        this.sessionVars = sessionVars;
        this.interactions = interactions;
        this.nestedFlowBlockInteractionIdStack = nestedFlowBlockInteractionIdStack;
        this.flows = flows;
        this.firstFlowId = firstFlowId;
        this.resources = resources;
        this.entryAt = entryAt;
        this.exitAt = exitAt;
        this.userId = userId;
        this.orgId = orgId;
        this.cursor = cursor;
        this.platformMetadata = platformMetadata;
    }
    Context.prototype.getResource = function (resourceId) {
        return new ResourceResolver_1.default(this)
            .resolve(resourceId);
    };
    return Context;
}());
exports.default = Context;
//# sourceMappingURL=Context.js.map