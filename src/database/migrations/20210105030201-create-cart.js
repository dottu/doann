'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('carts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      // userId: {
      //   allowNull: false,
      //   type: Sequelize.INTEGER
      // },
      // shipId: {
      //   allowNull: false,
      //   type: Sequelize.INTEGER
      // },
      // bookId: {
      //   allowNull: false,
      //   type: Sequelize.INTEGER
      // },
      // soluongdat: {
      //   allowNull: false,
      //   type: Sequelize.INTEGER
      // },
      name : {
        allowNull: false,
        type: Sequelize.STRING
      },
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
    return queryInterface.dropTable('carts');
  }
};