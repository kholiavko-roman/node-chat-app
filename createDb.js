const async = require('async');
const mongoose = require('libs/mongoose');

// Enable debug mode
mongoose.set('debug', true);


async.series([
	openDb,
	dropDatabase,
	requireModels,
	createUsers
], function (err, results) {
	if (err) throw err;

	mongoose.disconnect();
	console.log(arguments);
	process.exit(err ? 255 : 0);
});


function openDb(callback) {
	mongoose.connection.on('open', callback);
}

function dropDatabase(callback) {
	const db = mongoose.connection.db;
	db.dropDatabase(callback);
}

function requireModels(callback) {
	const User = require('models/user').User;
	User.on('index', callback);
}

function createUsers(callback) {
	let users = [
		{username: 'user1111', password: 'asdfghh'},
		{username: 'user222', password: 'asdfghh'},
		{username: 'user3333', password: 'asdfghh'}
	];

	async.each(users, (userData, callback) => {
		let user = new mongoose.models.User(userData);
		user.save(callback);
	}, callback);

}

