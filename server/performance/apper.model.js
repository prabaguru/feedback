const mongoose = require('mongoose');
const AppSchema = mongoose.Schema;


const appSchema = new AppSchema({
	rating: { type: String, required: true },
	name:{ type: String, required: false },
	Comments:{ type: String, required: false },
	createdDate: { type: Date, default: Date.now }
});

appSchema.set('toJSON', { virtuals: true });
module.exports = mongoose.model('APPFeedback', appSchema);