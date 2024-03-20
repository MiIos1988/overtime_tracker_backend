"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const managersSchema = new mongoose_1.default.Schema({
    email: {
        type: String,
        require: true,
    },
    userId: {
        type: String,
        require: true,
    },
    workers: {
        type: [
            {
                nameWorker: { type: String, require: true },
                image: { type: String, default: "" },
                overtimeHours: {
                    type: [
                        {
                            type: mongoose_1.default.Schema.Types.ObjectId,
                            ref: "overtimeHours",
                        },
                    ],
                    default: [],
                },
            },
        ],
        default: [],
    },
});
const ManagerModel = mongoose_1.default.model("managers", managersSchema);
exports.default = ManagerModel;
