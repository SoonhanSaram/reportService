import Sequelize from 'sequelize';
export default (sequelize) => {
  return sequelize.define('corporationinfo', {
    corp_number: {
      type: Sequelize.DataTypes.STRING(256),
      allowNull: false,
      primaryKey: true,
    },
    corp_name: {
      type: Sequelize.DataTypes.STRING(256),
      allowNull: false
    },
    corp_category: {
      type: Sequelize.DataTypes.STRING(256),
      allowNull: false
    },
    corp_tel: {
      type: Sequelize.DataTypes.STRING(14),
      allowNull: false
    },
    deletedAt: {
      type: Sequelize.DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'corporationinfo',
    timestamps: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "corp_number" },
        ]
      },
    ]
  });
};
