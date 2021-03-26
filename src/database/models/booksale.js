'use strict';
module.exports = (sequelize, DataTypes) => {
  const booksale = sequelize.define('booksales', {
    bookId: {
      allowNull: false,
      type : DataTypes.INTEGER
    },
    saleId: { 
      allowNull: false,
      type :DataTypes.INTEGER
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
  booksale.associate = function(models) {
    // associations can be defined here
  };
  return booksale;
};