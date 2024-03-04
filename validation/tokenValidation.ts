import { Request, Response, NextFunction } from "express";
import { CognitoJwtVerifier } from "aws-jwt-verify";
import * as dotenv from "dotenv";
dotenv.config();

const loginValidation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization;
  const USER_POOL_ID = process.env.USER_POOL_ID;
  const CLIENT_ID = process.env.CLIENT_ID;

  if (USER_POOL_ID && CLIENT_ID) {
    const verifier = CognitoJwtVerifier.create({
      userPoolId: USER_POOL_ID,
      tokenUse: "access",
      clientId: CLIENT_ID,
      tokenExpiration: "3h"
    });

    try {
      if (token) {
        const tokenWithoutBearer = token.replace("Bearer ", "");
        await verifier.verify(tokenWithoutBearer);
        next();
      }else {
        return res.status(400).json({ error: "JWT token required." });
      }
    } catch (error) {
      console.error("Error verifying token:", error);
      return res.status(400).json({ error: "Invalid JWT token." });
    }
  }
};

export default loginValidation;
