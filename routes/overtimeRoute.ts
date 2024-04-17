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
          const showOvertimeHours = OvertimeHoursModel.find(
            {
              _id: { $in: existWorker.overtimeHours }
            });
          console.log(showOvertimeHours, "OK working") 
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
              date: {
                $gte: new Date(startDateUTC),
                $lte: new Date(endDateUTC),
              },
            });
            const overtimeData = overtimeHours.map((obj) => {
              const options: Intl.DateTimeFormatOptions = {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              };
              return {
                date: obj.date.toLocaleDateString("en-GB", options),
                hours: obj.hours,
                id: obj._id,
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

overtimeRoute.delete(
  "/delete-overtime-hours/:id",
  tokenValidation,
  async (req, res) => {
    const { id } = req.params;
    try {
      const overtimeHours = await OvertimeHoursModel.findOneAndDelete({
        _id: id,
      });

      overtimeHours
        ? res.send({ id: overtimeHours._id })
        : res.status(400).send("Error");
    } catch (error) {
      console.log(error);
    }
  }
);

export default overtimeRoute;
