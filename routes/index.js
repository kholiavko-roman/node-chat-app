const express = require('express');
const router = express.Router();
const User = require('models/user').User;
const HttpError = require('error').HttpError;
const checkAuth = require('middleware/checkAuth');

// Show homepage
router.get('/', require('./frontpage').get);

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

// Show Login page
router.get('/login', require('./login').get);
router.post('/login', require('./login').post);

// Logout
router.post('/logout', require('./logout').post);

// Show chat page
router.get('/chat', checkAuth, require('./chat').get);

module.exports = router;
