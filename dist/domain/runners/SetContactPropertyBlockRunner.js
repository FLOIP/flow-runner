"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SetContactPropertyBlockRunner {
    constructor(block, context) {
        this.block = block;
        this.context = context;
    }
    initialize() {
        return undefined;
    }
    run() {
        const { contact } = this.context;
        const { propertyName, propertyValue } = this.block.config;
        contact[propertyName] = propertyValue;
        return this.block.exits[0];
    }
}
exports.default = SetContactPropertyBlockRunner;
//# sourceMappingURL=SetContactPropertyBlockRunner.js.map