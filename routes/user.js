const express = require('express');
const router = express.Router();
const userCtrl = require ('../controllers/user');

//ROUTE DE ESTION DES IDENTIFIANTS DE CONNEXION
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;