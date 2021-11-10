const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
	Name: { type: String, required: true },
	Mobile: { type: Number, required: true },
	Email: { type: String, required: true },
	Gender: { type: String, required: false },
	DOB: { type: String, required: false },
	Pincode: { type: String, required: false },
	createdDate: { type: Date, default: Date.now }
});

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('customers', schema);