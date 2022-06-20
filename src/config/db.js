/** This script is for connect to SQL server with Tedius */
var Connection = require('tedious').Connection;  
// var db = {  
// 	server: 'SQL1.riboli.local',  //SQL SERVER
// 	authentication: {
// 		type: 'default',
// 		options: {
// 			userName: 'sa', //USER
// 			password: `Q"lS:MSZGd3=5UMZ`  //PASS
// 		}
// 	},
// 	options: {
// 		//Encrypt and get the database
// 		encrypt: true,
// 		database: 'X3Connect'  //Database Name
// 	}
// }; 

var db = {
	server: 'sql1.riboli.local', //SQL SERVER
	authentication: {
	type: 'default',
	options: {
	userName: 'portal', //USER
	password: `GNnIRu!6!X3RItIq` //PASS
	}
	},
	options: {
	//Encrypt and get the database
	encrypt: true,
	database: 'portal' //Database Name
	}
	};
module.exports = db;


