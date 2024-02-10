import express from "express";
import tokenValidation from "../validation/tokenValidation";
const managerRoute = express.Router();

managerRoute.post("/add-manager", tokenValidation
, async (req, res) => {
    console.log("work")
    res.send("ok")
})

export default managerRoute;