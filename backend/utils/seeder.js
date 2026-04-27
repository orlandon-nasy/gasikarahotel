/* ═══════════════════════════════════════════════════════════════════
   utils/seeder.js
   
   RÔLE : Peuple la base de données MySQL avec les données initiales.
   
   CE QUE ÇA FAIT :
   1. Supprime et recrée toutes les tables
   2. Crée le compte admin par défaut
   3. Crée les 6 hôtels (une par province de Madagascar)
   4. Crée les chambres pour chaque hôtel
   
   COMMANDE : npm run seed
   ⚠️  À exécuter UNE SEULE FOIS au démarrage du projet
   ⚠️  force:true SUPPRIME toutes les données existantes !
═══════════════════════════════════════════════════════════════════ */

/* Charge les variables d'environnement depuis .env */
require('dotenv').config();

/* Import de bcrypt pour hasher le mot de passe admin */
const bcrypt    = require('bcryptjs');

/* Import de la connexion MySQL */
const sequelize = require('../config/database');

/* Import des associations (OBLIGATOIRE avant les modèles) */
require('../models/associations');

/* Import des modèles */
const Admin   = require('../models/Admin');
const Hotel   = require('../models/Hotel');
const Chambre = require('../models/Chambre');

/* ═══════════════════════════════════════════════════════════════════
   Fonction principale du seeder
═══════════════════════════════════════════════════════════════════ */
async function seeder() {
  try {
    console.log('\n🌱 Démarrage du seeder GasikaraHotel...\n');

    /* ── Étape 1 : Recrée toutes les tables ──────────────────────────
       force: true = SUPPRIME les tables existantes et les recrée
       Séquence automatique grâce aux associations définies
    */
    await sequelize.sync({ force: true });
    console.log('✅ Tables MySQL recréées');

    /* ── Étape 2 : Crée le compte administrateur ─────────────────────
       Le mot de passe est hashé avec bcrypt avant stockage.
       12 = nombre de rounds (plus c'est élevé, plus c'est sécurisé)
       Connexion : admin@gasikarahotel.mg / Admin2025!
    */
    const motDePasseHash = await bcrypt.hash('Hotel2026#', 12);

    await Admin.create({
      prenom:       'Orlandon',
      nom:          'NASY',
      email:        'nasyorlandon@gmail.com',
      mot_de_passe: motDePasseHash,
      role:         'super_admin',
      actif:        true
    });
    console.log('✅ Admin créé :');
    console.log('   📧 Email    : nasyorlandon@gmail.com');
    console.log('   🔑 Mot de passe : Hotel2026#\n');

    /* ── Étape 3 : Crée les 6 hôtels ────────────────────────────────
       Un hôtel par province de Madagascar.
       bulkCreate = insère plusieurs lignes en une seule requête SQL.
    */
    const hotels = await Hotel.bulkCreate([
      {
        code:        'antananarivo',
        nom:         'GasikaraHotel Tana',
        province:    'Antananarivo',
        description: 'Au cœur des Hautes Terres centrales, vue panoramique sur la ville des mille collines.',
        image_url:   'img/tana.jpg',
        adresse:     'Avenue de l\'Indépendance, Antananarivo 101',
        telephone:   '+261 20 22 000 01',
        email:       'tana@gasikarahotel.mg',
        prix_depuis: 250000,
        nb_chambres: 45,
        actif:       true
      },
      {
        code:        'toamasina',
        nom:         'GasikaraHotel Tamatave',
        province:    'Toamasina',
        description: 'Face à l\'Océan Indien, entouré de palmiers et de plages de sable blanc.',
        image_url:   'img/toamasina.jpg',
        adresse:     'Boulevard Ratsimilaho, Toamasina 501',
        telephone:   '+261 20 53 000 02',
        email:       'tamatave@gasikarahotel.mg',
        prix_depuis: 280000,
        nb_chambres: 38,
        actif:       true
      },
      {
        code:        'mahajanga',
        nom:         'GasikaraHotel Majunga',
        province:    'Mahajanga',
        description: 'Sur la côte ouest baignée par le Canal de Mozambique.',
        image_url:   'img/mojanga.jpg',
        adresse:     'Avenue du Canal, Mahajanga 401',
        telephone:   '+261 20 62 000 03',
        email:       'majunga@gasikarahotel.mg',
        prix_depuis: 240000,
        nb_chambres: 32,
        actif:       true
      },
      {
        code:        'fianarantsoa',
        nom:         'GasikaraHotel Fianar',
        province:    'Fianarantsoa',
        description: 'Niché dans les vignobles du sud des Hautes Terres.',
        image_url:   'img/fianara.jpg',
        adresse:     'Rue des Vignes, Fianarantsoa 301',
        telephone:   '+261 20 75 000 04',
        email:       'fianar@gasikarahotel.mg',
        prix_depuis: 220000,
        nb_chambres: 28,
        actif:       true
      },
      {
        code:        'toliara',
        nom:         'GasikaraHotel Tuléar',
        province:    'Toliara',
        description: 'Au bord du lagon et du récif corallien de Toliara.',
        image_url:   'img/tulear.jpg',
        adresse:     'Boulevard du Lagon, Toliara 601',
        telephone:   '+261 20 94 000 05',
        email:       'tulear@gasikarahotel.mg',
        prix_depuis: 260000,
        nb_chambres: 35,
        actif:       true
      },
      {
        code:        'antsiranana',
        nom:         'GasikaraHotel Diego',
        province:    'Antsiranana',
        description: 'À la Baie des Sakalava, l\'une des plus belles baies du monde.',
        image_url:   'img/diego.jpg',
        adresse:     'Rue de la Baie, Antsiranana 201',
        telephone:   '+261 20 82 000 06',
        email:       'diego@gasikarahotel.mg',
        prix_depuis: 290000,
        nb_chambres: 30,
        actif:       true
      }
    ]);

    console.log(`✅ ${hotels.length} hôtels créés :`);
    hotels.forEach(h => console.log(`   🏨 ${h.nom} (${h.province})`));
    console.log('');

    /* ── Étape 4 : Crée les chambres pour chaque hôtel ───────────────
       6 types de chambres × 6 hôtels = 36 chambres au total.
       On boucle sur chaque hôtel et on insère ses chambres.
    */
    const toutesLesChambres = [];

    for (const hotel of hotels) {
      toutesLesChambres.push(
        /* Chambre 1 : Standard basique */
        {
          hotel_id:    hotel.id,
          type:        'standard',
          nom:         'Chambre Classique',
          description: 'Chambre élégante avec vue sur les jardins, literie premium.',
          prix:        180000,
          superficie:  28,
          capacite:    2,
          disponible:  true
        },
        /* Chambre 2 : Standard vue */
        {
          hotel_id:    hotel.id,
          type:        'standard',
          nom:         'Chambre Vue Ville',
          description: 'Vue panoramique sur la ville, balcon privé.',
          prix:        200000,
          superficie:  30,
          capacite:    2,
          disponible:  true
        },
        /* Chambre 3 : Supérieure */
        {
          hotel_id:    hotel.id,
          type:        'superieure',
          nom:         'Chambre Baobab',
          description: 'Terrasse privée, décoration inspirée du baobab malgache.',
          prix:        320000,
          superficie:  42,
          capacite:    2,
          disponible:  true
        },
        /* Chambre 4 : Supérieure deluxe */
        {
          hotel_id:    hotel.id,
          type:        'superieure',
          nom:         'Chambre Deluxe',
          description: 'Baignoire îlot, produits de luxe, lit king size.',
          prix:        380000,
          superficie:  48,
          capacite:    3,
          disponible:  true
        },
        /* Chambre 5 : Suite */
        {
          hotel_id:    hotel.id,
          type:        'suite',
          nom:         'Suite Vanille',
          description: 'Salon séparé, jacuzzi panoramique, butler dédié.',
          prix:        750000,
          superficie:  75,
          capacite:    3,
          disponible:  true
        },
        /* Chambre 6 : Présidentielle */
        {
          hotel_id:    hotel.id,
          type:        'presidentielle',
          nom:         'Suite Présidentielle',
          description: 'Piscine privée, chef cuisinier, voiture avec chauffeur.',
          prix:        1500000,
          superficie:  150,
          capacite:    4,
          disponible:  true
        }
      );
    }

    /* Insère toutes les chambres en une seule requête */
    await Chambre.bulkCreate(toutesLesChambres);
    console.log(`✅ ${toutesLesChambres.length} chambres créées (6 par hôtel)\n`);

    /* ── Message de fin ──────────────────────────────────────────────── */
    console.log('╔══════════════════════════════════════════╗');
    console.log('║  🎉 Base de données prête !               ║');
    console.log('║                                          ║');
    console.log('║  Prochaine étape :                       ║');
    console.log('║  → npm run dev                           ║');
    console.log('╚══════════════════════════════════════════╝\n');

    /* Ferme la connexion MySQL proprement */
    process.exit(0);

  } catch (erreur) {
    /* Affiche l'erreur complète pour le débogage */
    console.error('\n❌ Erreur dans le seeder :');
    console.error('→ Message :', erreur.message);
    console.error('→ Détail  :', erreur);
    console.error('\n📌 Vérifications :');
    console.error('   1. MySQL est-il lancé ?');
    console.error('   2. Les infos dans .env sont-elles correctes ?');
    console.error('   3. La base "gasikarahotel" existe-t-elle dans MySQL Workbench ?');
    process.exit(1);
  }
}

/* Lance le seeder */
seeder();