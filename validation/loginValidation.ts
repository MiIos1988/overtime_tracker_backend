import {Request ,Response, NextFunction} from "express";
import jwt from 'jsonwebtoken';

const loginValidation = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;

    if(!token){
        return res.status(401).json({ message: 'Missing JWT token.' });
    }
    try {
        jwt.verify(token, { algorithms: ['RS256'] });
        next();
    } catch (error) {
        console.error('Error verifying token:', error);
        return res.status(401).json({ error: 'Invalid JWT token.' });
    }
}

export default loginValidation;