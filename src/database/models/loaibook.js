'use strict';
module.exports = (sequelize, DataTypes) => {
  const loaibooks = sequelize.define('loaibooks', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    namecategory: {
      allowNull:false,
      type: DataTypes.STRING
    },
    // bookid: {
    //   allowNull:false,
    //   type: DataTypes.INTEGER
    // },
    url :{
      allowNull :false,
      type : DataTypes.STRING
    },
    slug :{
      allowNull: false,
      type: DataTypes.STRING(255),
      unique: true
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
  loaibooks.associate = function(models) {
    // associations can be defined here
    loaibooks.hasMany(models.books,{foreignKey : 'loaibookId'})
  };
  return loaibooks;
};