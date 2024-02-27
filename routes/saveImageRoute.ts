import express from "express";
import multer from 'multer';
const upload = multer();
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
  

saveImageRoute.post("/change-image", upload.single("image"), tokenValidation, (req, res) => {
    try {
        if(req.file){
            const uploadParams = {
                Bucket: process.env.BUCKET_NAME,
                Key: "UNIQUE_KEY_FOR_THE_IMAGE", // Unikatan ključ za sliku na AWS S3
                Body: req.file.buffer, // Buffer slike
                ContentType: req.file.mimetype, // MIME tip slike
            };
        }
        console.log(req.file)
        res.send("ok")
    } catch (error) {
        
    }
})

export default saveImageRoute;