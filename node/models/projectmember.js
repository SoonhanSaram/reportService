import { Sequelize } from "sequelize";

export default (sequelize) => {
    return sequelize.define('projectmember', {
        pro_seq: {
            type: Sequelize.DataTypes.INTEGER,
            references: {
                medel: 'projectinfo',
                key: 'pro_seq',
            }
        },
        user_seq: {
            type: Sequelize.DataTypes.INTEGER,
            references: {
                medel: 'userinfo',
                key: 'user_seq'
            }
        }
    },
        {
            sequelize,
            tableName: 'projectmember',
            timestamps: false,
            paranoid: false,
            underscored: false,
        }
    )
}