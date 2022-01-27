const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook');
//var GoogleStrategy = require('passport-google-oauth20').Strategy;
var MixCloudStrategy = require('passport-mixcloud').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
let fs = require("fs");
const moment = require('moment-timezone');
var hoy = moment();
const request = require("request-promise");
// Modelo a auntenticar
const URI = 'https://sawoffice.technolify.com:8443/api1/x3/erp/SAWTEST1/'
const { encrypt, decrypt } = require('../controllers/crypto');
// Loca strategy - Login con credenciales propios
passport.use(
	new LocalStrategy(
		{
			usernameField: 'email',
			passwordField: 'password',
			passReqToCallback : true
		},
		async (req,email, password, done) => {
			let query_consulting= "&where=EMAIL eq '"+email+"'"
			try {
				const user = await request({
					uri: URI + 'YPORTALUSR?representation=YPORTALUSR.$query&count=10000'+ query_consulting,
					method:'GET',
					insecure: true,
					rejectUnauthorized: false,
					headers: {
					  'Content-Type': 'application/json',
					  'Accept': 'application/json',
					  'Authorization': 'Basic UE9SVEFMREVWOns1SEE3dmYsTkFqUW8zKWY=',
					  },
					json: true, // Para que lo decodifique automáticamente 
				  })
				  let decryptPass = decrypt(user['$resources'][0]['PASS'])
				  if (password== decryptPass) {
					return done(null, user);
				  }else{
					return done(null, false, {
						message: 'Password wrong'
					}); 
				  }
				
			}catch(err) {
				return done(null, false, {
					message: 'User not exist'
				});
			}
		}
	)
);


// Serializar el user
passport.serializeUser((user, callback) => {
	callback(null, user);
});

// Deserializar el user
passport.deserializeUser((user, callback) => {
	callback(null, user);
});

module.exports = passport;