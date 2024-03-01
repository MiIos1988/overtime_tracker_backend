import express from "express";
import multer from "multer";
const upload = multer();
import tokenValidation from "../validation/tokenValidation";
const saveImageRoute = express.Router();
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
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

        const command = new GetObjectCommand({
          Bucket: process.env.BUCKET_NAME,
          Key: req.body.worker,
        });
        const url = await getSignedUrl(s3, command);
        const token = req.headers.authorization;
        if(token){
            const decodedToken: any = jwtDecode(token);
            const manager = await ManagerModel.findOne({ userId: decodedToken.sub });
            if(manager){
                const existWorker = manager.workers.find(worker => worker.nameWorker === req.body.worker)
                if(existWorker){
                    existWorker.image = url;
                    console.log(manager.workers)
                }
            }
        }


        // console.log("Presigned URL: ", url);
        res.send("ok");
      }
    } catch (error) {
      console.log(error);
    }
  }
);

export default saveImageRoute;
