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
const managerRoute = express_1.default.Router();
const jwt_decode_1 = require("jwt-decode");
const managersModel_1 = __importDefault(require("../models/managersModel"));
const overtimeHoursModel_1 = __importDefault(require("../models/overtimeHoursModel"));
managerRoute.post("/add-manager", tokenValidation_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.body.token;
    if (token) {
        try {
            const decodedToken = (0, jwt_decode_1.jwtDecode)(token);
            const existingManager = yield managersModel_1.default.findOne({
                userId: decodedToken.sub,
            });
            if (!existingManager) {
                yield managersModel_1.default.create({
                    email: decodedToken.email,
                    userId: decodedToken.sub,
                });
                return res.send("Create manager");
            }
            else {
                const allWorkers = existingManager.workers.map((worker) => {
                    return { nameWorker: worker.nameWorker, image: worker.image };
                });
                return res.send({ allWorkers });
            }
        }
        catch (error) {
            console.log(error);
            return res.status(400).send("Error ");
        }
    }
    else {
        res.status(400).send("Token error");
    }
}));
managerRoute.post("/create-worker", tokenValidation_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.headers.authorization;
        const { nameWorker } = req.body;
        if (token) {
            const decodedToken = (0, jwt_decode_1.jwtDecode)(token);
            const manager = yield managersModel_1.default.findOne({ userId: decodedToken.sub });
            if (manager) {
                const existWorker = manager.workers.find((worker) => worker.nameWorker === nameWorker);
                if (existWorker) {
                    res.send("Worker exist");
                }
                else {
                    manager.workers.push({ nameWorker });
                    yield manager.save();
                    const allWorkers = manager.workers.map((worker) => {
                        return { nameWorker: worker.nameWorker, image: worker.image };
                    });
                    return res.send({ allWorkers });
                }
            }
        }
        else {
            res.status(400).send("Token error");
        }
    }
    catch (error) {
        res.status(400).send("Error");
        console.log(error);
    }
}));
managerRoute.delete("/delete-worker/:workerName", tokenValidation_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.headers.authorization;
        const { workerName } = req.params;
        if (token) {
            const decodedToken = (0, jwt_decode_1.jwtDecode)(token);
            const manager = yield managersModel_1.default.findOne({ userId: decodedToken.sub });
            if (manager) {
                const deleteWorker = manager.workers.find((worker) => worker.nameWorker === workerName);
                const updateWorkers = manager.workers.filter((worker) => worker.nameWorker !== workerName);
                const updateManager = yield managersModel_1.default.findOneAndUpdate({ userId: decodedToken.sub }, { workers: updateWorkers }, { new: true });
                if (updateManager) {
                    if (deleteWorker) {
                        yield overtimeHoursModel_1.default.deleteMany({ worker: deleteWorker._id });
                    }
                    const allWorkers = updateManager.workers.map((worker) => {
                        return { nameWorker: worker.nameWorker, image: worker.image };
                    });
                    return res.send({ allWorkers });
                }
            }
        }
        else {
            res.status(400).send("Token error");
        }
    }
    catch (error) {
        res.status(400).send("Error");
        console.log(error);
    }
}));
managerRoute.put("/change-worker-name", tokenValidation_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.headers.authorization;
        const { nameBeforeChange, nameAfterChange } = req.body;
        if (token) {
            const decodedToken = (0, jwt_decode_1.jwtDecode)(token);
            const manager = yield managersModel_1.default.findOne({ userId: decodedToken.sub });
            if (manager) {
                const changeWorkerName = manager.workers.map((worker) => {
                    if (worker.nameWorker === nameBeforeChange) {
                        worker.nameWorker = nameAfterChange;
                        return worker;
                    }
                    else {
                        return worker;
                    }
                });
                yield managersModel_1.default.findOneAndUpdate({ userId: decodedToken.sub }, { workers: changeWorkerName });
                const allWorkers = manager.workers.map((worker) => {
                    return { nameWorker: worker.nameWorker, image: worker.image };
                });
                return res.send({ allWorkers });
            }
        }
        else {
            res.status(400).send("Token error");
        }
    }
    catch (error) {
        res.status(400).send("Error");
        console.log(error);
    }
}));
exports.default = managerRoute;
