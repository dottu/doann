'use strict';

module.exports = (sequelize, DataTypes) => {
  const comment_book = sequelize.define('comment_books', {
    noidung: {
      type :DataTypes.STRING
    },
    luotthich: {
      type :DataTypes.INTEGER,
    },
    bookId: {
      type :DataTypes.INTEGER,
      // references: {
      //   model: books, 
      //   key: 'id'
      // }
    },
    userId: {
      type :DataTypes.INTEGER,
      // references: {
      //   model: users, 
      //   key: 'id'
      // }
    }
  }, {});
  comment_book.associate = function(models) {
    // associations can be defined here
    comment_book.belongsTo(models.books)
    comment_book.belongsTo(models.users)
  };
  return comment_book;
};