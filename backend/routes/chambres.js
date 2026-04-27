/* routes/chambres.js – CRUD des chambres */
const express  = require('express');
const router   = express.Router();
const Chambre  = require('../models/Chambre');
const Hotel    = require('../models/Hotel');
const { protegerRoute, autoriserRole } = require('../middleware/auth');

/* GET /api/chambres?hotel_id=1&type=suite */
router.get('/', async (req, res) => {
  try {
    const { hotel_id, type, disponible } = req.query;
    const filtres = {};
    if (hotel_id)              filtres.hotel_id   = hotel_id;
    if (type)                  filtres.type       = type;
    if (disponible !== undefined) filtres.disponible = disponible === 'true';

    const chambres = await Chambre.findAll({
      where:   filtres,
      include: [{ model: Hotel, as: 'hotel', attributes: ['id', 'nom', 'province'] }],
      order:   [['prix', 'ASC']]
    });
    return res.json({ success: true, total: chambres.length, data: chambres });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
});

/* GET /api/chambres/:id */
router.get('/:id', async (req, res) => {
  try {
    const chambre = await Chambre.findByPk(req.params.id, {
      include: [{ model: Hotel, as: 'hotel' }]
    });
    if (!chambre) {
      return res.status(404).json({ success: false, message: 'Chambre introuvable' });
    }
    return res.json({ success: true, data: chambre });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
});

/* POST /api/chambres (admin) */
router.post('/', protegerRoute, autoriserRole('super_admin', 'admin'), async (req, res) => {
  try {
    const { hotel_id, type, nom, prix } = req.body;
    if (!hotel_id || !type || !nom || !prix) {
      return res.status(400).json({ success: false, message: 'hotel_id, type, nom et prix requis' });
    }
    const chambre = await Chambre.create(req.body);
    return res.status(201).json({ success: true, message: 'Chambre créée', data: chambre });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
});

/* PUT /api/chambres/:id (admin) */
router.put('/:id', protegerRoute, autoriserRole('super_admin', 'admin'), async (req, res) => {
  try {
    const chambre = await Chambre.findByPk(req.params.id);
    if (!chambre) {
      return res.status(404).json({ success: false, message: 'Chambre introuvable' });
    }
    await chambre.update(req.body);
    return res.json({ success: true, message: 'Chambre modifiée', data: chambre });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
});

/* DELETE /api/chambres/:id (super_admin) */
router.delete('/:id', protegerRoute, autoriserRole('super_admin'), async (req, res) => {
  try {
    const ok = await Chambre.destroy({ where: { id: req.params.id } });
    if (!ok) {
      return res.status(404).json({ success: false, message: 'Chambre introuvable' });
    }
    return res.json({ success: true, message: 'Chambre supprimée' });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
});

module.exports = router;