import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/sequelize';

class Password extends Model {
    public password!: string;
    public salt!: string;
    public userName!: string;
}

Password.init(
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
    },
    {
        tableName: 'passwords',
        sequelize,
    },
);

export default Password;
