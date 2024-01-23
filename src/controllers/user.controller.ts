import { Request, Response } from 'express';
import User from '../models/user.model';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

class UserController {
    static async register(req: Request, res: Response) {
        try {
            const { userName, password, firstName, lastName } = req.body;

            // Check if the username already exists
            const existingUser = await User.findOne({ where: { userName } });

            if (existingUser) {
                return res.status(409).json({ error: 'Username already exists' });
            }

            // Generate a salt and hash the password
            const saltRounds = 10;
            const salt = await bcrypt.genSalt(saltRounds);
            const hashedPassword = await bcrypt.hash(password, salt);

            // Generate a refresh token
            const refreshToken = jwt.sign({
                userName
            }, process.env.JWT_REFRESH_SECRET!, {
                expiresIn: '7d',
            });

            // Create the user
            await User.create({
                userName,
                password: hashedPassword,
                salt,
                firstName,
                lastName,
                refreshToken
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

            if (!user) {
                return res.status(401).json({ error: 'Invalid username or password' });
            }

            // Verify the password
            const isPasswordValid = await bcrypt.compare(password, user.password);

            if (!isPasswordValid) {
                return res.status(401).json({ error: 'Invalid username or password' });
            }

            // Generate a refresh token
            const refreshToken = jwt.sign(
                {
                    userName
                },
                process.env.JWT_REFRESH_SECRET!,
                { expiresIn: '7d' }
            );

            await user.update({ refreshToken });


            // Generate an access token
            const accessToken = jwt.sign({
                userName
            }, process.env.JWT_SECRET!, { expiresIn: '15m' });

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

    static async refreshAccessToken(req: Request, res: Response) {
        try {
            const { refreshToken } = req.body;

            // Verify the refresh token
            const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as { userName: string };

            // Find the user by username
            const user = await User.findOne({ where: { userName: decoded.userName } });

            if (!user || user.refreshToken !== refreshToken) {
                return res.status(401).json({ error: 'Invalid refresh token' });
            }

            // Issue a new refresh token
            const newRefreshToken = jwt.sign({
                userName: decoded.userName
            }, process.env.JWT_REFRESH_SECRET!, { expiresIn: '7d' });

            // Save the new refresh token to the user model
            await user.update({ refreshToken: newRefreshToken });

            // Issue a new access token
            const newAccessToken = jwt.sign({
                userName: decoded.userName
            }, process.env.JWT_SECRET!, { expiresIn: '15m' });

            res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
        } catch (error) {
            console.error(error);

            res.status(401).json({ error: 'Invalid refresh token' });
        }
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

            // Check if the user exists
            if (!user) {
                return res.status(401).json({ message: 'Invalid username and password' });
            }

            // Check if the current password is correct
            const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

            if (!isPasswordValid) {
                return res.status(401).json({ message: 'Invalid username and password' });
            }

            // Generate a salt and hash the password
            const saltRounds = 10;
            const salt = await bcrypt.genSalt(saltRounds);
            const newHashedPassword = await bcrypt.hash(newPassword, salt);

            // Update user's password and salt
            await User.update(
                {
                    password: newHashedPassword,
                    salt,
                },
                {
                    where: {
                        userName
                    },
                }
            );

            res.status(200).json({ message: 'Password updated successfully' });
        } catch (error) {
            console.error('Error updating password:', error);

            res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    static async logout(req: Request, res: Response) {
        try {
            const { refreshToken } = req.body;

            // Verify the refresh token
            const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as { userName: string };

            // Find the user by username
            const user = await User.findOne({ where: { userName: decoded.userName } });

            if (!user || user.refreshToken !== refreshToken) {
                return res.status(401).json({ error: 'Invalid refresh token' });
            }

            // Remove the refresh token from the user model
            await user.update({ refreshToken: null });

            res.json({ message: 'Logout successful' });
        } catch (error) {
            console.error(error);
            res.status(401).json({ error: 'Invalid refresh token' });
        }
    }
}

export default UserController;
