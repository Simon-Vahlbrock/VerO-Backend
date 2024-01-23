import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/sequelize';

export enum Status {
    // Full paying member
    Aktiv = 1,
    // Discounted paying member
    Passiv = 2,
    // Not paying member
    Special = 3,
    // Not in organisation anymore
    Left = 4,
}

export enum Gender {
    Male = 1,
    Female = 2,
    Diverse = 3,
}

export enum Role {
    // Mitglied
    Member = 1,
    // Mitglied Vorstand
    BoardMember = 2,
    // Mitglied Geschäftsführer Vorstand
    ExecutiveBoardMember = 3,
}

class User extends Model {
    public userName!: string;
    public password!: string;
    public salt!: string;
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
    public role!: Role;
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
        },
        role: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        tableName: 'users',
        sequelize,
        timestamps: false,
    }
);

export default User;
