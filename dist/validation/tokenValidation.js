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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const aws_jwt_verify_1 = require("aws-jwt-verify");
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const loginValidation = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.headers.authorization;
    const USER_POOL_ID = process.env.USER_POOL_ID;
    const CLIENT_ID = process.env.CLIENT_ID;
    if (USER_POOL_ID && CLIENT_ID) {
        const verifier = aws_jwt_verify_1.CognitoJwtVerifier.create({
            userPoolId: USER_POOL_ID,
            tokenUse: "access",
            clientId: CLIENT_ID,
            tokenExpiration: "3h"
        });
        try {
            if (token) {
                const tokenWithoutBearer = token.replace("Bearer ", "");
                yield verifier.verify(tokenWithoutBearer);
                next();
            }
            else {
                return res.status(400).json({ error: "JWT token required." });
            }
        }
        catch (error) {
            console.error("Error verifying token:", error);
            return res.status(400).json({ error: "Invalid JWT token." });
        }
    }
});
exports.default = loginValidation;
