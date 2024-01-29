import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/sequelize';

class Role extends Model {
    public id!: number;
    public roleName!: string;
}

Role.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    roleName: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
}, {
    tableName: 'roles',
    sequelize,
    timestamps: false,
});

export default Role;
