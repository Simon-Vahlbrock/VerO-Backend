import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/sequelize';

class UserToken extends Model {
    public id!: number;
    public userTokenId!: string;
    public userName!: string;
    public issuerTokenId!: string | null;
}

UserToken.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        userTokenId: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        userName: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        issuerTokenId: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    },
    {
        tableName: 'user_tokens',
        sequelize,
        timestamps: false,
    }
);

export default UserToken;
