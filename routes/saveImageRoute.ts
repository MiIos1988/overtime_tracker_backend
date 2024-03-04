import express from "express";
import multer from "multer";
const upload = multer();
import tokenValidation from "../validation/tokenValidation";
const saveImageRoute = express.Router();
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { jwtDecode } from "jwt-decode";
import ManagerModel from "../models/managersModel";

const s3 = new S3Client({
  region: "eu-north-1",
  credentials: {
    accessKeyId: process.env.ACCESS_KEY || "",
    secretAccessKey: process.env.SECRET_ACCESS_KEY || "",
  },
});

saveImageRoute.post(
  "/change-image",
  upload.single("image"),
  tokenValidation,
  async (req, res) => {
    try {
      if (req.file) {
        const uploadParams = {
          Bucket: process.env.BUCKET_NAME,
          Key: req.body.worker,
          Body: req.file.buffer,
          ContentType: req.file.mimetype,
        };
        const putObjectCommand = new PutObjectCommand(uploadParams);
        await s3.send(putObjectCommand);

        const imageUrl = `https://${
          process.env.BUCKET_NAME
        }.s3.amazonaws.com/${encodeURIComponent(req.body.worker)}`;

        const token = req.headers.authorization;
        if (token) {
          const decodedToken: any = jwtDecode(token);
          await ManagerModel.findOneAndUpdate(
            { userId: decodedToken.sub, "workers.nameWorker": req.body.worker },
            { $set: { "workers.$.image": imageUrl } }
          );
          const manager = await ManagerModel.findOne({
            userId: decodedToken.sub,
          });
          if (manager) {
            res.send({ allWorkers: manager.workers });
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
);

export default saveImageRoute;
