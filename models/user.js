const crypto = require('crypto');
const mongoose = require('./../libs/mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
	username: {
		type: String,
		unique: true,
		required: true
	},
	hashedPassord: {
		type: String,
		required: true
	},
	salt: {
		type: String,
		required: true
	},
	created: {
		type: Date,
		default: Date.now()
	}
});

schema.methods.encryptPassword = (passord) => {
	return crypto.createHmac('sha1', this.salt).update(passord).digest('hex');
};

schema.virtual('password')
		.set((password) => {
			this._plainPassword = password;
			this.salt = Math.random() + '';
			this.hashedPassord = this.encryptPassword(password);
		})
		.get(() => {
			return this._plainPassword;
		});

exports.User = mongoose.model('User', schema);