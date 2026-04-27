const jwt   = require('jsonwebtoken');
const Admin = require('../models/Admin');

const protegerRoute = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Token manquant. Ajoutez : Authorization: Bearer <token>'
      });
    }

    const token   = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin   = await Admin.findOne({ where: { id: decoded.id, actif: true } });

    if (!admin) {
      return res.status(401).json({ success: false, message: 'Compte introuvable' });
    }

    req.admin = admin;
    next();

  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Session expirée. Reconnectez-vous.' });
    }
    return res.status(401).json({ success: false, message: 'Token invalide' });
  }
};

const autoriserRole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.admin.role)) {
      return res.status(403).json({
        success: false,
        message: `Accès refusé. Rôle requis : ${roles.join(' ou ')}`
      });
    }
    next();
  };
};

module.exports = { protegerRoute, autoriserRole };