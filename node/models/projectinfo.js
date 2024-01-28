import { Sequelize } from "sequelize";

export default (sequelize) => {
    return sequelize.define('projectinfo', {
        pro_seq: {
            type: Sequelize.DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        pro_title: {
            type: Sequelize.DataTypes.STRING(255),
            allowNull: false,
        },
        pro_manager: {
            type: Sequelize.DataTypes.STRING(255),
            allowNull: false,
            references: {
                model: 'userinfo',
                key: 'user_name'
            }
        },
        pro_objective: {
            type: Sequelize.DataTypes.STRING(255),
            allowNull: false,
        },
        pro_period: {
            type: Sequelize.DataTypes.STRING(255),
        },
        pro_approval: {
            type: Sequelize.DataTypes.BOOLEAN,
            defaultValue: 0,
        },
        pro_status: {
            type: Sequelize.DataTypes.INTEGER,
            defaultValue: 0,
        }
    }, {
        sequelize,
        tableName: 'projectinfo',
        timestamps: true,
        paranoid: true,
        underscored: true,
    })
}