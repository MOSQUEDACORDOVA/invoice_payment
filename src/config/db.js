var Connection = require('tedious').Connection;  
var db = {  
	server: 'SQL1.riboli.local',  //update me
	authentication: {
		type: 'default',
		options: {
			userName: 'sa', //update me
			password: `Q"lS:MSZGd3=5UMZ`  //update me
		}
	},
	options: {
		// If you are on Microsoft Azure, you need encryption:
		encrypt: true,
		database: 'X3Connect'  //update me
	}
}; 
module.exports = db;


