const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
	Mobile: { type: Number, required: true },
});

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('sms', schema);