const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

// Comprobar si el usuario esta logueado
exports.authenticatedUser = async (req, res, next) => {

	// Autenticado
	if(req.isAuthenticated()) {
		
		usuario = await Usuarios.findOne({where: {email: req.user.email}});
		console.log(req.user)
		usuario.save(function(err) {
			if (err) console.log(err);
			return done(null, usuario);
		});
		res.locals.user = req.user;
		return next();
	}

	// Si no esta autenticado
	return res.redirect('/login');

}