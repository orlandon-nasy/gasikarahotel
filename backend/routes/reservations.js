/* routes/reservations.js – CRUD + Email confirmation */
const express     = require('express');
const router      = express.Router();
const { Op }      = require('sequelize');
const nodemailer  = require('nodemailer');
const Reservation = require('../models/Reservation');
const Hotel       = require('../models/Hotel');
const Chambre     = require('../models/Chambre');
const { protegerRoute } = require('../middleware/auth');

/* Fonction envoi email */
async function envoyerEmail(reservation, nomHotel) {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) return false;
  try {
    const transport = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
    });
    const dateA = new Date(reservation.arrivee).toLocaleDateString('fr-MG');
    const dateD = new Date(reservation.depart).toLocaleDateString('fr-MG');
    await transport.sendMail({
      from:    `"GasikaraHotel 🌿" <${process.env.EMAIL_USER}>`,
      to:      reservation.email,
      subject: `✅ Réservation ${reservation.reference} – GasikaraHotel`,
      html: `
        <div style="font-family:sans-serif;max-width:580px;margin:auto">
          <div style="background:#2d6a4f;padding:2rem;text-align:center">
            <h1 style="color:#e9c46a;margin:0">🌿 GasikaraHotel</h1>
          </div>
          <div style="padding:2rem">
            <h2>Bonjour ${reservation.prenom} ${reservation.nom},</h2>
            <p>Votre réservation a bien été reçue !</p>
            <table style="width:100%;border-collapse:collapse">
              <tr style="background:#d8f3dc">
                <td style="padding:.7rem;font-weight:bold;color:#2d6a4f">Référence</td>
                <td style="padding:.7rem;font-weight:bold;color:#2d6a4f">${reservation.reference}</td>
              </tr>
              <tr><td style="padding:.7rem;font-weight:600">Hôtel</td><td style="padding:.7rem">${nomHotel}</td></tr>
              <tr style="background:#f9f9f9"><td style="padding:.7rem;font-weight:600">Arrivée</td><td style="padding:.7rem">${dateA}</td></tr>
              <tr><td style="padding:.7rem;font-weight:600">Départ</td><td style="padding:.7rem">${dateD}</td></tr>
              <tr style="background:#f9f9f9"><td style="padding:.7rem;font-weight:600">Durée</td><td style="padding:.7rem">${reservation.nb_nuits} nuit(s)</td></tr>
            </table>
            <p style="margin-top:1.5rem;color:#666">Notre équipe vous confirmera sous <strong>24h</strong>.</p>
            <p style="color:#666">📞 +261 37 45 471 61<br>✉️ gasikarahotel@gmail.com</p>
          </div>
          <div style="background:#0f1923;padding:1rem;text-align:center;color:rgba(255,255,255,.4);font-size:.75rem">
            © 2025 GasikaraHotel · Madagascar
          </div>
        </div>
      `
    });
    return true;
  } catch (err) {
    console.error('❌ Erreur email :', err.message);
    return false;
  }
}

