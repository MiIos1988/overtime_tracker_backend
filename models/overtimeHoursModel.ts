import mongoose from "mongoose";

const overtimeHoursSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  hours: {
    type: Number,
    required: true,
  },
  worker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "managers",
  },
});

const OvertimeHoursModel = mongoose.model("overtimeHours", overtimeHoursSchema);

export default OvertimeHoursModel;
