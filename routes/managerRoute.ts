import express from "express";
const managerRoute = express.Router();

managerRoute.post("/add-manager", async (req, res) => {
    console.log(req.header);
    res.send("ok")
})

export default managerRoute;