/* ════════════════════════════════════════════════════
   EMAIL DE CONFIRMATION DÉFINITIVE
   Envoyé quand l'admin confirme la réservation
════════════════════════════════════════════════════ */
async function envoyerEmailConfirmationDefinitive(reservation) {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn('⚠️ Email non configuré');
    return false;
  }

  try {
    const transport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    /* Formate les dates en français */
    const dateA = new Date(reservation.arrivee).toLocaleDateString('fr-MG');
    const dateD = new Date(reservation.depart).toLocaleDateString('fr-MG');
    const nomHotel = reservation.hotel ? reservation.hotel.nom : 'GasikaraHotel';

    await transport.sendMail({
      from:    `"GasikaraHotel 🌿" <${process.env.EMAIL_USER}>`,
      to:      reservation.email,
      subject: `🎉 Réservation ${reservation.reference} CONFIRMÉE – GasikaraHotel`,
      html: `
        <div style="font-family:sans-serif;max-width:580px;margin:auto">

          <!-- En-tête vert -->
          <div style="background:#2d6a4f;padding:2rem;text-align:center">
            <h1 style="color:#e9c46a;margin:0;font-size:2rem">
              🌿 GasikaraHotel
            </h1>
            <p style="color:rgba(255,255,255,.75);margin:.3rem 0 0">
              Madagascar · 6 Provinces · Hôtels 5 étoiles
            </p>
          </div>

          <!-- Bandeau confirmation -->
          <div style="background:#d8f3dc;padding:1.2rem;text-align:center">
            <h2 style="color:#2d6a4f;margin:0;font-size:1.3rem">
              ✅ Votre réservation est officiellement confirmée !
            </h2>
          </div>

          <!-- Corps -->
          <div style="padding:2rem;background:#fff">
            <p style="color:#1a2332;font-size:1rem">
              Bonjour <strong>${reservation.prenom} ${reservation.nom}</strong>,
            </p>
            <p style="color:#6b7a8d;margin-bottom:1.5rem">
              Nous avons le plaisir de vous confirmer votre réservation.
              Notre équipe vous attend avec impatience !
            </p>

            <!-- Tableau récapitulatif -->
            <table style="width:100%;border-collapse:collapse;border-radius:8px;overflow:hidden">
              <tr style="background:#2d6a4f">
                <td colspan="2" style="padding:.8rem 1rem;color:#e9c46a;
                    font-weight:700;font-size:1rem;text-align:center">
                  📋 Référence : ${reservation.reference}
                </td>
              </tr>
              <tr>
                <td style="padding:.8rem 1rem;font-weight:600;
                    border-bottom:1px solid #f0f2f5;width:40%">
                  🏨 Hôtel
                </td>
                <td style="padding:.8rem 1rem;border-bottom:1px solid #f0f2f5">
                  ${nomHotel}
                </td>
              </tr>
              <tr style="background:#fafafa">
                <td style="padding:.8rem 1rem;font-weight:600;
                    border-bottom:1px solid #f0f2f5">
                  📅 Arrivée
                </td>
                <td style="padding:.8rem 1rem;border-bottom:1px solid #f0f2f5">
                  ${dateA}
                </td>
              </tr>
              <tr>
                <td style="padding:.8rem 1rem;font-weight:600;
                    border-bottom:1px solid #f0f2f5">
                  📅 Départ
                </td>
                <td style="padding:.8rem 1rem;border-bottom:1px solid #f0f2f5">
                  ${dateD}
                </td>
              </tr>
              <tr style="background:#fafafa">
                <td style="padding:.8rem 1rem;font-weight:600;
                    border-bottom:1px solid #f0f2f5">
                  🌙 Durée
                </td>
                <td style="padding:.8rem 1rem;border-bottom:1px solid #f0f2f5">
                  ${reservation.nb_nuits} nuit(s)
                </td>
              </tr>
              <tr>
                <td style="padding:.8rem 1rem;font-weight:600;
                    border-bottom:1px solid #f0f2f5">
                  👥 Voyageurs
                </td>
                <td style="padding:.8rem 1rem;border-bottom:1px solid #f0f2f5">
                  ${reservation.adultes} adulte(s) · ${reservation.enfants} enfant(s)
                </td>
              </tr>
              <tr style="background:#fafafa">
                <td style="padding:.8rem 1rem;font-weight:600">
                  💰 Prix total
                </td>
                <td style="padding:.8rem 1rem;color:#2d6a4f;font-weight:700">
                  ${reservation.prix_total
                    ? reservation.prix_total.toLocaleString('fr-MG') + ' Ar'
                    : 'Sur devis'}
                </td>
              </tr>
            </table>

            <!-- Message important -->
            <div style="margin-top:1.5rem;padding:1rem;
                        background:#fffbeb;border-left:4px solid #e9c46a;
                        border-radius:4px">
              <p style="margin:0;color:#92400e;font-size:.88rem">
                ⚡ <strong>Informations importantes :</strong><br>
                • Check-in à partir de <strong>14h00</strong><br>
                • Check-out avant <strong>12h00</strong><br>
                • Merci de présenter cette confirmation à votre arrivée
              </p>
            </div>

            <!-- Contact -->
            <p style="margin-top:1.5rem;color:#6b7a8d;font-size:.85rem">
              Des questions ? Contactez-nous :<br>
              📞 <a href="tel:${process.env.TEL || '+261374547161'}"
                   style="color:#2d6a4f">
                ${process.env.TEL || '+261 37 45 471 61'}
              </a><br>
              ✉️ <a href="mailto:${process.env.EMAIL_USER}"
                    style="color:#2d6a4f">
                ${process.env.EMAIL_USER}
              </a>
            </p>
          </div>

          <!-- Pied de page -->
          <div style="background:#0f1923;padding:1rem;text-align:center;
                      color:rgba(255,255,255,.4);font-size:.75rem">
            © 2026 GasikaraHotel · Madagascar · Tous droits réservés
          </div>

        </div>
      `
    });

    console.log(`✅ Email confirmation envoyé à ${reservation.email}`);
    return true;

  } catch (err) {
    console.error('❌ Erreur email confirmation :', err.message);
    return false;
  }
}

/* POST /api/reservations – Créer depuis le formulaire client */
router.post('/', async (req, res) => {
  try {
    const { prenom, nom, email, telephone, hotel_id, chambre_id,
            arrivee, depart, adultes = 2, enfants = 0, demandes = '' } = req.body;

    if (!prenom || !nom || !email || !hotel_id || !arrivee || !depart) {
      return res.status(400).json({
        success: false,
        message: 'Champs requis : prenom, nom, email, hotel_id, arrivee, depart'
      });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ success: false, message: 'Email invalide' });
    }

    const nbNuits = Math.ceil((new Date(depart) - new Date(arrivee)) / 86400000);
    if (nbNuits <= 0) {
      return res.status(400).json({ success: false, message: 'Date de départ invalide' });
    }

    const hotel = await Hotel.findByPk(hotel_id);
    if (!hotel) {
      return res.status(404).json({ success: false, message: 'Hôtel introuvable' });
    }

    let prixTotal = hotel.prix_depuis * nbNuits;
    if (chambre_id) {
      const chambre = await Chambre.findByPk(chambre_id);
      if (chambre) prixTotal = chambre.prix * nbNuits;
    }

    const reference   = 'GK-' + Date.now().toString(36).toUpperCase().slice(-5);
    const reservation = await Reservation.create({
      reference, prenom, nom, email, telephone,
      hotel_id, chambre_id: chambre_id || null,
      arrivee, depart, nb_nuits: nbNuits,
      adultes, enfants, prix_total: prixTotal, demandes
    });

    const emailOK = await envoyerEmail(reservation, hotel.nom);
    if (emailOK) await reservation.update({ email_envoye: true });

    return res.status(201).json({
      success:   true,
      message:   'Réservation créée avec succès !',
      reference,
      data:      reservation
    });

  } catch (e) {
    console.error('Erreur réservation :', e);
    return res.status(500).json({ success: false, message: e.message });
  }
});

