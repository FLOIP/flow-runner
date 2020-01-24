"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DeliveryStatus;
(function (DeliveryStatus) {
    DeliveryStatus["QUEUED"] = "QUEUED";
    DeliveryStatus["RINGING"] = "RINGING";
    DeliveryStatus["IN_PROGRESS"] = "IN_PROGRESS";
    DeliveryStatus["WAITING_TO_RETRY"] = "WAITING_TO_RETRY";
    DeliveryStatus["FAILED_NO_ANSWER"] = "FAILED_NO_ANSWER";
    DeliveryStatus["FINISHED_COMPLETE"] = "FINISHED_COMPLETE";
    DeliveryStatus["FINISHED_INCOMPLETE"] = "FINISHED_INCOMPLETE";
    DeliveryStatus["FAILED_NETWORK"] = "FAILED_NETWORK";
    DeliveryStatus["FAILED_CANCELLED"] = "FAILED_CANCELLED";
    DeliveryStatus["SENT"] = "SENT";
    DeliveryStatus["FINISHED_VOICEMAIL"] = "FINISHED_VOICEMAIL";
    DeliveryStatus["FAILED_VOICEMAIL"] = "FAILED_VOICEMAIL";
    DeliveryStatus["FAILED_ERROR"] = "FAILED_ERROR";
})(DeliveryStatus = exports.DeliveryStatus || (exports.DeliveryStatus = {}));
exports.default = DeliveryStatus;
//# sourceMappingURL=DeliveryStatus.js.map