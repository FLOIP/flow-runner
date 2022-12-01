"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SetGroupMembershipBlockRunner = void 0;
const tslib_1 = require("tslib");
const __1 = require("../..");
/**
 * Adds or removes a group from the contact.
 */
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
            try {
                const group = this.context.groups.find(group => group.group_key === this.block.config.group_key);
                (0, __1.assertNotNull)(group, () => `Cannot add contact to non-existent group ${this.block.config.group_key}`, errorMessage => new __1.ValidationException(errorMessage));
                if (this.block.config.is_member) {
                    this.context.contact.addGroup(group);
                }
                else {
                    this.context.contact.delGroup(group);
                }
                (0, __1.setContactProperty)(this.block, this.context);
                return (0, __1.firstTrueOrNullBlockExitOrThrow)(this.block, this.context);
            }
            catch (e) {
                console.error(e);
                return (0, __1.findDefaultBlockExitOrThrow)(this.block);
            }
        });
    }
}
exports.SetGroupMembershipBlockRunner = SetGroupMembershipBlockRunner;
//# sourceMappingURL=SetGroupMembershipBlockRunner.js.map