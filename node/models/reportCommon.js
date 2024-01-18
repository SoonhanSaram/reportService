import { Sequelize } from "sequelize";

export default (sequelize) => {
    return sequelize.define('reportscommon', {
        report_seq: {
            type: Sequelize.DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        objectives: {
            type: Sequelize.DataTypes.STRING(255),
        },
        approval_status: {
            type: Sequelize.DataTypes.STRING(1),
            allowNull: false,
        },
        // report type 추가 (fron에서 보고서 종류를 인식)
        report_type: {
            type: Sequelize.DataTypes.STRING(1),
            allowNull: false,
        },
        author: {
            type: Sequelize.DataTypes.STRING(255),
            allowNull: false,
        },
        supervisor_sign: {
            type: Sequelize.DataTypes.STRING(255),
        },
        finance_sign: {
            type: Sequelize.DataTypes.STRING(255),
        },
        ceo_sign: {
            type: Sequelize.DataTypes.STRING(255),
        },
    }, {
        sequelize,
        tableName: 'reportscommon',
        timestamps: true,
        paranoid: true,
        underscored: true
    });
}