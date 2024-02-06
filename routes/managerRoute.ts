import express from "express";
const managerRoute = express.Router();

managerRoute.post("/add-manager", async (req, res) => {
    console.log(req.body);
    console.log(req.headers.authorization)
    res.send("ok")
})

export default managerRoute;