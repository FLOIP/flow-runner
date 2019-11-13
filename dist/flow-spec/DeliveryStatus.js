"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DeliveryStatus;
(function (DeliveryStatus) {
    DeliveryStatus["QUEUED"] = "1";
    DeliveryStatus["RINGING"] = "2";
    DeliveryStatus["IN_PROGRESS"] = "3";
    DeliveryStatus["WAITING_TO_RETRY"] = "4";
    DeliveryStatus["FAILED_NO_ANSWER"] = "5";
    DeliveryStatus["FINISHED_COMPLETE"] = "6";
    DeliveryStatus["FINISHED_INCOMPLETE"] = "7";
    DeliveryStatus["FAILED_NETWORK"] = "9";
    DeliveryStatus["FAILED_CANCELLED"] = "10";
    DeliveryStatus["SENT"] = "11";
    DeliveryStatus["FINISHED_VOICEMAIL"] = "12";
    DeliveryStatus["FAILED_VOICEMAIL"] = "13";
    DeliveryStatus["FAILED_ERROR"] = "14";
})(DeliveryStatus = exports.DeliveryStatus || (exports.DeliveryStatus = {}));
exports.default = DeliveryStatus;
//# sourceMappingURL=DeliveryStatus.js.map