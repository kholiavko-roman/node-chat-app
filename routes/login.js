const User = require('models/user').User;
const HttpError = require('error').HttpError;
const AuthError = require('error').AuthError;

exports.get = (req, res) => {
	res.render('login');
};

exports.post = (req, res, next) => {
	let username = req.body.username;
	let password = req.body.password;

	User.authorize(username, password, (err, user) => {
		if (err) {
			if (err instanceof AuthError) {
				return next(new HttpError(403, err.message));
			}

			return next(err);
		}

		req.session.user = user._id;
		res.send({});
	});



};