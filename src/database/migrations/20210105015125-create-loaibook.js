'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('loaibooks', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      namecategory: {
        allowNull: false,
        type: Sequelize.STRING
      },
      // bookid: {
      //   allowNull: false,
      //   type: Sequelize.INTEGER
      // },
      url :{
        allowNull: false,
        type : Sequelize.STRING
      },
      slug :{
        allowNull : false,
        type : Sequelize.STRING,
        unique: true
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
    return queryInterface.dropTable('loaibooks');
  }
};