const express = require('express');
const router = express.Router();
const exphbs = require('express-handlebars');
const path = require('path');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('./config/passport');
const fileupload = require('express-fileupload');
var Connection = require('tedious').Connection;  
const db = require('./config/db')
const dbSequelize = require('./config/dbSequelize')

// Conect and sync with sequelize database SQL
dbSequelize.sync().then(() => {
 		console.log('Data Base SQL connected');
 	})
 	.catch(err => {
 		console.log('Error: ', err);
 	});
  

// Create the server express
const app = express();

// Body parser and file upload controller
app.use(bodyParser.urlencoded({extended: true}));
app.use(fileupload());

app.use('/api', router);
// Settigns of expressnp: PORT
app.set('port', process.env.PORT || 80);

// Views directory
app.set('views', path.resolve(__dirname, './views'));

// Setting template engine
app.engine('.hbs', exphbs({
	layoutsDir: path.resolve(app.get('views'), 'layouts'),
	partialsDir: path.resolve(app.get('views'), 'partials'),
	defaultLayout: 'main',
	extname: '.hbs',
	helpers: require('./libs/handlebars')
}));

app.set('view engine', '.hbs');

// Public directory
app.use(express.static(path.resolve(__dirname, './public')));

// Flash Messages
app.use(flash());

//Cookies parser
app.use(cookieParser());

// Sesiones
app.use(session({
	secret: 'super-secret',
	resave: false,
	saveUninitialized: false
}));

//Passport module
app.use(passport.initialize());
app.use(passport.session());

//User session
app.use((req, res, next) => {
	res.locals.messages = req.flash();
	res.locals.user = {...req.user} || null;	
	next();
});

// Routes
app.use('/', require('./routes'));

// Start server
app.listen(app.get('port'), () => {
	console.log(`Server in port ${app.get('port')}`);
});