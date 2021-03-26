'use strict';
module.exports = (sequelize, DataTypes) => {
  const sale = sequelize.define('sales', {
    bookId: {
      allowNull : false,
      type :DataTypes.INTEGER,
    },
    sale: {
      allowNull: false,
      type : DataTypes.STRING,
    }
  }, {});
  sale.associate = function(models) {
    // associations can be defined here
  };
  return sale;
};