const express = require('express');
const router = express.Router();
const Thing = require('../models/Thing');
const stuffCtrl = require('../controllers/stuff');
const auth = require ('../middleware/auth');
const multer = require ('../middleware/multer-config');

//ROUTE DES SAUCES 
router.post('/', auth, multer, stuffCtrl.createThing);
router.put('/:id',auth, multer,  stuffCtrl.modifyThing);
router.delete('/:id', auth, stuffCtrl.deleteThing);
router.get('/:id', auth,  stuffCtrl.getOneThing);
router.get('/', auth, stuffCtrl.getAllStuff);
router.post('/:id/like', auth, stuffCtrl.createLike);

module.exports = router;