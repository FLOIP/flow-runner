"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SetGroupMembershipBlockRunner = void 0;
const tslib_1 = require("tslib");
const __1 = require("../..");
const EXIT_SUCCESS = 0;
class SetGroupMembershipBlockRunner {
    constructor(block, context) {
        this.block = block;
        this.context = context;
    }
    initialize() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return undefined;
        });
    }
    run(_cursor) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { exits } = this.block;
            const { contact, groups } = this.context;
            const { groupKey, isMember } = this.block.config;
            const group = groups.find(group => group.groupKey === groupKey);
            if (group == null) {
                throw new __1.ValidationException(`Cannot add contact to non-existent group ${groupKey}`);
            }
            if (__1.evaluateToBool(isMember, this.context)) {
                contact.addGroup(group);
            }
            else {
                contact.delGroup(group);
            }
            return exits[EXIT_SUCCESS];
        });
    }
}
exports.SetGroupMembershipBlockRunner = SetGroupMembershipBlockRunner;
//# sourceMappingURL=SetGroupMembershipBlockRunner.js.map