'use strict';
module.exports = (sequelize, DataTypes) => {
  const warehouses = sequelize.define('warehouses', {
    bookId: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    soluongton: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE
    }
  }, {});
  warehouses.associate = function(models) {
    // associations can be defined here
    // warehouse.hasMany(models.warehouse)
  };
  return warehouses;
};