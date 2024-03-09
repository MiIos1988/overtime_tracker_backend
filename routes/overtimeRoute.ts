import express from "express";
import tokenValidation from "../validation/tokenValidation";
const overtimeRoute = express.Router();
import { jwtDecode } from "jwt-decode";

overtimeRoute.post("/send-overtime-data", tokenValidation, async (req, res) => {
    console.log(req.body);
    res.send("ok")
  })



export default overtimeRoute