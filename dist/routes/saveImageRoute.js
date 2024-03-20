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
const multer_1 = __importDefault(require("multer"));
const upload = (0, multer_1.default)();
const tokenValidation_1 = __importDefault(require("../validation/tokenValidation"));
const saveImageRoute = express_1.default.Router();
const client_s3_1 = require("@aws-sdk/client-s3");
const jwt_decode_1 = require("jwt-decode");
const managersModel_1 = __importDefault(require("../models/managersModel"));
const s3 = new client_s3_1.S3Client({
    region: "eu-north-1",
    credentials: {
        accessKeyId: process.env.ACCESS_KEY || "",
        secretAccessKey: process.env.SECRET_ACCESS_KEY || "",
    },
});
saveImageRoute.post("/change-image", upload.single("image"), tokenValidation_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.file) {
            const randomNumber = Math.floor(100000 + Math.random() * 900000);
            const nameImg = `${req.body.worker}-${randomNumber}`;
            const uploadParams = {
                Bucket: process.env.BUCKET_NAME,
                Key: nameImg,
                Body: req.file.buffer,
                ContentType: req.file.mimetype,
            };
            const putObjectCommand = new client_s3_1.PutObjectCommand(uploadParams);
            yield s3.send(putObjectCommand);
            const imageUrl = `https://${process.env.BUCKET_NAME}.s3.amazonaws.com/${encodeURIComponent(nameImg)}`;
            const token = req.headers.authorization;
            if (token) {
                const decodedToken = (0, jwt_decode_1.jwtDecode)(token);
                const updateManager = yield managersModel_1.default.findOneAndUpdate({ userId: decodedToken.sub, "workers.nameWorker": req.body.worker }, { $set: { "workers.$.image": imageUrl } }, { new: true });
                if (updateManager) {
                    const allWorkers = updateManager.workers.map((worker) => {
                        return { nameWorker: worker.nameWorker, image: worker.image };
                    });
                    return res.send({ allWorkers });
                }
            }
        }
    }
    catch (error) {
        res.status(400).send("Error");
        console.log(error);
    }
}));
exports.default = saveImageRoute;
