'use strict';
module.exports = (sequelize, DataTypes) => {
  const magiamgia = sequelize.define('magiamgia', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    magiamgia: {
      allowNull : false,
      type: DataTypes.STRING
    },
    status: {
      type: DataTypes.ENUM("conhan", "hethan"),
      defaultValue: 'conhan'
    },
    sale: {
      allowNull : true,
      type: DataTypes.INTEGER
    },
    sotiengiam: {
      allowNull : true,
      type: DataTypes.INTEGER
    },
    ngaybatdau : {
      allowNull: false,
      type :DataTypes.DATE
    },
    ngayketthuc : {
      allowNull: false,
      type :DataTypes.DATE
    },
    // timesale:{
    //   allowNull: false,
    //   type :  DataTypes.INTEGER
    // },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE
    }
  }, {});
  magiamgia.associate = function(models) {
    // associations can be defined here
  };
  return magiamgia;
};