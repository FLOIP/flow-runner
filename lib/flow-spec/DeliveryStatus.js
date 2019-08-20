"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DeliveryStatus;
(function (DeliveryStatus) {
    DeliveryStatus[DeliveryStatus["QUEUED"] = 1] = "QUEUED";
    DeliveryStatus[DeliveryStatus["RINGING"] = 2] = "RINGING";
    DeliveryStatus[DeliveryStatus["IN_PROGRESS"] = 3] = "IN_PROGRESS";
    DeliveryStatus[DeliveryStatus["WAITING_TO_RETRY"] = 4] = "WAITING_TO_RETRY";
    DeliveryStatus[DeliveryStatus["FAILED_NO_ANSWER"] = 5] = "FAILED_NO_ANSWER";
    DeliveryStatus[DeliveryStatus["FINISHED_COMPLETE"] = 6] = "FINISHED_COMPLETE";
    DeliveryStatus[DeliveryStatus["FINISHED_INCOMPLETE"] = 7] = "FINISHED_INCOMPLETE";
    DeliveryStatus[DeliveryStatus["FAILED_NETWORK"] = 9] = "FAILED_NETWORK";
    DeliveryStatus[DeliveryStatus["FAILED_CANCELLED"] = 10] = "FAILED_CANCELLED";
    DeliveryStatus[DeliveryStatus["SENT"] = 11] = "SENT";
    DeliveryStatus[DeliveryStatus["FINISHED_VOICEMAIL"] = 12] = "FINISHED_VOICEMAIL";
    DeliveryStatus[DeliveryStatus["FAILED_VOICEMAIL"] = 13] = "FAILED_VOICEMAIL";
    DeliveryStatus[DeliveryStatus["FAILED_ERROR"] = 14] = "FAILED_ERROR";
})(DeliveryStatus = exports.DeliveryStatus || (exports.DeliveryStatus = {}));
exports.default = DeliveryStatus;
//# sourceMappingURL=DeliveryStatus.js.map