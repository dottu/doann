'use strict';
module.exports = (sequelize, DataTypes) => {
  const danhgia_book = sequelize.define('danhgia_books', {
    sosao: DataTypes.INTEGER,
    bookId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER
  }, {});
  danhgia_book.associate = function(models) {
    // associations can be defined here
    danhgia_book.belongsTo(models.books)
    danhgia_book.belongsTo(models.users)
  };
  return danhgia_book;
};