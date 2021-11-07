const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  console.log(req);
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, '>FKTU4*?pGN,K]h');
    const userId = decodedToken.userId;
    if (req.body.userId && req.body.userId !== userId) {
      throw 'Invalid user ID';
    } else {
      req.userIdAddedByAuth = userId
      
      next();
    }
  } catch {
    res.status(401).json({
      error: new Error('Invalid request!')
    });
  }
};