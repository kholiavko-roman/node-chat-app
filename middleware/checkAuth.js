const HttpError = require('error').HttpError;

module.exports = (req, res, next) => {
	if (!req.session.user) {
		return next(new HttpError(401, 'You have no access to this page'));
	}

	next();
}