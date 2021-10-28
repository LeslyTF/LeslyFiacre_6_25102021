const mongoose = require ('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const likeSchema = mongoose.Schema ({
	userId: {type: String, required: true, unique: true},
	like: {type: Number, required: true}
});

likeSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Like',likeSchema);