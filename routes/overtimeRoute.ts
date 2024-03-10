import express from "express";
import tokenValidation from "../validation/tokenValidation";
const overtimeRoute = express.Router();
import { jwtDecode } from "jwt-decode";
import ManagerModel from "../models/managersModel";
import OvertimeHoursModel from "../models/overtimeHoursModel";

overtimeRoute.post("/send-overtime-data", tokenValidation, async (req, res) => {
  const token = req.headers.authorization;
  const { worker, hours, date } = req.body;
  try {
    if (token) {
      const decodedToken: any = jwtDecode(token);
      const manager = await ManagerModel.findOne({ userId: decodedToken.sub });
      if (manager) {
        console.log(manager)
        const existWorker = manager.workers.find(
          (wor) => wor.nameWorker === worker
        );
        const workerId = existWorker?._id;
        const newOvertimeHoursData = {
          date: new Date(date),
          hours: hours,
          worker: workerId
        };
        const newOvertimeHours = new OvertimeHoursModel(newOvertimeHoursData);
        newOvertimeHours.save();

        res.send("ok");
      }
    }

  } catch (error) {
    console.log(error);
  }
});

export default overtimeRoute;
