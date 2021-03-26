'use strict';

// const { default: bookServices } = require("../../webServices/bookServices");
// const users = require('../models/user')
// const books = require('../models/book')
// const addresses = require('../models/address')

module.exports = (sequelize, DataTypes) => {
  const bills = sequelize.define('bills', {
    userId: {
      allowNull: false,
      type:DataTypes.INTEGER,
      // references : {
      //   model : users,
      //   key : 'id'
      // }
    },
    bookId: {
      allowNull: false,
      type:DataTypes.INTEGER,
      // references :{
      //   model : books,
      //   key: 'id'
      // }
    },
    soluongdat: {
      allowNull: false,
      type:DataTypes.INTEGER
    },
    addressId: {
      allowNull: false,
      type:DataTypes.INTEGER,
      // references :{
      //   model : addresses,
      //   key : 'id'
      // }
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
  bills.associate = function(models) {
    // bills.hasOne(models.carts,{foreignKey: 'cartId'})
    // bills.hasMany(models.books, {foreignKey : ' bookId'})
    // bills.belongsToMany(models.books, { through : 'bills'})
    // bills.hasOne(models.addresses, { foreignKey : 'billId'})
    // bills.belongsToMany(models.addresses, { through : 'bills'})
  };
  return bills;
};