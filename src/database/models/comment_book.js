'use strict';

module.exports = (sequelize, DataTypes) => {
  const comment_book = sequelize.define('comment_books', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
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
    },
    status: {
      type: DataTypes.ENUM("1", "0"),
      defaultValue: '0'
    },
  }, {});
  comment_book.associate = function(models) {
    // associations can be defined here
    comment_book.belongsTo(models.books,{ foreignKey : 'bookId'})
    comment_book.belongsTo(models.users, { foreignKey : 'userId',as : 'abcc'})
    comment_book.hasMany(models.likes, {foreignKey : 'commentId'})
  };
  return comment_book;
};