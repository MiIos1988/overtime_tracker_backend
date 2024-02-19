import express from "express";
import tokenValidation from "../validation/tokenValidation";
const managerRoute = express.Router();
import { jwtDecode } from "jwt-decode";
import ManagerModel from "../models/managersModel";

managerRoute.post("/add-manager", tokenValidation, async (req, res) => {
  const token = req.body.token;
  if (token) {
    const decodedToken: any = jwtDecode(token);
    try {
      const existingManager = await ManagerModel.findOne({
        userId: decodedToken.sub,
      });
      if (!existingManager) {
        await ManagerModel.create({
          email: decodedToken.email,
          userId: decodedToken.sub,
        });
        return res.send("Create manager");
      } else {
        console.log("Exist manager");
        const allWorkers = existingManager.workers.map(
          (worker) => worker.nameWorker
        );
        return res.send({ allWorkers });
      }
    } catch (error) {
      console.log(error);
      return res.send("Error manager");
    }
  }
  res.send("ok");
});

managerRoute.post("/create-worker", tokenValidation, async (req, res) => {
  try {
    const token = req.headers.authorization;
    const { nameWorker } = req.body;
    if (token) {
      const decodedToken: any = jwtDecode(token);
      const manager = await ManagerModel.findOne({ userId: decodedToken.sub });
      if (manager) {
        const existWorker = manager.workers.find(
          (worker) => worker.nameWorker === nameWorker
        );
        console.log(existWorker);
        if (existWorker) {
          res.send("Worker exist");
        } else {
          manager.workers.push({ nameWorker });
          await manager.save();

          const allWorkers = manager.workers.map((worker) => worker.nameWorker);
          res.send({ allWorkers });
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
});

export default managerRoute;
