import express from "express";
import multer from 'multer';
const upload = multer();
// import * as dotenv from "dotenv";
// dotenv.config();
import tokenValidation from "../validation/tokenValidation";
const saveImageRoute = express.Router();
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3 = new S3Client({
    region: "eu-north-1", 
    credentials: {
      accessKeyId: process.env.ACCESS_KEY || "",
      secretAccessKey: process.env.SECRET_ACCESS_KEY || "",
    },
  });
  

saveImageRoute.post("/change-image", upload.single("image"), tokenValidation, async (req, res) => {
    try {
        if(req.file){
            const uploadParams = {
                Bucket: process.env.BUCKET_NAME,
                Key: req.body.worker,
                Body: req.file.buffer,
                ContentType: req.file.mimetype, 
            };
            const putObjectCommand = new PutObjectCommand(uploadParams);
            const response = await s3.send(putObjectCommand);
            console.log(response)
            // console.log(uploadParams.Bucket)
            // console.log(s3.config.region)
            // console.log(uploadParams.Key)

            const imageUrl = `https://${process.env.BUCKET_NAME}.s3.eu-north-1.amazonaws.com/${req.body.worker}`;
            console.log(imageUrl)
            res.send("ok")
        }
    } catch (error) {
        
    }
})

export default saveImageRoute;