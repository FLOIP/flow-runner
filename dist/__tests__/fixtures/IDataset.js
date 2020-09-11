"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDefaultDataset = exports.DATA_SOURCE = void 0;
const yaml_import_1 = require("yaml-import");
const lodash_1 = require("lodash");
exports.DATA_SOURCE = yaml_import_1.read('src/__tests__/fixtures/dataset.yml');
function createDefaultDataset() {
    return lodash_1.cloneDeep(exports.DATA_SOURCE);
}
exports.createDefaultDataset = createDefaultDataset;
//# sourceMappingURL=IDataset.js.map