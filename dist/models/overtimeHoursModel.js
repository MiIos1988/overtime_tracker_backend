"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const overtimeHoursSchema = new mongoose_1.default.Schema({
    date: {
        type: Date,
        required: true,
    },
    hours: {
        type: Number,
        required: true,
    },
    worker: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "managers",
    },
});
const OvertimeHoursModel = mongoose_1.default.model("overtimeHours", overtimeHoursSchema);
exports.default = OvertimeHoursModel;
