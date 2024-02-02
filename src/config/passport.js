/**This script is for use the library passport to authenticate */
/**Check out in X3 with loggin query if the user and password are ok, and create a session with the response information */
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const request = require("request-promise");
var queryFolder = 'SAWTEST1' //Name the query folder X3
///var URI = `https://sawoffice.technolify.com:8443/api1/x3/erp/${queryFolder}/`; //URI query link
var URLHost = `https://sawoffice.technolify.com:8443/api1/x3/erp/`; //URI query link  
const DataBaseSq = require("../models/dataSequelize"); // Functions for SQL querys with sequelize
const DataBasequerys = require("../models/data");// Functions for SQL querys
var ip = require("ip");

const { encrypt, decrypt } = require('../controllers/crypto');

// Local strategy -
passport.use(
	new LocalStrategy(
		{
			usernameField: 'email',
			passwordField: 'password',
			passReqToCallback : true
		},
		async (req,email, password, done) => {
			let query_consulting= "&where=EMAIL eq '"+email+"'";
			req.session.queryFolder = (JSON.parse(await DataBaseSq.settingsqueryFolder()))['valueSett'];
			let Authorization_X3 = decrypt((JSON.parse(await DataBaseSq.settingsAuthorization_X3()))['valueSett']);
			req.session.Authorization_X3 = Authorization_X3;
			let URI = URLHost + req.session.queryFolder+"/";
			try {				
				const user = await request({
					uri: URI + 'YPORTALUSR?representation=YPORTALUSR.$query&count=10000'+ query_consulting,
					method:'GET',
					insecure: true,
					rejectUnauthorized: false,
					headers: {
					  'Content-Type': 'application/json',
					  Connection: 'close',
					  'Accept': 'application/json',
					  'Authorization': `Basic ${Authorization_X3}`,
					  },
					json: true,
				  })
				  console.log("🚀 ~ file: passport.js:40 ~ user:", user)
				  if (user['$resources'].length == 0) {
					return done(null, false, {
						message: 'User not exist'
					});
				  }
				  let decryptPass = decrypt(user['$resources'][0]['PASS'])
				  if (password == decryptPass) {
					return done(null, user);
				  }else{
					return done(null, false, {
						message: 'Password wrong'
					}); 
				  }
				
			}catch(err) {
				console.log("🚀 ~ file: passport.js:48 ~ err:", err)
				//console.log("🚀 ~ file: passport.js:48 ~ err:", err.response.body['$diagnoses'][0]['$severity'])
				//console.log("🚀 ~ file: passport.js:48 ~ err:", err.response.body['$diagnoses'][0]['$message'])
				let Description0 = "Error Login",
				Status = 0,
				Comment = err.response.body['$diagnoses'][0]['$message'];
				//tSystemLog(UserID, IPAddress, LogTypeKey, SessionKey, Description, Status, Comment)
				await DataBasequerys.tSystemLog('LoginPortal', ip.address(),11,null, Description0, Status, Comment);

				return done(null, false, {
					message: err.response.body['$diagnoses'][0]['$message']
				});
			}
		}
	)
);


// Serializar user
passport.serializeUser((user, callback) => {
	callback(null, user);
});

// Deserializar user
passport.deserializeUser((user, callback) => {
	callback(null, user);
});

module.exports = passport;
