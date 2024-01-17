import { Sequelize } from "sequelize";

export default (sequelize) => {
    return sequelize.define('dailyreports', {
        report_seq: {
            type: Sequelize.DataTypes.INTEGER,
            primaryKey: true,
        },
        work_date: {
            type: Sequelize.DataTypes.DATE,
        },
        work_plan: {
            type: Sequelize.DataTypes.STRING(255),
        },
        suggestions: {
            type: Sequelize.DataTypes.STRING(255),
        },
        unique_points: {
            type: Sequelize.DataTypes.STRING(255),
        },
    }, {
        sequelize,
        tableName: 'dailyreports',
        timestamps: false,
    });

}