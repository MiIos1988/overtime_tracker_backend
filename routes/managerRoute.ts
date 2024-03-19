import express from "express";
import tokenValidation from "../validation/tokenValidation";
const managerRoute = express.Router();
import { jwtDecode } from "jwt-decode";
import ManagerModel from "../models/managersModel";
import OvertimeHoursModel from "../models/overtimeHoursModel";

managerRoute.post("/add-manager", tokenValidation, async (req, res) => {
  const token = req.body.token;
  if (token) {
    try {
      const decodedToken: any = jwtDecode(token);
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
        const allWorkers = existingManager.workers.map((worker) => {
          return { nameWorker: worker.nameWorker, image: worker.image };
        });
        return res.send({ allWorkers });
      }
    } catch (error) {
      console.log(error);
      return res.status(400).send("Error ");
    }
  } else {
    res.status(400).send("Token error");
  }
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
        if (existWorker) {
          res.send("Worker exist");
        } else {
          manager.workers.push({ nameWorker });
          await manager.save();

          const allWorkers = manager.workers.map((worker) => {
            return { nameWorker: worker.nameWorker, image: worker.image };
          });
          return res.send({ allWorkers });
        }
      }
    } else {
      res.status(400).send("Token error");
    }
  } catch (error) {
    res.status(400).send("Error");
    console.log(error);
  }
});

managerRoute.delete("/delete-worker/:workerName", tokenValidation, async (req, res) => {
  try {
    const token = req.headers.authorization;
    const { workerName } = req.params;
    if (token) {
      const decodedToken: any = jwtDecode(token);
      const manager = await ManagerModel.findOne({ userId: decodedToken.sub });
      if (manager) {
        const deleteWorker = manager.workers.find(
          (worker) => worker.nameWorker === workerName
        );
        const updateWorkers = manager.workers.filter(
          (worker) => worker.nameWorker !== workerName
        );
        const updateManager = await ManagerModel.findOneAndUpdate(
          { userId: decodedToken.sub },
          { workers: updateWorkers },
          { new: true }
        );
        if (updateManager) {
          if(deleteWorker){
             await OvertimeHoursModel.deleteMany({worker: deleteWorker._id})
          }
          const allWorkers = updateManager.workers.map((worker) => {
            return { nameWorker: worker.nameWorker, image: worker.image };
          });
          return res.send({ allWorkers });
        }
      }
    } else {
      res.status(400).send("Token error");
    }
  } catch (error) {
    res.status(400).send("Error");
    console.log(error);
  }
});

managerRoute.put("/change-worker-name", tokenValidation, async (req, res) => {
  try {
    const token = req.headers.authorization;
    const { nameBeforeChange, nameAfterChange } = req.body;
    if (token) {
      const decodedToken: any = jwtDecode(token);
      const manager = await ManagerModel.findOne({ userId: decodedToken.sub });
      if (manager) {
        const changeWorkerName = manager.workers.map((worker) => {
          if (worker.nameWorker === nameBeforeChange) {
            worker.nameWorker = nameAfterChange;
            return worker;
          } else {
            return worker;
          }
        });
        await ManagerModel.findOneAndUpdate(
          { userId: decodedToken.sub },
          { workers: changeWorkerName }
        );
        const allWorkers = manager.workers.map((worker) => {
          return { nameWorker: worker.nameWorker, image: worker.image };
        });
        return res.send({ allWorkers });
      }
    } else {
      res.status(400).send("Token error");
    }
  } catch (error) {
    res.status(400).send("Error");
    console.log(error);
  }
});

export default managerRoute;
