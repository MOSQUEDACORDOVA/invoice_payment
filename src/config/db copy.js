var Connection = require('tedious').Connection;  
// var db = {  
// 	server: 'SQL1.riboli.local',  //update me
// 	authentication: {
// 		type: 'default',
// 		options: {
// 			userName: 'sa', //update me
// 			password: `Q"lS:MSZGd3=5UMZ`  //update me
// 		}
// 	},
// 	options: {
// 		// If you are on Microsoft Azure, you need encryption:
// 		encrypt: true,
// 		database: 'X3Connect'  //update me
// 	}
// }; 
const { Sequelize } = require('sequelize');

DB_NAME="X3Connect";
DB_USER="sa";
DB_PASS=`Q"lS:MSZGd3=5UMZ`;
DB_HOST="SQL1.riboli.local";
DB_PORT=3306;


const db = new Sequelize(DB_NAME, DB_USER, DB_PASS,
	{
		host: DB_HOST,
		dialect: 'mssql',
	});

module.exports = db;


