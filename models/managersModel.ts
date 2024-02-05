import mongoose from "mongoose";

const managersSchema = new mongoose.Schema({
    email: {
        type: String,
        require: true, 
    },
    userId: {
        type: String,
        require: true
    }
});

const ManagerModel = mongoose.model("managers", managersSchema);

export default ManagerModel;