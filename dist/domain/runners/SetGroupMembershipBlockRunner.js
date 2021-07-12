"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SetGroupMembershipBlockRunner = void 0;
const tslib_1 = require("tslib");
const __1 = require("../..");
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
            const group = this.context.groups.find(group => group.group_key === this.block.config.group_key);
            if (group == null) {
                throw new __1.ValidationException(`Cannot add contact to non-existent group ${this.block.config.group_key}`);
            }
            if (this.block.config.is_member) {
                this.context.contact.addGroup(group);
            }
            else {
                this.context.contact.delGroup(group);
            }
            return __1.findDefaultBlockExitOrThrow(this.block);
        });
    }
}
exports.SetGroupMembershipBlockRunner = SetGroupMembershipBlockRunner;
//# sourceMappingURL=SetGroupMembershipBlockRunner.js.map