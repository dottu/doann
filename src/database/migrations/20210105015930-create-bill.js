'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('bills', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
        // references : {
        //   model : users,
        //   key : 'id'
        // }
      },
      userId: {
        allowNull: false,
        type:Sequelize.INTEGER,

      },
      bookId: {
        allowNull: false,
        type:Sequelize.INTEGER,
        // references :{
        //   model : books,
        //   key: 'id'
        // }
      },
      soluongdat: {
        allowNull: false,
        type:Sequelize.INTEGER
      },
      addressId: {
        allowNull: false,
        type:Sequelize.INTEGER
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
    return queryInterface.dropTable('bills');
  }
};