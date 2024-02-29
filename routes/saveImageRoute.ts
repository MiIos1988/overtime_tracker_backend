import express from "express";
import multer from "multer";
const upload = multer();
import tokenValidation from "../validation/tokenValidation";
const saveImageRoute = express.Router();
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  S3ClientConfig,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

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
      console.log(process.env.ACCESS_KEY);
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
        console.log("Presigned URL: ", url);
        res.send("ok");
      }
    } catch (error) {
      console.log(error);
    }
  }
);

export default saveImageRoute;
