'use strict';

// const { HasMany } = require("sequelize/types");

module.exports = (sequelize, DataTypes) => {
  const bookcart = sequelize.define('bookcarts', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    bookId: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    cartId: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    userId: {
      allowNull: true,
      type: DataTypes.INTEGER
    },
    soluongdat:{
      allowNull: false,
      type: DataTypes.INTEGER
    },
    giasale:{
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
  bookcart.associate = function(models) {
    // associations can be defined here
    // bookcart.hasMany(models.books,{foreignKey: 'bookId'})
    // bookcart.belongsToMany(models.books,{through : 'bookcarts'})
    // bookcart.belongsToMany(models.users,{through : 'bookcarts'})
    
  };
  return bookcart;
};