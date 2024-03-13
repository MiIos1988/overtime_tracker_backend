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
        const existWorker = manager.workers.find(
          (wor) => wor.nameWorker === worker
        );
        if (existWorker) {
          const workerId = existWorker?._id;
          const newOvertimeHoursData = {
            date: new Date(date),
            hours: hours,
            worker: workerId,
          };
          const newOvertimeHours = new OvertimeHoursModel(newOvertimeHoursData);
          await newOvertimeHours.save();

          existWorker.overtimeHours.push(newOvertimeHours._id);
          await manager.save();
          res.send("ok");
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
});

overtimeRoute.post(
  "/send-overtime-review-data",
  tokenValidation,
  async (req, res) => {
    const { worker, startDate, endDate } = req.body;
    const token = req.headers.authorization;
    const startDateUTC = new Date(startDate);
    startDateUTC.setUTCHours(0, 0, 0, 0);
    const endDateUTC = new Date(endDate);
    endDateUTC.setUTCHours(23, 59, 59, 999);
    try {
      if (token) {
        const decodedToken: any = jwtDecode(token);
        const manager = await ManagerModel.findOne({
          userId: decodedToken.sub,
        });
        if (manager) {
          const existWorker = manager.workers.find(
            (wor) => wor.nameWorker === worker
          );
          if (existWorker) {
            const overtimeHours = await OvertimeHoursModel.find({
              worker: existWorker._id,
              date: { $gte: new Date(startDateUTC), $lte: new Date(endDateUTC) },
            });
            const overtimeData = overtimeHours.map((obj) => {
              return {
                date: obj.date,
                hours: obj.hours,
                worker: existWorker.nameWorker,
              };
            });
            res.send({ overtimeData });
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
);

export default overtimeRoute;