'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('magiamgia', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      magiamgia: {
        allowNull: false,
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.ENUM("conhan", "hethan"),
        defaultValue: 'conhan'
      },
      sotiengiam: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      ngaybatdau : {
        allowNull: false,
        type :Sequelize.DATE
      },
      ngayketthuc : {
        allowNull: false,
        type :Sequelize.DATE
      },
      // timesale:{
      //   allowNull : false,
      //   type: Sequelize.INTEGER
      // },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('magiamgia');
  }
};