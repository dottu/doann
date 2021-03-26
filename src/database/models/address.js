'use strict';

const { add } = require("winston");

module.exports = (sequelize, DataTypes) => {
  const addresses = sequelize.define('addresses', {
    name: {
      allowNull: false,
      type: DataTypes.STRING
    },
    email: {
      allowNull: false,
      type: DataTypes.STRING
    },
    phonenumber: {
      allowNull: false,
      type: DataTypes.STRING
    },
    address:{
      allowNull: false,
      type:DataTypes.STRING
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
  }, {});
  addresses.associate = function(models) {
    // associations can be defined here
    // addresses.hasOne(models.bills, {foreignKey: 'addressId'})
    // addresses.hasMany(models.useraddresses, {foreignKey : 'addressId'})
    addresses.belongsToMany(models.users, {through : 'useraddresses'})
    // addresses.hasMany(models.useraddresses, {foreignKey : 'addressId'})
  };
  return addresses;
};