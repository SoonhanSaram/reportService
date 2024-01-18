import { Sequelize } from "sequelize";

export default (sequelize) => {
    return sequelize.define('weeklyreports', {
        report_seq: {
            type: Sequelize.DataTypes.INTEGER,
            primaryKey: true,
        },
        start_date: {
            type: Sequelize.DataTypes.DATE,
        },
        end_date: {
            type: Sequelize.DataTypes.DATE,
        },
        day1_plan: {
            type: Sequelize.DataTypes.STRING(255),
        },
        day1_suggestions: {
            type: Sequelize.DataTypes.STRING(255),
        },
        day1_unique_points: {
            type: Sequelize.DataTypes.STRING(255),
        },
        // Repeat for day2 to day7
    }, {
        sequelize,
        tableName: 'weeklyreports',
        timestamps: false,
        // CASCADE 설정;
        references: {
            model: 'reportscommon',
            key: 'report_seq',
            onDelete: 'CASCADE',  // 삭제 시 CASCADE 설정
            onUpdate: 'CASCADE'   // 업데이트 시 CASCADE 설정
        }
    });
}