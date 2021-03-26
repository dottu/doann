'use strict';

// const book = require("./book");

// import users from '../models/user'
// import books from '../models/book'
module.exports = (sequelize, DataTypes) => {
  const book_users = sequelize.define('book_users', {
    bookId: {
      type: DataTypes.INTEGER,
      // references: {
      //   model: books,
      //   key: 'id'
      // } 
    },
    userId: {
      type: DataTypes.INTEGER,
      // references: {
      //   model: users,
      //   key: 'id'
      // } 
    },
    soluongdat: {
      type: DataTypes.INTEGER
    },
    status: {
      type: DataTypes.ENUM("1", "0"),
      defaultValue: '0'
    },
  }, {});
  book_users.associate = function(models) {
    // associations can be defined here
    book_users.belongsTo(models.books, {foreignKey : 'bookId',sourceKey: 'id'})
    book_users.belongsTo(models.users, {foreignKey : 'userId', sourceKey: 'id'})
  };
  return book_users;
};