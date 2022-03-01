const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
// Check out if user is logged
exports.authenticatedUser = async (req, res, next) => {
	// It's authenticated, continue to next function
	if(req.isAuthenticated()) {		
		return next();
	}
	// If not authenticated return to loggin page
	return res.redirect('/login');
}