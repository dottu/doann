'use strict';
// import users from '../models/user'
// import addresses from '../models/address'
module.exports = (sequelize, DataTypes) => {
  const useraddress = sequelize.define('useraddresses', {
    userId: {
      allowNull: false,
      type:DataTypes.INTEGER,
      // references: {
      //   model: users,
      //   key: 'id'
      // } 
    },
    addressId: {
      allowNull: false,
      type :DataTypes.INTEGER,
      // references: {
      //   model: addresses, 
      //   key: 'id'
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
  useraddress.associate = function(models) {
    // associations can be defined here
    // useraddress.hasMany(models.addresses, {foreignKey : 'addressId'})
    useraddress.belongsTo(models.users, { through : 'useraddresses'})
    useraddress.belongsTo(models.addresses, { through : 'useraddresses'})

    // useraddress.belongsToMany(models.)
  };
  return useraddress;
};