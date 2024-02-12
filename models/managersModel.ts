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
        overtimeHours: {
          type: [
            {
              type: mongoose.Schema.Types.ObjectId,
              ref: "OvertimeHours",
            },
          ],
          default: [],
        },
      },
    ],
    default: [],
  },
});

const ManagerModel = mongoose.model("managers", managersSchema);

export default ManagerModel;
