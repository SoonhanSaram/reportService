import Sequelize from 'sequelize';
export default (sequelize) => {
  return sequelize.define('userinfo', {
    user_seq: {
      type: Sequelize.DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    user_name: {
      type: Sequelize.DataTypes.STRING(256),
      allowNull: false
    },
    user_password: {
      type: Sequelize.DataTypes.STRING(256),
      allowNull: false
    },
    user_authority: {
      type: Sequelize.DataTypes.INTEGER,
      defaultValue: 5,
    },
    // user_belongto: {
    //   type: Sequelize.DataTypes.STRING(256),
    //   allowNull: false
    // },
    user_approval: {
      type: Sequelize.DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: true,
    },
    deletedAt: {
      type: Sequelize.DataTypes.DATE,
      allowNull: true
    },
    corp_belongto: {
      type: Sequelize.DataTypes.STRING(256),
      allowNull: false,
      references: {
        model: 'corporationinfo',
        key: 'corp_number'
      }
    }
  }, {
    sequelize,
    tableName: 'userinfo',
    timestamps: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "user_seq" },
        ]
      },
      {
        name: "fk_corp_belongto",
        using: "BTREE",
        fields: [
          { name: "corp_belongto" },
        ]
      },
    ]
  });
};
