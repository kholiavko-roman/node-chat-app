module.exports = (req, res, next) => {

	res.sendHttpError = (error) => {

		res.status(error.status);

		// If AJAX
		if (res.req.headers['x-requested-with'] == 'XMLHttpRequest') {
			res.json(error);
		} else {
			res.render('error', {error: error});
		}
	};

	next();
}