/* GET /api/reservations – Toutes (admin) avec filtres */
router.get('/', protegerRoute, async (req, res) => {
  try {
    const { statut, hotel_id, page = 1, limite = 20, search } = req.query;
    const filtres = {};
    if (statut)   filtres.statut   = statut;
    if (hotel_id) filtres.hotel_id = hotel_id;
    if (search) {
      filtres[Op.or] = [
        { prenom:    { [Op.like]: `%${search}%` } },
        { nom:       { [Op.like]: `%${search}%` } },
        { email:     { [Op.like]: `%${search}%` } },
        { reference: { [Op.like]: `%${search}%` } }
      ];
    }
    const offset = (parseInt(page) - 1) * parseInt(limite);
    const { count, rows } = await Reservation.findAndCountAll({
      where:   filtres,
      include: [
        { model: Hotel,   as: 'hotel',   attributes: ['id', 'nom', 'province'] },
        { model: Chambre, as: 'chambre', attributes: ['id', 'nom', 'type'], required: false }
      ],
      order:  [['createdAt', 'DESC']],
      limit:  parseInt(limite),
      offset
    });
    return res.json({
      success: true, data: rows,
      pagination: { total: count, page: parseInt(page), totalPages: Math.ceil(count / parseInt(limite)) }
    });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
});

/* GET /api/reservations/:reference */
router.get('/:reference', async (req, res) => {
  try {
    const r = await Reservation.findOne({
      where:   { reference: req.params.reference },
      include: [
        { model: Hotel,   as: 'hotel' },
        { model: Chambre, as: 'chambre', required: false }
      ]
    });
    if (!r) return res.status(404).json({ success: false, message: 'Réservation introuvable' });
    return res.json({ success: true, data: r });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
});

/* PUT /api/reservations/:reference/confirmer (admin) */
router.put('/:reference/confirmer', protegerRoute, async (req, res) => {
  try {
    /* Cherche la réservation avec les infos de l'hôtel */
    const r = await Reservation.findOne({
      where:   { reference: req.params.reference },
      include: [{ model: Hotel, as: 'hotel' }]
    });

    if (!r) {
      return res.status(404).json({
        success: false,
        message: 'Réservation introuvable'
      });
    }

    /* Vérifie que la réservation n'est pas déjà confirmée */
    if (r.statut === 'confirmee') {
      return res.status(400).json({
        success: false,
        message: 'Réservation déjà confirmée'
      });
    }

    /* Met à jour le statut en base MySQL */
    await r.update({ statut: 'confirmee' });

    /* Envoie l'email de confirmation au client */
    await envoyerEmailConfirmationDefinitive(r);

    return res.json({
      success: true,
      message: `Réservation ${r.reference} confirmée ✓`
    });

  } catch (e) {
    console.error('Erreur confirmation :', e);
    return res.status(500).json({ success: false, message: e.message });
  }
});

/* PUT /api/reservations/:reference/annuler */
router.put('/:reference/annuler', async (req, res) => {
  try {
    const r = await Reservation.findOne({ where: { reference: req.params.reference } });
    if (!r) return res.status(404).json({ success: false, message: 'Introuvable' });
    if (r.statut === 'annulee') return res.status(400).json({ success: false, message: 'Déjà annulée' });
    await r.update({ statut: 'annulee' });
    return res.json({ success: true, message: `Réservation ${r.reference} annulée` });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
});

/* PUT /api/reservations/:reference (admin) */
router.put('/:reference', protegerRoute, async (req, res) => {
  try {
    const r = await Reservation.findOne({ where: { reference: req.params.reference } });
    if (!r) return res.status(404).json({ success: false, message: 'Introuvable' });
    await r.update(req.body);
    return res.json({ success: true, message: 'Réservation modifiée', data: r });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
});

/* DELETE /api/reservations/:reference (admin) */
router.delete('/:reference', protegerRoute, async (req, res) => {
  try {
    const ok = await Reservation.destroy({ where: { reference: req.params.reference } });
    if (!ok) return res.status(404).json({ success: false, message: 'Introuvable' });
    return res.json({ success: true, message: 'Réservation supprimée' });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
});

module.exports = router;