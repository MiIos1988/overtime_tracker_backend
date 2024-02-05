import express from "express";
const app = express();
import mongoose from "mongoose";
import cors from "cors";
import * as dotenv from "dotenv";
import managerRoute from "./routes/managerRoute";
dotenv.config();
const portNumber = process.env.PORT;
const mongoDbUrl = process.env.MONGO_DB_URL;

if (mongoDbUrl) {
  mongoose
    .connect(mongoDbUrl)
    .then(() => {
      console.log("Mongo DB is connected...");
    })
    .catch((err) => {
      console.log(err);
      console.log("Error while connecting to Mongo DB...");
    });
}

app.use(express.json());
app.use(cors());
app.use("/api/manager", managerRoute);

app.listen(portNumber, (err?: any) => {
  err
    ? console.log("Error on server start...")
    : console.log(`Server is running on port ${portNumber}...`);
});
