/* routes/clients.js – CRUD des clients */
const express     = require('express');
const router      = express.Router();
const { Op }      = require('sequelize');
const Client      = require('../models/Client');
const Reservation = require('../models/Reservation');
const { protegerRoute, autoriserRole } = require('../middleware/auth');

/* GET /api/clients (admin) */
router.get('/', protegerRoute, async (req, res) => {
  try {
    const { search, page = 1, limite = 20 } = req.query;
    const filtres = {};
    if (search) {
      filtres[Op.or] = [
        { prenom: { [Op.like]: `%${search}%` } },
        { nom:    { [Op.like]: `%${search}%` } },
        { email:  { [Op.like]: `%${search}%` } }
      ];
    }
    const offset = (parseInt(page) - 1) * parseInt(limite);
    const { count, rows } = await Client.findAndCountAll({
      where: filtres,
      order: [['created_at', 'DESC']],
      limit: parseInt(limite),
      offset
    });
    return res.json({ success: true, data: rows, total: count });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
});

/* GET /api/clients/:id avec ses réservations */
router.get('/:id', protegerRoute, async (req, res) => {
  try {
    const client = await Client.findByPk(req.params.id, {
      include: [{ model: Reservation, as: 'reservations' }]
    });
    if (!client) return res.status(404).json({ success: false, message: 'Client introuvable' });
    return res.json({ success: true, data: client });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
});

/* POST /api/clients (admin) */
router.post('/', protegerRoute, async (req, res) => {
  try {
    const { prenom, nom, email } = req.body;
    if (!prenom || !nom || !email) {
      return res.status(400).json({ success: false, message: 'prenom, nom et email requis' });
    }
    const client = await Client.create(req.body);
    return res.status(201).json({ success: true, message: 'Client créé', data: client });
  } catch (e) {
    if (e.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ success: false, message: 'Email déjà utilisé' });
    }
    return res.status(500).json({ success: false, message: e.message });
  }
});

/* PUT /api/clients/:id (admin) */
router.put('/:id', protegerRoute, async (req, res) => {
  try {
    const client = await Client.findByPk(req.params.id);
    if (!client) return res.status(404).json({ success: false, message: 'Client introuvable' });
    await client.update(req.body);
    return res.json({ success: true, message: 'Client modifié', data: client });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
});

/* DELETE /api/clients/:id (super_admin) */
router.delete('/:id', protegerRoute, autoriserRole('super_admin'), async (req, res) => {
  try {
    const ok = await Client.destroy({ where: { id: req.params.id } });
    if (!ok) return res.status(404).json({ success: false, message: 'Client introuvable' });
    return res.json({ success: true, message: 'Client supprimé' });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
});

module.exports = router;