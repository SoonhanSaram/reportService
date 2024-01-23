import Sequelize from 'sequelize';
export default (sequelize) => {
    return sequelize.define('roleinfo', {
        role_num: {
            type: Sequelize.DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        role_name: {
            type: Sequelize.DataTypes.STRING(256),
            allowNull: false
        },
    }, {
        sequelize,
        tableName: 'roleinfo',
        timestamps: false,
    });
};
