import { NextFunction, Request, Response } from 'express';

export const validateBody = (req: Request, res: Response, next: NextFunction) => {
    const { userName } = req.params;

    const senderUser = res.locals.user;
    const isAdmin = res.locals.isAdmin;

    // Define validation rules based on user role
    let baseValidationRules = ['firstName', 'lastName', 'address', 'city', 'zipCode', 'email', 'phoneNumber', 'gender'];
    const adminValidationRules = ['userName', 'birthDate', 'status'];

    let userNameToUpdate;

    // Add admin validation rules if the user is an admin
    if (isAdmin) {
        baseValidationRules = [...baseValidationRules, ...adminValidationRules];

        // Admin can update any user
        userNameToUpdate = userName;
    }

    // Validate the request body
    const requestBodyKeys = Object.keys(req.body);
    const isValid = requestBodyKeys.every((key) => baseValidationRules.includes(key));

    if (!isValid) {
        return res.status(400).json({ message: 'Invalid request body fields for the user role' });
    }

    // If the user is not an admin, they can only update their own user
    if (userName === senderUser.userName) {
        userNameToUpdate = userName;
    }

    if (!userNameToUpdate) {
        return res.status(400).json({ message: 'Invalid user name' });
    }

    res.locals.userNameToUpdate = userNameToUpdate;

    next();
};
