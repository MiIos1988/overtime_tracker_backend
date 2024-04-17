"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const tokenValidation_1 = __importDefault(require("../validation/tokenValidation"));
const overtimeRoute = express_1.default.Router();
const jwt_decode_1 = require("jwt-decode");
const managersModel_1 = __importDefault(require("../models/managersModel"));
const overtimeHoursModel_1 = __importDefault(require("../models/overtimeHoursModel"));
overtimeRoute.post("/send-overtime-data", tokenValidation_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.headers.authorization;
    const { worker, hours, date } = req.body;
    try {
        if (token) {
            const decodedToken = (0, jwt_decode_1.jwtDecode)(token);
            const manager = yield managersModel_1.default.findOne({ userId: decodedToken.sub });
            if (manager) {
                const existWorker = manager.workers.find((wor) => wor.nameWorker === worker);
                if (existWorker) {
                    const showOvertimeHours = yield overtimeHoursModel_1.default.find({
                        _id: { $in: existWorker.overtimeHours }
                    });
                    const currentDate = date.split('T')[0];
                    console.log(date);
                    console.log(showOvertimeHours[0].date.toISOString().split('T')[0]);
                    // console.log(new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()))
                    const filterDate = showOvertimeHours.filter(obj => {
                        return currentDate === obj.date.toISOString().split('T')[0];
                    });
                    console.log(filterDate);
                    const workerId = existWorker === null || existWorker === void 0 ? void 0 : existWorker._id;
                    const newOvertimeHoursData = {
                        date: new Date(date),
                        hours: hours,
                        worker: workerId,
                    };
                    const newOvertimeHours = new overtimeHoursModel_1.default(newOvertimeHoursData);
                    yield newOvertimeHours.save();
                    existWorker.overtimeHours.push(newOvertimeHours._id);
                    yield manager.save();
                    res.send("ok");
                }
            }
        }
    }
    catch (error) {
        console.log(error);
    }
}));
overtimeRoute.post("/send-overtime-review-data", tokenValidation_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { worker, startDate, endDate } = req.body;
    const token = req.headers.authorization;
    const startDateUTC = new Date(startDate);
    startDateUTC.setUTCHours(0, 0, 0, 0);
    const endDateUTC = new Date(endDate);
    endDateUTC.setUTCHours(23, 59, 59, 999);
    try {
        if (token) {
            const decodedToken = (0, jwt_decode_1.jwtDecode)(token);
            const manager = yield managersModel_1.default.findOne({
                userId: decodedToken.sub,
            });
            if (manager) {
                const existWorker = manager.workers.find((wor) => wor.nameWorker === worker);
                if (existWorker) {
                    const overtimeHours = yield overtimeHoursModel_1.default.find({
                        worker: existWorker._id,
                        date: {
                            $gte: new Date(startDateUTC),
                            $lte: new Date(endDateUTC),
                        },
                    });
                    const overtimeData = overtimeHours.map((obj) => {
                        const options = {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                        };
                        return {
                            date: obj.date.toLocaleDateString("en-GB", options),
                            hours: obj.hours,
                            id: obj._id,
                        };
                    });
                    res.send({ overtimeData });
                }
            }
        }
    }
    catch (error) {
        console.log(error);
    }
}));
overtimeRoute.delete("/delete-overtime-hours/:id", tokenValidation_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const overtimeHours = yield overtimeHoursModel_1.default.findOneAndDelete({
            _id: id,
        });
        overtimeHours
            ? res.send({ id: overtimeHours._id })
            : res.status(400).send("Error");
    }
    catch (error) {
        console.log(error);
    }
}));
exports.default = overtimeRoute;
