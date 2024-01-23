import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/sequelize';

class RefreshToken extends Model {
    public id!: number;
    public refreshTokenId!: string;
    public userName!: string;
}

RefreshToken.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        refreshTokenId: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        userName: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
    },
    {
        tableName: 'refresh_tokens',
        sequelize,
        timestamps: false,
    }
);

export default RefreshToken;
