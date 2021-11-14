const bcrypt = require('bcrypt');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const cryptojs = require('crypto-js');


//GESTION DU SIGN UP AVEC ENREGISTREMENT EN BDD 
exports.signup = (req, res, next) => {
//Verification de l'email coté backend
  const regEx = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
  if(req.body.email.match(regEx)) {
  //cryptage de l'email
  const emailCryptoJs= cryptojs.HmacSHA256(req.body.email, process.env.CRYPTOJS_KEY).toString();
	bcrypt.hash(req.body.password, 10)
	.then(hash => {
		const user = new User({
			email: emailCryptoJs,
			password: hash
		});
    //enrigistrement dans la base de données
		user.save()
		.then(() => res.status(201).json({message: 'utilisateur créé'}))
		.catch(error => res.status(400).json({error}));
	})
	.catch(error => res.status(500).json({ error })); 
}
//retour si erreur sur l'email est erroné
  else{
    return res.status(401).json({ message: "Certains caractères ne sont pas acceptés pour l'email " });
}
};
//GESTION DU LOGIN
exports.login = (req, res, next) => {
  //cryptage l'email 
  const emailCryptoJs= cryptojs.HmacSHA256(req.body.email, process.env.CRYPTOJS_KEY).toString();
  User.findOne({ email: emailCryptoJs })
    .then(user => {
      if (!user) {
        return res.status(401).json({ error: 'Utilisateur non trouvé !' });
      }
      //comparaison mdp via bcrypt
      bcrypt.compare(req.body.password, user.password)
        .then(valid => {
          if (!valid) {
            return res.status(401).json({ error: 'Mot de passe incorrect !' });
          }
          //gestion signature token
          res.status(200).json({
            userId: user._id,
            token: jwt.sign(
              { userId: user._id },
              process.env.DB_CLEENCODAGE,
              { expiresIn: '24h' }
            )
          });
        })
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};