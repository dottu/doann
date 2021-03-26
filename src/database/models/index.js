'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const highlight = require('cli-highlight').highlight;
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';

const timezone = require('../../config/constant').timezone
const config = require(__dirname + '/../config/config.js')[env];

const db = {};
const dialectOptions = {
  dateStrings: true,
  typeCast: true
}
const opts = {
  define: {
    freezeTableName: true
  },
  logging(log) {
    console.log(highlight(log, {language: 'sql', ignoreIllegals: true}))
  }
}


let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], {...config, ...opts, ...{timezone, dialectOptions}});
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, {...config, ...opts, ...{timezone, dialectOptions}});
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = sequelize['import'](path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.Sequelize = Sequelize;

module.exports = db;