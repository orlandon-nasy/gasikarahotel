/* routes/auth.js – Login, Register, Profil */
const express = require('express');
const router  = express.Router();
const bcrypt  = require('bcryptjs');
const jwt     = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const Admin   = require('../models/Admin');
const { protegerRoute, autoriserRole } = require('../middleware/auth');

/* Fonction qui génère un token JWT */
const genererToken = (admin) => {
  return jwt.sign(
    { id: admin.id, email: admin.email, role: admin.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '8h' }
  );
};

/* ─── POST /api/auth/login ───────────────────────────────────────── */
router.post('/login',
  [
    body('email').isEmail().withMessage('Email invalide').normalizeEmail(),
    body('mot_de_passe').notEmpty().withMessage('Mot de passe requis')
  ],
  async (req, res) => {
    try {
      const erreurs = validationResult(req);
      if (!erreurs.isEmpty()) {
        return res.status(400).json({ success: false, message: erreurs.array()[0].msg });
      }

      const { email, mot_de_passe } = req.body;

      /* Cherche l'admin avec son mot de passe */
      const admin = await Admin.scope('avecMotDePasse').findOne({
        where: { email, actif: true }
      });

      if (!admin) {
        return res.status(401).json({ success: false, message: 'Email ou mot de passe incorrect' });
      }

      /* Compare le mot de passe avec le hash bcrypt */
      const mdpCorrect = await bcrypt.compare(mot_de_passe, admin.mot_de_passe);
      if (!mdpCorrect) {
        return res.status(401).json({ success: false, message: 'Email ou mot de passe incorrect' });
      }

      /* Génère le token JWT */
      const token = genererToken(admin);

      /* Enregistre la date de connexion */
      await admin.update({ dernier_login: new Date() });

      return res.json({
        success: true,
        message: 'Connexion réussie !',
        token,
        admin: {
          id:     admin.id,
          prenom: admin.prenom,
          nom:    admin.nom,
          email:  admin.email,
          role:   admin.role
        }
      });

    } catch (erreur) {
      console.error('Erreur login :', erreur);
      return res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
  }
);

/* ─── POST /api/auth/register ────────────────────────────────────── */
router.post('/register',
  protegerRoute,
  autoriserRole('super_admin'),
  [
    body('prenom').notEmpty().withMessage('Prénom requis'),
    body('nom').notEmpty().withMessage('Nom requis'),
    body('email').isEmail().withMessage('Email invalide').normalizeEmail(),
    body('mot_de_passe').isLength({ min: 8 }).withMessage('Minimum 8 caractères')
  ],
  async (req, res) => {
    try {
      const erreurs = validationResult(req);
      if (!erreurs.isEmpty()) {
        return res.status(400).json({ success: false, message: erreurs.array()[0].msg });
      }

      const { prenom, nom, email, mot_de_passe, role = 'admin' } = req.body;

      /* Vérifie que l'email n'existe pas déjà */
      const existe = await Admin.findOne({ where: { email } });
      if (existe) {
        return res.status(400).json({ success: false, message: 'Email déjà utilisé' });
      }

      /* Hash le mot de passe */
      const hash  = await bcrypt.hash(mot_de_passe, 12);
      const admin = await Admin.create({ prenom, nom, email, mot_de_passe: hash, role });

      return res.status(201).json({
        success: true,
        message: `Admin ${prenom} ${nom} créé`,
        admin:   { id: admin.id, email: admin.email, role: admin.role }
      });

    } catch (erreur) {
      return res.status(500).json({ success: false, message: erreur.message });
    }
  }
);

/* ─── GET /api/auth/profil ───────────────────────────────────────── */
router.get('/profil', protegerRoute, (req, res) => {
  return res.json({ success: true, admin: req.admin });
});

/* ─── PUT /api/auth/changer-mdp ─────────────────────────────────── */
router.put('/changer-mdp', protegerRoute, async (req, res) => {
  try {
    const { ancien_mdp, nouveau_mdp } = req.body;

    if (!ancien_mdp || !nouveau_mdp) {
      return res.status(400).json({ success: false, message: 'ancien_mdp et nouveau_mdp requis' });
    }

    const admin  = await Admin.scope('avecMotDePasse').findByPk(req.admin.id);
    const valide = await bcrypt.compare(ancien_mdp, admin.mot_de_passe);

    if (!valide) {
      return res.status(400).json({ success: false, message: 'Ancien mot de passe incorrect' });
    }

    const hash = await bcrypt.hash(nouveau_mdp, 12);
    await admin.update({ mot_de_passe: hash });

    return res.json({ success: true, message: 'Mot de passe modifié avec succès' });

  } catch (erreur) {
    return res.status(500).json({ success: false, message: erreur.message });
  }
});

/* ─── POST /api/auth/logout ──────────────────────────────────────── */
router.post('/logout', protegerRoute, (req, res) => {
  return res.json({ success: true, message: 'Déconnecté. Supprimez le token côté client.' });
});

module.exports = router;