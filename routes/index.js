const express = require('express');
const router = express.Router();
const User = require('models/user').User;
const HttpError = require('error').HttpError;

// Show homepage
router.get('/', (req, res, next) => {
  res.render('index', {
		title: 'Express',
		heading2: '<h2>heading 2</h2>'
	});
});

// Show all users
router.get('/users', (req, res, next) => {
	User.find({}, (err, users) => {
		if (err) return next(err);
		res.json(users);
	})
});

router.get('/user/:id', (req, res, next) => {
	User.findOne({id: req.params.id}, (err, user) => {
		if (err) return next(err);

		console.log('ID ' + req.params.id);
		console.dir(user);

		if (!user) {
			return next(new HttpError(404, "User not found"));
		}

		res.json(user);
	});
});

module.exports = router;
