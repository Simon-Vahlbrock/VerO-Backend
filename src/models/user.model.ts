import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/sequelize';
import { Gender, Status } from 'types/user';

class User extends Model {
    public userName!: string;
    public firstName!: string;
    public lastName!: string;
    public address!: string;
    public city!: string;
    public zipCode!: string;
    public email?: string;
    public phoneNumber?: string;
    public birthDate!: string;
    public status!: Status;
    public gender!: Gender;
}

User.init(
    {
        userName: {
            type: DataTypes.STRING(50),
            primaryKey: true,
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
        address: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        city: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        zipCode: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING(50),
            allowNull: true,
        },
        phoneNumber: {
            type: DataTypes.STRING(50),
            allowNull: true,
        },
        birthDate: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        status: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        gender: {
            type: DataTypes.INTEGER,
            allowNull: false,
        }
    },
    {
        tableName: 'users',
        sequelize,
        timestamps: false,
    }
);

export default User;
