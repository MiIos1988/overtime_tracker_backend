import mongoose from "mongoose";

const managersSchema = new mongoose.Schema({
  email: {
    type: String,
    require: true,
  },
  userId: {
    type: String,
    require: true,
  },
  workers: {
    type: [
      {
        nameWorker: { type: String, require: true },
        overtimeHours: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "OvertimeHours",
          },
        ],
      },
    ],
    default: [],
  },
});

const ManagerModel = mongoose.model("managers", managersSchema);

export default ManagerModel;
