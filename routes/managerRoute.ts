import express from "express";
import tokenValidation from "../validation/tokenValidation";
const managerRoute = express.Router();
import { jwtDecode } from "jwt-decode";

managerRoute.post("/add-manager", tokenValidation, async (req, res) => {
    console.log(req.body)
    const token = req.body.token;
    if(token){
        const decodedToken: any = jwtDecode(token);
        console.log(decodedToken);
    }
  res.send("ok");
});

export default managerRoute;
