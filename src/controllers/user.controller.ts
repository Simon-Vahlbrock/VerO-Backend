import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import User, { Status } from '../models/user.model';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { removeUserSessionTokens, removeUserTokensFromAllSessions, signToken, verifyToken } from '../utils/auth';
import Password from '../models/password.model';

dotenv.config();

class UserController {
    static async register(req: Request, res: Response) {
        try {
            const {
                userName,
                password,
                firstName,
                lastName,
                address,
                city,
                zipCode,
                email,
                phoneNumber,
                birthDate,
                status,
                gender,
                role
            } = req.body;

            // Check if the username already exists
            const existingUser = await User.findOne({ where: { userName } });

            if (existingUser) {
                return res.status(409).json({ error: 'Username already exists' });
            }

            // Generate a salt and hash the password
            const saltRounds = 10;
            const salt = await bcrypt.genSalt(saltRounds);
            const hashedPassword = await bcrypt.hash(password, salt);

            // Create the user
            await User.create({
                userName,
                firstName,
                lastName,
                address,
                city,
                zipCode,
                email,
                phoneNumber,
                birthDate,
                status,
                gender,
                role
            });

            await Password.create({
                password: hashedPassword,
                salt,
                userName
            });


            res.status(201).json({
                message: 'User registered successfully',
            });
        } catch (error) {
            console.error('Error in user registration:', error);

            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    static async login(req: Request, res: Response) {
        try {
            const { userName, password } = req.body;

            // Find the user by username
            const user = await User.findOne({ where: { userName } });
            const dbPassword = await Password.findOne({ where: { userName } });

            if (!user || user.status === Status.Left || !dbPassword) {
                return res.status(401).json({ error: 'Invalid username or password' });
            }

            // Verify the password
            const isPasswordValid = await bcrypt.compare(password, dbPassword.password);

            if (!isPasswordValid) {
                return res.status(401).json({ error: 'Invalid username or password' });
            }

            const userRefreshTokenId = uuidv4();
            const userAccessTokenId = uuidv4();

            const refreshToken = await signToken({
                userTokenId: userRefreshTokenId,
                userName,
                issuerTokenId: null
            }, 'refresh');

            const accessToken = await signToken({
                userTokenId: userAccessTokenId,
                userName,
                issuerTokenId: userRefreshTokenId
            }, 'access');

            res.status(200).json({
                message: 'Login successful',
                refreshToken,
                accessToken
            });
        } catch (error) {
            console.error('Error in user login:', error);

            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    static async refreshToken(req: Request, res: Response) {
        const isRefreshToken = req.query.isRefreshToken === 'true';

        const { refreshToken } = req.body;

        // Check, if token is still valid
        const decoded = await verifyToken(refreshToken);

        if (decoded === null) {
            return res.status(401).json({ error: 'Invalid refresh token' });
        }

        // Find the user by userName
        const user = await User.findOne({ where: { userName: decoded.userName } });

        if (!user) {
            return res.status(401).json({ error: 'Invalid refresh token' });
        }

        if (isRefreshToken) {
            await removeUserSessionTokens(refreshToken);
        }

        const userTokenId = uuidv4();

        // Create a new token
        const token = await signToken({
            userTokenId,
            userName: user.userName,
            issuerTokenId: !isRefreshToken ? decoded.userTokenId : null
        }, isRefreshToken ? 'refresh' : 'access');


        res.status(200).json({
            message: 'Token refreshed successfully',
            [isRefreshToken ? 'refreshToken' : 'accessToken']: token
        });
    }

    static async updatePassword(req: Request, res: Response) {
        try {
            const { userName, currentPassword, newPassword } = req.body;

            // Find the user by username
            const user = await User.findOne({
                where: {
                    userName
                },
            });
            const dbPassword = await Password.findOne({
                where: {
                    userName
                },
            });

            // Check if the user exists
            if (!user || !dbPassword) {
                return res.status(401).json({ message: 'Invalid username and password' });
            }

            // Check if the current password is correct
            const isPasswordValid = await bcrypt.compare(currentPassword, dbPassword.password);

            if (!isPasswordValid) {
                return res.status(401).json({ message: 'Invalid username and password' });
            }

            // Generate a salt and hash the password
            const saltRounds = 10;
            const salt = await bcrypt.genSalt(saltRounds);
            const newHashedPassword = await bcrypt.hash(newPassword, salt);

            await Password.update({
                password: newHashedPassword,
                salt,
            }, {
                where: {
                    userName
                }
            });

            res.status(200).json({ message: 'Password updated successfully' });
        } catch (error) {
            console.error('Error updating password:', error);

            res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    static async logout(req: Request, res: Response) {
        const fromAllSessions = req.query.fromAllSessions === 'true';

        try {
            const accessToken = req.headers['authorization']?.split(' ')[1];

            if (!accessToken) {
                return res.status(401).json({ error: 'Access token not found' });
            }

            // Verify the access token
            const decoded = await verifyToken(accessToken);

            if (decoded === null) {
                return res.status(401).json({ error: 'Invalid access token' });
            }

            // Find the user by username
            const user = await User.findOne({ where: { userName: decoded.userName } });


            if (!user) {
                return res.status(401).json({ error: 'Invalid refresh token' });
            }

            if (fromAllSessions) {
                await removeUserTokensFromAllSessions(user.userName);
            } else {
                await removeUserSessionTokens(accessToken);
            }


            res.json({ message: 'Logout successful' });
        } catch (error) {
            console.error(error);
            res.status(401).json({ error: 'Invalid refresh token' });
        }
    }

    static async getAllUsers(req: Request, res: Response) {
        try {
            const users = await User.findAll();

            // filter out the password and salt
            const filteredUsers = users.map(user => {
                const { password, salt, ...rest } = user.toJSON();

                return rest;
            });

            res.json(filteredUsers);
        } catch (error) {
            console.error(error);

            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    static async getUser(req: Request, res: Response) {
        const user = res.locals.user;

        res.json(user);
    }

    static async updateUser(req: Request, res: Response) {
        const userNameToUpdate = res.locals.userNameToUpdate;

        const {
            userName,
            firstName,
            lastName,
            address,
            city,
            zipCode,
            email,
            phoneNumber,
            gender,
            role,
            status,
            birthDate
        } = req.body;

        await User.update({
            userName,
            firstName,
            lastName,
            address,
            city,
            zipCode,
            email,
            phoneNumber,
            gender,
            role,
            status,
            birthDate
        }, {
            where: {
                userName: userNameToUpdate
            }
        });

        res.json({ message: 'User updated successfully' });
    }
}

export default UserController;
