import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/sequelize';

class UserRoles extends Model {
    public userName!: string;
    public roleId!: number;
}

UserRoles.init({
    userName: {
        type: DataTypes.STRING(50),
        primaryKey: true,
        allowNull: false,
    },
    roleId: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        allowNull: false,
    },
}, {
    tableName: 'user_roles',
    sequelize,
    timestamps: false,
});

export default UserRoles;
