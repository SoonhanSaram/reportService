import Sequelize from 'sequelize';
export default (sequelize) => {
    return sequelize.define('fileInfo', {
        file_name: {
            type: Sequelize.DataTypes.STRING(256),
            primaryKey: true,
        },
        file_original_name: {
            type: Sequelize.DataTypes.STRING(256),
            allowNull: false
        },
        file_ext: {
            type: Sequelize.DataTypes.STRING(20),
            allowNull: false
        },
        file_path: {
            type: Sequelize.DataTypes.STRING(20),
            allowNull: false
        },
        file_owner: {
            type: Sequelize.DataTypes.BIGINT,
            allowNull: true,
            references: {
                model: 'userInfo', // 참조할 모델
                key: 'user_seq',   // 참조할 모델의 열
            },
        },
        file_permissions: {
            type: Sequelize.DataTypes.BOOLEAN,
        },
        deletedAt: {
            type: Sequelize.DataTypes.DATE,
            allowNull: true
        }
    }, {
        sequelize,
        tableName: 'fileInfo',
        timestamps: true,
        indexes: [
            {
                name: "PRIMARY",
                unique: true,
                using: "BTREE",
                fields: [
                    { name: "file_seq" },
                ]
            },
        ]
    });
};
