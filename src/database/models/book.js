'use strict';

// const { bookcart } = require("../../config/constant");

module.exports = (sequelize, DataTypes) => {
  const books = sequelize.define('books', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    loaibookId: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    masp: {
      allowNull: false,
      type: DataTypes.STRING
    },
    image: {
      allowNull: false,
      type:DataTypes.STRING
    },
    title: {
      allowNull: false,
      type:DataTypes.STRING
    },
    description: {
      allowNull: false,
      type:DataTypes.STRING
    },
    status: {
      type: DataTypes.ENUM("1", "0"),
      defaultValue: '1'
    },
    author: {
      allowNull: false,
      type: DataTypes.STRING
    },
    cost: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    luotmua: {
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
  books.associate = function(models) {
    // associations can be defined here
    books.hasMany(models.bookcarts,{foreignKey : 'bookId'})
    books.hasMany(models.bills,{foreignKey: 'bookId'})
    // books.hasMany(models.booksales, {foreignKey: 'bookId'})
    books.hasMany(models.sales, {foreignKey: 'bookId'})
    // //
    books.hasMany(models.warehouses, {foreignKey : 'bookId'})
    //
    // books.hasMany(models.BookUsers, {foreignKey : 'bookId', sourceKey: 'id', as: 'haha'})
    // books.hasMany(models.BookUsers, {foreignKey : 'bookId'})
    books.belongsToMany(models.users, {through : 'book_users', sourceKey : 'id'})
    books.belongsToMany(models.users, {through : 'comment_books', foreignKey : 'bookId', otherKey : 'userId'})
    // books.hasMany(models.book_users, {foreignKey : 'bookId'})

    // books.belongsToMany(models.users, {through : "comment_books", foreignKey:'bookId'})
    // books.belongsToMany(models.users, {through : "danhgia_books", foreignKey: 'bookId'})
    books.hasMany(models.comment_books, {foreignKey : 'bookId',as :'commentbook'})

  };
  return books;
};