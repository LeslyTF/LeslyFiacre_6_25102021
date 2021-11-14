const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    //récuperation du token
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.DB_CLEENCODAGE);
    const userId = decodedToken.userId;
    if (req.body.userId && req.body.userId !== userId) {
      throw 'Invalid user ID';
    } else {
      //req.userIdAddedByAuth sert a vérifier l'utilisateur pour delete et modif
      req.userIdAddedByAuth = userId
      next();
    }
  } catch {
    res.status(401).json({
      error: new Error('Invalid request!')
    });
  }
};