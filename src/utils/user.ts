import UserRoles from '../models/userRoles.model';
import { UserRole } from '../types/user';

export const getUserRoles = async (userName: string): Promise<number[]> => {
    const roles = await UserRoles.findAll({ where: { userName } });

    return roles.map(({ roleId }) => roleId);
};

export const getIsAdmin = async (userName: string): Promise<boolean> => {
    const userRoles = await getUserRoles(userName);

    return userRoles.some((roleId) => roleId === UserRole.Admin);
};
