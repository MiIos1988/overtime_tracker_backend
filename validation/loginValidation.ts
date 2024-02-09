import {Request ,Response, NextFunction} from "express";
const AWS = require('aws-sdk');

const loginValidation = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;

    console.log(typeof(token))
    console.log(token)

    if(!token){
        return res.status(401).json({ message: 'Missing JWT token.' });
    }

    const cognito = new AWS.CognitoIdentityServiceProvider({ region: 'eu-north-1' });

    const params = {
        AccessToken: token as string
    };

    try {
         await cognito.getUser(params).promise();
        next();
    } catch (error) {
        console.error('Error verifying token:', error);
        return res.status(401).json({ error: 'Invalid JWT token.' });
    }
}

export default loginValidation;