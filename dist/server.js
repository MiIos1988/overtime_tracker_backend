"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const dotenv = __importStar(require("dotenv"));
const managerRoute_1 = __importDefault(require("./routes/managerRoute"));
const saveImageRoute_1 = __importDefault(require("./routes/saveImageRoute"));
const overtimeRoute_1 = __importDefault(require("./routes/overtimeRoute"));
dotenv.config();
const portNumber = 5000;
const mongoDbUrl = process.env.MONGO_DB_URL;
if (mongoDbUrl) {
    mongoose_1.default
        .connect(mongoDbUrl)
        .then(() => {
        console.log("Mongo DB is connected...");
    })
        .catch((err) => {
        console.log(err);
        console.log("Error while connecting to Mongo DB...");
    });
}
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use("/api/manager", managerRoute_1.default);
app.use("/api/aws-s3", saveImageRoute_1.default);
app.use("/api/overtime", overtimeRoute_1.default);
app.listen(portNumber, (err) => {
    err
        ? console.log("Error on server start...")
        : console.log(`Server is running on port ${portNumber}...`);
});
