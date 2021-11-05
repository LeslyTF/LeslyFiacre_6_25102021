const mongoose = require('mongoose');

// GESTION DE LA CONFIGURATION DES SAUCES
const sauceSchema = mongoose.Schema({
  name: { type: String, required: true },
  manufacturer: {type: String, required: true},
  description: { type: String, required: true },
  mainPepper: {type: String, required: true},
  heat: {type: Number, required: true},
  likes: {type: Number},
  dislikes: {type: Number},
  usersLiked:{ type: Array},
  usersDisliked: { type: Array},
  imageUrl: { type: String},
  userId: { type: String, required: true }, 
});

module.exports = mongoose.model('Sauce', sauceSchema);
