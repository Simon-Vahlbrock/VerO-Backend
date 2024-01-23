import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { Status } from '../models/user.model';

export const validateUser = async (req: Request, res: Response, next: NextFunction) => {
    const accessToken = req.headers['authorization']?.split(' ')[1];

    if (!accessToken) {
        return res.status(401).json({ error: 'Access token not found' });
    }

    try {
        const decoded: any = jwt.verify(accessToken, process.env.JWT_SECRET!);

        const user = await User.findOne({ where: { userName: decoded.userName } });

        if (!user || user.status === Status.Left) {
            return res.status(401).json({ error: 'Invalid access token' });
        }

        res.locals.user = user;

        next();
    } catch (error) {
        console.error(error);

        return res.status(401).json({ error: 'Invalid access token' });
    }
}
