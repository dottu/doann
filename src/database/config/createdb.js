require('dotenv').config()
const ENVS_USE = ['development', 'development'];

if (process.env && process.env.NODE_ENV && !ENVS_USE.includes(process.env.NODE_ENV)) {
  console.log("==== Create database only using for development environment ====");
  process.exit()
}

if (process.env.ENABLE_RESET_DB && process.env.ENABLE_RESET_DB === '0') {
  console.log("==== Can not reset database, if reset it, please set ENABLE_RESET_DB to value 1  ====");
  process.exit()
}

var mysql = require('mysql')

const configdb = {
  development: {
    username: process.env.DEV_DB_USERNAME,
    password: process.env.DEV_DB_PASSWORD,
    database: process.env.DEV_DB_NAME,
    host: process.env.DEV_DB_HOSTNAME || 'localhost'
  },
  test: {
    username: process.env.CI_DB_USERNAME,
    password: process.env.CI_DB_PASSWORD,
    database: process.env.CI_DB_NAME,
    host: process.env.CI_DB_HOSTNAME || 'localhost'
  },
  production: {
    username: process.env.PROD_DB_USERNAME,
    password: process.env.PROD_DB_PASSWORD,
    database: process.env.PROD_DB_NAME,
    host: process.env.PROD_DB_HOSTNAME || 'localhost'
  }
}

var setting = configdb[process.env.NODE_ENV]

var con = mysql.createConnection({
  host: setting.host,
  user: setting.username,
  password: setting.password
});

con.connect(function(err) {
  if (err) throw err;
  console.log("==== MySQL Connected! ====");
  con.query("DROP DATABASE IF EXISTS "+setting.database, function (err) {
    if (err) throw err;
    console.log("==== Database "+setting.database+" droped ====");
    con.query("CREATE DATABASE "+setting.database+" CHARACTER SET utf8 COLLATE utf8_unicode_ci;", function (err) {
      if (err) throw err;
      console.log("==== Database "+setting.database+" created ====");
      process.exit()
    });
  });
});


