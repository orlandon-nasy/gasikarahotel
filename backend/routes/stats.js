/* routes/stats.js – Statistiques pour le dashboard admin */
const express     = require('express');
const router      = express.Router();
const { Op }      = require('sequelize');
const sequelize   = require('../config/database');
const Reservation = require('../models/Reservation');
const Hotel       = require('../models/Hotel');
const Client      = require('../models/Client');
const { protegerRoute } = require('../middleware/auth');

/* GET /api/stats/kpi – Tous les indicateurs clés */
router.get('/kpi', protegerRoute, async (req, res) => {
  try {
    const [totalRes, enAttente, confirmees, annulees, totalClients] = await Promise.all([
      Reservation.count(),
      Reservation.count({ where: { statut: 'en_attente' } }),
      Reservation.count({ where: { statut: 'confirmee'  } }),
      Reservation.count({ where: { statut: 'annulee'    } }),
      Client.count()
    ]);
    const revenusTotaux = await Reservation.sum('prix_total', { where: { statut: 'confirmee' } }) || 0;
    const debutMois = new Date(); debutMois.setDate(1); debutMois.setHours(0,0,0,0);
    const revenusMois = await Reservation.sum('prix_total', {
      where: { statut: 'confirmee', createdAt: { [Op.gte]: debutMois } }
    }) || 0;
    return res.json({ success: true, data: { totalRes, enAttente, confirmees, annulees, totalClients, revenusTotaux, revenusMois } });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
});

/* GET /api/stats/par-mois?annee=2025 */
router.get('/par-mois', protegerRoute, async (req, res) => {
  try {
    const annee = req.query.annee || new Date().getFullYear();
    const [rows] = await sequelize.query(
      `SELECT MONTH(created_at) AS mois, COUNT(*) AS total
       FROM reservations WHERE YEAR(created_at) = :annee
       GROUP BY MONTH(created_at) ORDER BY mois`,
      { replacements: { annee } }
    );
    const donnees = Array(12).fill(0);
    rows.forEach(r => { donnees[r.mois - 1] = parseInt(r.total); });
    return res.json({ success: true, data: donnees });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
});

/* GET /api/stats/par-hotel */
router.get('/par-hotel', protegerRoute, async (req, res) => {
  try {
    const [rows] = await sequelize.query(
      `SELECT h.nom, h.province, COUNT(r.id) AS total
       FROM hotels h LEFT JOIN reservations r ON h.id = r.hotel_id
       GROUP BY h.id ORDER BY total DESC`
    );
    return res.json({ success: true, data: rows });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
});

/* GET /api/stats/recentes – 5 dernières réservations */
router.get('/recentes', protegerRoute, async (req, res) => {
  try {
    const data = await Reservation.findAll({
      include: [{ model: Hotel, as: 'hotel', attributes: ['nom', 'province'] }],
      order:   [['createdAt', 'DESC']],
      limit:   5
    });
    return res.json({ success: true, data });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
});

module.exports = router;