import fs from 'fs';
import jwt from 'jsonwebtoken';
import path from 'path';
import UserToken from '../models/userToken.model';

const privateKEY = fs.readFileSync(path.resolve(__dirname, './private.key'), 'utf8') as jwt.Secret;
const publicKEY = fs.readFileSync(path.resolve(__dirname, './public.key'), 'utf8') as jwt.Secret;

export interface TokenPayload {
    userTokenId: string;
    userName: string;
    issuerTokenId: string | null;
}

export const signToken = async (payload: TokenPayload, tokenType: 'access' | 'refresh'): Promise<string> => {
    const expiresIn = tokenType === 'access' ? '1h' : '90d';

    const token = jwt.sign(payload, privateKEY, { algorithm: 'RS256', expiresIn });

    await UserToken.create({ ...payload });

    return token;
};

export const verifyToken = async (token: string): Promise<TokenPayload | null> => {
    try {
        const decoded = jwt.verify(token, publicKEY, { algorithms: ['RS256'] }) as TokenPayload;

        const storedRefreshToken = await UserToken.findOne({
            where: {
                userTokenId: decoded.userTokenId
            }
        });

        if (!storedRefreshToken) {
            return null;
        }

        return decoded;
    } catch (error) {
        const decoded = jwt.decode(token) as TokenPayload;

        // destroy the given token
        await UserToken.destroy({
            where: {
                userTokenId: decoded.userTokenId
            }
        });

        // destroy the tokens that were issued by the given token
        await UserToken.destroy({
            where: {
                issuerTokenId: decoded.userTokenId
            }
        });

        return null;
    }
};

export const removeUserSessionTokens = async (token: string): Promise<void> => {
    const decoded = jwt.decode(token) as TokenPayload;

    // Destroy the access token
    await UserToken.destroy({
        where: {
            userTokenId: decoded.userTokenId
        }
    });

    // Destroy all other tokens that were issued by the same refresh token
    await UserToken.destroy({
        where: {
            issuerTokenId: decoded.issuerTokenId ?? decoded.userTokenId
        }
    });

    // Destroy the refresh token
    await UserToken.destroy({
        where: {
            userTokenId: decoded.issuerTokenId
        }
    });
};
