import { Request, Response, NextFunction } from 'express';
import User, { Status } from '../models/user.model';
import { verifyToken } from '../utils/auth';

export const validateUser = async (req: Request, res: Response, next: NextFunction) => {
    const accessToken = req.headers['authorization']?.split(' ')[1];

    if (!accessToken) {
        return res.status(401).json({ error: 'Access token not found' });
    }

    const decoded = await verifyToken(accessToken);

    // if issuerTokenId is set, it is a refresh token
    if (decoded === null || !decoded.issuerTokenId) {
        return res.status(401).json({ error: 'Invalid access token' });
    }

    const user = await User.findOne({ where: { userName: decoded.userName } });

    if (!user || user.status === Status.Left) {
        return res.status(401).json({ error: 'Invalid access token' });
    }

    res.locals.user = user;

    next();
};
