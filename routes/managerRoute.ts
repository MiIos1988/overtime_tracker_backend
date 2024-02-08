import express from "express";
import loginValidation from "../validation/loginValidation";
const managerRoute = express.Router();

managerRoute.post("/add-manager", loginValidation, async (req, res) => {
    console.log("work")
    res.send("ok")
})

export default managerRoute;