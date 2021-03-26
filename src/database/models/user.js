'use strict';
module.exports = (sequelize, DataTypes) => {
  const users = sequelize.define('users', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    // cartId : {
    //   allowNull:false,
    //   type: DataTypes.INTEGER
    // },
    // billId:{
    //   allowNull: false,
    //   type: DataTypes.INTEGER
    // },
    name:{
      allowNull: false,
      type: DataTypes.STRING
    },
    phonenumber: {
      allowNull: false,
      type :DataTypes.STRING(15)
    },
    password: {
      allowNull: false,
      type: DataTypes.STRING
    },
    // confirmpassword: {
    //   allowNull: false,
    //   type: DataTypes.STRING
    // },
    role: {
      allowNull: false,
      type: DataTypes.ENUM("admin","custom"),
      defaultValue: 'custom'
    },
    // createdAt: {
    //   allowNull: false,
    //   type: DataTypes.DATE
    // },
    // updatedAt: {
    //   allowNull: false,
    //   type: DataTypes.DATE
    // }
  }, {});
  users.associate = function(models) {
    // associations can be defined here
    users.hasOne(models.bills, {foreignKey : 'userId'})
    //
    // users.belongsToMany(models.books,{through : 'bills'})

    // users.belongsToMany(models.addresses , {through : 'bills'})
    //
    // users.belongsToMany(models.books, {through : 'BookUsers', foreignKey: 'userId', sourceKey: 'id', as: 'BookUsersx'})
    users.belongsToMany(models.books, {through : 'book_users', foreignKey: 'userId', sourceKey : 'id'})
    users.belongsToMany(models.addresses, {through : 'useraddresses'})
    users.hasMany(models.book_users, {foreignKey : 'userId'})
  };
  return users;
};