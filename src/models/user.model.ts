import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/sequelize';

class User extends Model {
    public userName!: string;
    public password!: string;
    public salt!: string;
    public firstName!: string;
    public lastName!: string;
    public refreshToken?: string;
}

User.init(
    {
        userName: {
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
        firstName: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        lastName: {
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
