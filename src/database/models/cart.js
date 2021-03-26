'use strict';

const bookcart = require("./bookcart");

module.exports = (sequelize, DataTypes) => {
  const carts = sequelize.define('carts', {
    // userId: {
    //   allowNull: false,
    //   type:DataTypes.INTEGER
    // },
    name: {
      allowNull: false,
      type: DataTypes.STRING
    },
    // soluongdat: {
    //   allowNull: false,
    //   type: DataTypes.INTEGER
    // },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE
    }
  }, {});
  carts.associate = function(models) {
    // associations can be defined here
    // carts.hasMany(models.books,{foreignKey : 'bookId'})
    // carts.hasOne(models.ships,{foreignKey : 'shipId'})4
    // carts.belongToMany(models.books,{through: bookcart})
    // carts.hasMany(models.bookcarts,{foreignKey : 'cartId'})
    // carts.belongsToMany(models.books,{through : "bookcarts"})
  };
  return carts;
};