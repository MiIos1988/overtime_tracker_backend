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
      console.log(existingManager);
      if (!existingManager) {
        await ManagerModel.create({
          email: decodedToken.email,
          userId: decodedToken.sub,
        });
        return res.send("Create manager");
      } else {
        console.log("Exist manager");
        return res.send("Exist manager");
      }
    } catch (error) {
      console.log(error);
      return res.send("Error manager");
    }
  }
  res.send("ok");
});

export default managerRoute;
