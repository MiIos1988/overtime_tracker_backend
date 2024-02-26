import express from "express";
import multer from 'multer';
const upload = multer();
import tokenValidation from "../validation/tokenValidation";
const saveImageRoute = express.Router();

saveImageRoute.post("/change-image", upload.single("image"), (req, res) => {
    console.log(req.file)
    res.send("ok")
})

export default saveImageRoute;