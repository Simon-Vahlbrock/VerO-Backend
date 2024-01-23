// src/models/user.model.ts

import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/sequelize';

class User extends Model {
    public username!: string;
    public password!: string;
    public salt!: string;
    public firstname!: string;
    public lastname!: string;
    public refreshToken?: string;
}

User.init(
    {
        username: {
            type: DataTypes.STRING(50),
            primaryKey: true,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        salt: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        firstname: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        lastname: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        refreshToken: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    },
    {
        tableName: 'users',
        sequelize,
        timestamps: false,
    }
);

export default User;
