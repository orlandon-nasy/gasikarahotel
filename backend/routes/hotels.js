/* routes/hotels.js – CRUD des 6 hôtels */
const express  = require('express');
const router   = express.Router();
const Hotel    = require('../models/Hotel');
const Chambre  = require('../models/Chambre');
const { protegerRoute, autoriserRole } = require('../middleware/auth');

/* GET /api/hotels – Liste tous les hôtels (PUBLIC) */
router.get('/', async (req, res) => {
  try {
    const hotels = await Hotel.findAll({
      where:   { actif: true },
      include: [{
        model:    Chambre,
        as:       'chambres',
        where:    { disponible: true },
        required: false
      }],
      order: [['id', 'ASC']]
    });
    return res.json({ success: true, total: hotels.length, data: hotels });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
});

/* GET /api/hotels/:id – Un hôtel avec ses chambres (PUBLIC) */
router.get('/:id', async (req, res) => {
  try {
    const hotel = await Hotel.findByPk(req.params.id, {
      include: [{ model: Chambre, as: 'chambres', required: false }]
    });
    if (!hotel) {
      return res.status(404).json({ success: false, message: 'Hôtel introuvable' });
    }
    return res.json({ success: true, data: hotel });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
});

/* POST /api/hotels – Créer un hôtel (admin) */
router.post('/', protegerRoute, autoriserRole('super_admin', 'admin'), async (req, res) => {
  try {
    const { code, nom, province } = req.body;
    if (!code || !nom || !province) {
      return res.status(400).json({ success: false, message: 'code, nom et province requis' });
    }
    const hotel = await Hotel.create(req.body);
    return res.status(201).json({ success: true, message: 'Hôtel créé', data: hotel });
  } catch (e) {
    if (e.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ success: false, message: 'Ce code hôtel existe déjà' });
    }
    return res.status(500).json({ success: false, message: e.message });
  }
});

/* PUT /api/hotels/:id – Modifier un hôtel (admin) */
router.put('/:id', protegerRoute, autoriserRole('super_admin', 'admin'), async (req, res) => {
  try {
    const hotel = await Hotel.findByPk(req.params.id);
    if (!hotel) {
      return res.status(404).json({ success: false, message: 'Hôtel introuvable' });
    }
    await hotel.update(req.body);
    return res.json({ success: true, message: 'Hôtel modifié', data: hotel });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
});

/* DELETE /api/hotels/:id – Désactiver (super_admin) */
router.delete('/:id', protegerRoute, autoriserRole('super_admin'), async (req, res) => {
  try {
    const hotel = await Hotel.findByPk(req.params.id);
    if (!hotel) {
      return res.status(404).json({ success: false, message: 'Hôtel introuvable' });
    }
    await hotel.update({ actif: false });
    return res.json({ success: true, message: 'Hôtel désactivé' });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
});

module.exports = router;