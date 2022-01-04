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

// Crear el servidor de express
const app = express();

// Habilitar body parser
app.use(bodyParser.urlencoded({extended: true}));
app.use(fileupload());

app.use('/api', router);
// Configuraciones de expressnp
app.set('port', process.env.PORT || 3000);

// Directiorio de las vistas
app.set('views', path.resolve(__dirname, './views'));

// Configurar template engine
app.engine('.hbs', exphbs({
	layoutsDir: path.resolve(app.get('views'), 'layouts'),
	partialsDir: path.resolve(app.get('views'), 'partials'),
	defaultLayout: 'main',
	extname: '.hbs',
	helpers: require('./libs/handlebars')
}));

app.set('view engine', '.hbs');

// Habilitar directiorio publico
app.use(express.static(path.resolve(__dirname, './public')));

// Agregar Flash Messages
app.use(flash());

app.use(cookieParser());

// Sesiones
app.use(session({
	secret: 'super-secret',
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
	res.locals.messages = req.flash();

	res.locals.user = {...req.user} || null;
	
	next();
});

// Habilitar las rutas
app.use('/', require('./routes'));

// Iniciar el servidor
app.listen(app.get('port'), () => {
	console.log(`Servidor en el puerto ${app.get('port')}`);
});