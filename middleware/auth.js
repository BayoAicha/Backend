const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
  const bearerHeader = req.headers['authorization'];

  if (typeof bearerHeader !== 'undefined') {
    const token = bearerHeader.split(' ')[1];
    console.log('Vérification du token:', token);
    jwt.verify(token, process.env.JWT_SECRET, (err, authData) => {
      if (err) {
        console.error('Erreur JWT:', err);
        return res.status(403).json({ message: 'Token invalide ou expiré', error: err.message });
      }
      req.user = authData;
      next();
    });
  } else {
    console.warn('Aucun token fourni dans Authorization');
    res.status(403).json({ message: 'Aucun token fourni dans Authorization' });
  }
};

exports.isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Accès refusé : administrateur seulement' });
  }
  next();
};
