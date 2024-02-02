/**This script is for connect to SQL server with Sequelize and use the models for manipulated the tables  */
const { Sequelize } = require('sequelize');

DB_NAME="X3Connect";
DB_USER="sa";
DB_PASS='Q"lS:MSZGd3=5UMZ';
DB_HOST="10.99.99.5";
DB_PORT=3306;

const db = new Sequelize(DB_NAME, DB_USER, DB_PASS,
	{
		host: DB_HOST,
		dialect: 'mssql',//Dialect Microsoft SQL
		logging: false
	});

module.exports = db;


