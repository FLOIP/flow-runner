"use strict";
/**
 * Flow Interoperability Project (flowinterop.org)
 * Flow Runner
 * Copyright (c) 2019, 2020 Viamo Inc.
 * Authored by: Brett Zabos (brett.zabos@viamo.io)
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
 * documentation files (the "Software"), to deal in the Software without restriction, including without limitation the
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to the following conditions:
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the
 * Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
 * WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
 * OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 **/
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContextService = exports.isNested = exports.isLastBlockOn = exports.getActiveFlowFrom = exports.getActiveFlowIdFrom = exports.findNestedFlowIdFor = exports.findBlockOnActiveFlowWith = exports.findFlowWith = exports.findInteractionWith = exports.createContextDataObjectFor = void 0;
const tslib_1 = require("tslib");
const __1 = require("..");
const lodash_1 = require("lodash");
function createContextDataObjectFor(contact, groups, userId, orgId, flows, languageId, mode = __1.SupportedMode.OFFLINE, idGenerator = new __1.IdGeneratorUuidV4()) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        return {
            id: yield idGenerator.generate(),
            created_at: (0, __1.createFormattedDate)(),
            delivery_status: __1.DeliveryStatus.QUEUED,
            user_id: userId,
            org_id: orgId,
            mode,
            language_id: languageId,
            contact,
            groups,
            session_vars: {},
            interactions: [],
            nested_flow_block_interaction_id_stack: [],
            reversible_operations: [],
            flows,
            first_flow_id: flows[0].uuid,
            vendor_metadata: {},
            logs: {},
        };
    });
}
exports.createContextDataObjectFor = createContextDataObjectFor;
function findInteractionWith(uuid, { interactions }) {
    const interaction = (0, lodash_1.findLast)(interactions, { uuid });
    if (interaction == null) {
        throw new __1.ValidationException(`Unable to find interaction on context: ${uuid} in [${interactions.map(i => i.uuid)}]`);
    }
    return interaction;
}
exports.findInteractionWith = findInteractionWith;
function findFlowWith(uuid, { flows }) {
    const flow = (0, lodash_1.find)(flows, { uuid });
    if (flow == null) {
        throw new __1.ValidationException(`Unable to find flow on context: ${uuid} in ${flows.map(f => f.uuid)}`);
    }
    return flow;
}
exports.findFlowWith = findFlowWith;
function findBlockOnActiveFlowWith(uuid, ctx) {
    return (0, __1.findBlockWith)(uuid, getActiveFlowFrom(ctx));
}
exports.findBlockOnActiveFlowWith = findBlockOnActiveFlowWith;
function findNestedFlowIdFor(interaction, ctx) {
    const flow = findFlowWith(interaction.flow_id, ctx);
    const runFlowBlock = (0, __1.findBlockWith)(interaction.block_id, flow);
    const flowId = runFlowBlock.config.flow_id;
    if (flowId == null) {
        throw new __1.ValidationException('Unable to find nested flowId on Core.RunFlow');
    }
    return flowId;
}
exports.findNestedFlowIdFor = findNestedFlowIdFor;
function getActiveFlowIdFrom(ctx) {
    const { first_flow_id, nested_flow_block_interaction_id_stack } = ctx;
    if (nested_flow_block_interaction_id_stack.length === 0) {
        return first_flow_id;
    }
    const interaction = findInteractionWith((0, lodash_1.last)(nested_flow_block_interaction_id_stack), ctx);
    return findNestedFlowIdFor(interaction, ctx);
}
exports.getActiveFlowIdFrom = getActiveFlowIdFrom;
function getActiveFlowFrom(ctx) {
    return findFlowWith(getActiveFlowIdFrom(ctx), ctx);
}
exports.getActiveFlowFrom = getActiveFlowFrom;
function isLastBlockOn(ctx, block) {
    return !isNested(ctx) && (0, __1.isLastBlock)(block);
}
exports.isLastBlockOn = isLastBlockOn;
function isNested({ nested_flow_block_interaction_id_stack }) {
    return nested_flow_block_interaction_id_stack.length > 0;
}
exports.isNested = isNested;
exports.ContextService = {
    findInteractionWith,
    findFlowWith,
    findBlockOnActiveFlowWith,
    findNestedFlowIdFor,
    getActiveFlowIdFrom,
    getActiveFlowFrom,
    isLastBlockOn,
    isNested,
};
//# sourceMappingURL=IContext.js.map