/* ═══════════════════════════════════════════════════════════════════════
   GASIKARAHOTEL – DASHBOARD ADMIN (admin.js)
   Description : Toute la logique du panneau d'administration
                 Authentification, CRUD, graphiques, notifications

   TABLE DES MATIÈRES :
   1.  Configuration & données de démonstration
   2.  Authentification (login / logout)
   3.  Navigation entre sections
   4.  Horloge en temps réel
   5.  Chargement des données (KPI, tableaux)
   6.  Graphiques Chart.js
   7.  Gestion des réservations (CRUD)
   8.  Gestion des hôtels
   9.  Gestion des chambres
   10. Gestion des clients
   11. Notifications
   12. Modals (ouverture, fermeture, sauvegarde)
   13. Recherche globale
   14. Toast notifications admin
   15. Utilitaires
   16. Initialisation
═══════════════════════════════════════════════════════════════════════ */


/* ═══════════════════════════════════════════════════════════════════════
   1. CONFIGURATION & DONNÉES DE DÉMONSTRATION
   En production, ces données viendraient de l'API MySQL/Node.js
═══════════════════════════════════════════════════════════════════════ */
/* ══════════════════════════════════════════════════
   URL DE L'API BACKEND
══════════════════════════════════════════════════ */
const API_URL = (window.location.hostname === 'localhost' || 
                window.location.hostname === '127.0.0.1')
  ? 'http://localhost:5000'
  : 'https://gasikarahotel.onrender.com';

/* Récupère le token JWT depuis localStorage */
function getToken() {
  const session = JSON.parse(localStorage.getItem('gasikara_admin') || '{}');
  return session.token || '';
}

/* Headers avec token pour les requêtes admin */
function getHeaders() {
  return {
    'Content-Type':  'application/json',
    'Authorization': `Bearer ${getToken()}`
  };
}
/* Credentials admin (en production : vérification côté serveur via JWT) */

/* URL de base de l'API backend (à modifier selon ton serveur) */
const API_BASE = 'https://gasikarahotel.onrender.com/api';

/* ── Données de démonstration : 6 hôtels ─────────────────────────── */
const HOTELS_DATA = [
  {
    id: 1, code: 'antananarivo',
    nom: 'GasikaraHotel Tana',
    province: 'Antananarivo',
    image: '../img/tana.jpg',
    chambres: 45, reservations: 128, prix: 250000, occupation: 87
  },
  {
    id: 2, code: 'toamasina',
    nom: 'GasikaraHotel Tamatave',
    province: 'Toamasina',
    image: '../img/toamasina.jpg',
    chambres: 38, reservations: 94, prix: 280000, occupation: 79
  },
  {
    id: 3, code: 'mahajanga',
    nom: 'GasikaraHotel Majunga',
    province: 'Mahajanga',
    image: '../img/mojanga.jpg',
    chambres: 32, reservations: 76, prix: 240000, occupation: 72
  },
  {
    id: 4, code: 'fianarantsoa',
    nom: 'GasikaraHotel Fianara',
    province: 'Fianarantsoa',
    image: '../img/fianara.jpg',
    chambres: 28, reservations: 61, prix: 220000, occupation: 65
  },
  {
    id: 5, code: 'toliara',
    nom: 'GasikaraHotel Tuléar',
    province: 'Toliara',
    image: '../img/tulear.jpg',
    chambres: 35, reservations: 89, prix: 260000, occupation: 83
  },
  {
    id: 6, code: 'antsiranana',
    nom: 'GasikaraHotel Diego',
    province: 'Antsiranana',
    image: '../img/diego.jpg',
    chambres: 30, reservations: 72, prix: 290000, occupation: 76
  }
];

/* ── Données de démonstration : réservations ─────────────────────── */
let RESERVATIONS_DATA = [
  { id:1, reference:'GK-A1B2C', prenom:'Jean', nom:'Rakoto', email:'jean@exemple.mg', tel:'+261 34 00 0001', hotel_id:1, hotel:'Tana', chambre:'Suite Vanille', arrivee:'2025-08-01', depart:'2025-08-05', adultes:2, enfants:0, statut:'confirmee', nb_nuits:4, prix_total:3000000, created:'2025-07-20' },
  { id:2, reference:'GK-D3E4F', prenom:'Marie', nom:'Rabe', email:'marie@exemple.mg', tel:'+261 34 00 0002', hotel_id:2, hotel:'Tamatave', chambre:'Chambre Baobab', arrivee:'2025-08-10', depart:'2025-08-14', adultes:2, enfants:1, statut:'en_attente', nb_nuits:4, prix_total:1280000, created:'2025-07-21' },
  { id:3, reference:'GK-G5H6I', prenom:'Paul', nom:'Andria', email:'paul@exemple.mg', tel:'+261 34 00 0003', hotel_id:3, hotel:'Majunga', chambre:'Chambre Classique', arrivee:'2025-08-15', depart:'2025-08-17', adultes:1, enfants:0, statut:'confirmee', nb_nuits:2, prix_total:360000, created:'2025-07-22' },
  { id:4, reference:'GK-J7K8L', prenom:'Sophie', nom:'Rasolofo', email:'sophie@exemple.mg', tel:'+261 34 00 0004', hotel_id:4, hotel:'Fianar', chambre:'Suite Présidentielle', arrivee:'2025-09-01', depart:'2025-09-07', adultes:2, enfants:2, statut:'en_attente', nb_nuits:6, prix_total:9000000, created:'2025-07-23' },
  { id:5, reference:'GK-M9N0O', prenom:'Luc', nom:'Razaka', email:'luc@exemple.mg', tel:'+261 34 00 0005', hotel_id:5, hotel:'Tuléar', chambre:'Chambre Baobab', arrivee:'2025-08-20', depart:'2025-08-22', adultes:2, enfants:0, statut:'annulee', nb_nuits:2, prix_total:640000, created:'2025-07-19' },
  { id:6, reference:'GK-P1Q2R', prenom:'Hanta', nom:'Ratsimba', email:'hanta@exemple.mg', tel:'+261 34 00 0006', hotel_id:6, hotel:'Diego', chambre:'Suite Vanille', arrivee:'2025-08-25', depart:'2025-08-30', adultes:2, enfants:0, statut:'confirmee', nb_nuits:5, prix_total:3750000, created:'2025-07-24' },
  { id:7, reference:'GK-S3T4U', prenom:'Fara', nom:'Rajaonarison', email:'fara@exemple.mg', tel:'+261 34 00 0007', hotel_id:1, hotel:'Tana', chambre:'Chambre Classique', arrivee:'2025-09-10', depart:'2025-09-12', adultes:1, enfants:0, statut:'en_attente', nb_nuits:2, prix_total:360000, created:'2025-07-25' },
  { id:8, reference:'GK-V5W6X', prenom:'Tiana', nom:'Rakotondrabe', email:'tiana@exemple.mg', tel:'+261 34 00 0008', hotel_id:2, hotel:'Tamatave', chambre:'Suite Vanille', arrivee:'2025-09-15', depart:'2025-09-20', adultes:2, enfants:1, statut:'confirmee', nb_nuits:5, prix_total:3750000, created:'2025-07-26' }
];

/* ── Données de démonstration : chambres ─────────────────────────── */
let CHAMBRES_DATA = [
  { id:1, hotel_id:1, hotel:'Tana',     nom:'Chambre Classique',    type:'standard',       prix:180000, superficie:28, capacite:2, disponible:true },
  { id:2, hotel_id:1, hotel:'Tana',     nom:'Chambre Baobab',       type:'superieure',     prix:320000, superficie:42, capacite:2, disponible:true },
  { id:3, hotel_id:1, hotel:'Tana',     nom:'Suite Vanille',        type:'suite',          prix:750000, superficie:75, capacite:3, disponible:false },
  { id:4, hotel_id:1, hotel:'Tana',     nom:'Suite Présidentielle', type:'presidentielle', prix:1500000,superficie:150,capacite:4, disponible:true },
  { id:5, hotel_id:2, hotel:'Tamatave', nom:'Chambre Classique',    type:'standard',       prix:200000, superficie:30, capacite:2, disponible:true },
  { id:6, hotel_id:2, hotel:'Tamatave', nom:'Suite Océan',          type:'suite',          prix:820000, superficie:80, capacite:3, disponible:true },
];

/* ── Données de démonstration : clients ──────────────────────────── */
let CLIENTS_DATA = [
  { id:1, prenom:'Jean',   nom:'Rakoto',        email:'jean@exemple.mg',   tel:'+261 34 00 0001', nb_res:3, created:'2024-12-01' },
  { id:2, prenom:'Marie',  nom:'Rabe',          email:'marie@exemple.mg',  tel:'+261 34 00 0002', nb_res:1, created:'2025-01-15' },
  { id:3, prenom:'Paul',   nom:'Andria',        email:'paul@exemple.mg',   tel:'+261 34 00 0003', nb_res:2, created:'2025-02-20' },
  { id:4, prenom:'Sophie', nom:'Rasolofo',      email:'sophie@exemple.mg', tel:'+261 34 00 0004', nb_res:1, created:'2025-03-10' },
  { id:5, prenom:'Hanta',  nom:'Ratsimba',      email:'hanta@exemple.mg',  tel:'+261 34 00 0006', nb_res:4, created:'2025-04-05' },
  { id:6, prenom:'Tiana',  nom:'Rakotondrabe',  email:'tiana@exemple.mg',  tel:'+261 34 00 0008', nb_res:2, created:'2025-05-12' },
];

/* Variable pour tracker l'ID en cours de modification */
let idEnCoursModif = null;

/* Filtre de statut actif dans la section réservations */
let filtreStatutActif = 'tous';


/* ═══════════════════════════════════════════════════════════════════════
   2. AUTHENTIFICATION
═══════════════════════════════════════════════════════════════════════ */

/**
 * connecterAdmin(event)
 * Vérifie les identifiants et connecte l'administrateur.
 * En production : appel à /api/auth/login qui retourne un JWT.
 */
async function connecterAdmin(event) {
  event.preventDefault();

  const email = document.getElementById('admin-email').value.trim();
  const mdp   = document.getElementById('admin-mdp').value;
  const erreur  = document.getElementById('login-erreur');
  const spinner = document.getElementById('login-spinner');

  erreur.classList.remove('visible');
  spinner.classList.add('visible');
  document.getElementById('btn-login').disabled = true;

  try {
    /* ── Appel à l'API backend au lieu de vérifier localement ── */
    const response = await fetch('https://gasikarahotel.onrender.com/api/auth/login', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({
        email,
        mot_de_passe: mdp    /* ← nom du champ que le backend attend */
      })
    });

    const data = await response.json();

    if (data.success) {
      /* ── Connexion réussie ─────────────────────────────────── */

      /* Sauvegarde la session avec le vrai token JWT */
      const session = {
        email:      data.admin.email,
        nom:        data.admin.prenom + ' ' + data.admin.nom,
        token:      data.token,
        expiration: Date.now() + 8 * 60 * 60 * 1000
      };
      localStorage.setItem('gasikara_admin', JSON.stringify(session));

      /* Met à jour le profil affiché */
      document.getElementById('profil-nom').textContent    = data.admin.prenom;
      document.getElementById('bienvenue-prenom').textContent = data.admin.prenom;

      /* Masque le login, affiche le dashboard */
      document.getElementById('login-page').classList.add('masquee');
      setTimeout(() => {
        document.getElementById('dashboard').classList.add('visible');
        initialiserDashboard();
      }, 300);

    } else {
      /* ── Identifiants incorrects ───────────────────────────── */
      spinner.classList.remove('visible');
      document.getElementById('btn-login').disabled = false;
      document.getElementById('login-erreur-msg').textContent = data.message;
      erreur.classList.add('visible');
    }

  } catch (erreurReseau) {
    /* ── Erreur réseau (serveur éteint) ────────────────────── */
    spinner.classList.remove('visible');
    document.getElementById('btn-login').disabled = false;
    document.getElementById('login-erreur-msg').textContent =
      'Impossible de contacter le serveur. Vérifiez que le backend tourne.';
    erreur.classList.add('visible');
  

    /* Animation de secousse sur le formulaire */
    const boite = document.querySelector('.login-boite');
    boite.style.animation = 'secouer 0.5s ease';
    setTimeout(() => { boite.style.animation = ''; }, 500);
  }
}

/**
 * verifierSession()
 * Vérifie si une session admin valide existe dans localStorage.
 * Si oui, connecte directement sans login.
 */
function verifierSession() {
  try {
    const session = JSON.parse(localStorage.getItem('gasikara_admin') || '{}');

    /* Vérifie que la session n'est pas expirée */
    if (session.token && session.expiration && Date.now() < session.expiration) {
      /* Session valide : affiche directement le dashboard */
      document.getElementById('login-page').classList.add('masquee');
      document.getElementById('dashboard').classList.add('visible');
      document.getElementById('profil-nom').textContent = session.nom || 'Admin';
      document.getElementById('bienvenue-prenom').textContent = session.nom || 'Admin';
      initialiserDashboard();
      return true;
    }
  } catch (e) { /* Ignore les erreurs de parsing */ }

  return false; /* Pas de session valide, affiche le login */
}

/**
 * deconnecter()
 * Supprime la session et retourne à la page de login.
 */
function deconnecter() {
  if (!confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) return;

  /* Supprime la session du localStorage */
  localStorage.removeItem('gasikara_admin');

  /* Cache le dashboard, affiche le login */
  document.getElementById('dashboard').classList.remove('visible');
  setTimeout(() => {
    document.getElementById('login-page').classList.remove('masquee');
    /* Réinitialise le formulaire */
    document.getElementById('form-login').reset();
    document.getElementById('login-erreur').classList.remove('visible');
  }, 300);
}

/**
 * toggleMdp()
 * Affiche ou cache le mot de passe dans le champ de login.
 */
function toggleMdp() {
  const input = document.getElementById('admin-mdp');
  const icone = document.getElementById('icone-oeil');

  if (input.type === 'password') {
    input.type = 'text';
    icone.className = 'fa-regular fa-eye-slash'; /* Icône œil barré         */
  } else {
    input.type = 'password';
    icone.className = 'fa-regular fa-eye';       /* Icône œil normal        */
  }
}

/* Animation de secousse CSS injectée dynamiquement */
const styleSecouer = document.createElement('style');
styleSecouer.textContent = `
  @keyframes secouer {
    0%,100%{transform:translateX(0)}
    20%{transform:translateX(-10px)}
    40%{transform:translateX(10px)}
    60%{transform:translateX(-6px)}
    80%{transform:translateX(6px)}
  }
`;
document.head.appendChild(styleSecouer);


/* ═══════════════════════════════════════════════════════════════════════
   3. NAVIGATION ENTRE SECTIONS
═══════════════════════════════════════════════════════════════════════ */

/**
 * changerSection(elementClique)
 * Change la section affichée dans le dashboard.
 * @param {HTMLElement} elementClique - L'item de sidebar cliqué
 */
function changerSection(elementClique) {
  /* Empêche la navigation par défaut du lien */
  event.preventDefault();

  /* Récupère le nom de la section cible depuis data-section */
  const nomSection = elementClique.dataset.section;

  /* ── Met à jour les items de la sidebar ────────────────────────── */
  document.querySelectorAll('.sidebar-item').forEach(item => {
    item.classList.remove('actif');
  });
  elementClique.classList.add('actif');

  /* ── Affiche la bonne section de contenu ───────────────────────── */
  document.querySelectorAll('.section-contenu').forEach(section => {
    section.classList.remove('actif');
  });

  const sectionCible = document.getElementById('section-' + nomSection);
  if (sectionCible) sectionCible.classList.add('actif');

  /* ── Met à jour le titre de l'en-tête ──────────────────────────── */
  const titres = {
    'tableau-bord':  ['Tableau de bord', 'GasikaraHotel · Vue globale'],
    'reservations':  ['Réservations', 'Gestion de toutes les réservations'],
    'hotels':        ['Hôtels & Provinces', 'Les 6 hôtels GasikaraHotel'],
    'chambres':      ['Chambres', 'Gestion du parc de chambres'],
    'clients':       ['Clients', 'Base de données clientèle'],
    'statistiques':  ['Statistiques', 'Analyses et performances'],
    'parametres':    ['Paramètres', 'Configuration du système']
  };

  const [titre, sousTitre] = titres[nomSection] || ['Dashboard', ''];
  document.getElementById('titre-section').textContent = titre;
  document.getElementById('sous-titre-section').textContent = sousTitre;

  /* Ferme la sidebar sur mobile après navigation */
  if (window.innerWidth <= 768) {
    document.getElementById('sidebar').classList.remove('ouverte');
    document.getElementById('sidebar-overlay').classList.remove('visible');
  }

  /* Ferme les dropdowns ouverts */
  fermerDropdowns();
}

/**
 * changerSectionParNom(nom)
 * Version alternative de changerSection, utilisée dans les boutons "Voir tout".
 */
function changerSectionParNom(nom) {
  event.preventDefault();
  /* Trouve l'item de sidebar correspondant */
  const item = document.querySelector(`[data-section="${nom}"]`);
  if (item) changerSection(item);
}

/**
 * toggleSidebar()
 * Ouvre/ferme la sidebar sur mobile.
 */
function toggleSidebar() {
  const sidebar  = document.getElementById('sidebar');
  const overlay  = document.getElementById('sidebar-overlay');
  const estOuverte = sidebar.classList.contains('ouverte');

  sidebar.classList.toggle('ouverte');
  overlay.classList.toggle('visible', !estOuverte);
}


/* ═══════════════════════════════════════════════════════════════════════
   4. HORLOGE EN TEMPS RÉEL
═══════════════════════════════════════════════════════════════════════ */

/**
 * mettreAJourHorloge()
 * Met à jour la date et l'heure affichées dans le bandeau de bienvenue.
 * Appelée toutes les secondes par setInterval.
 */
function mettreAJourHorloge() {
  const maintenant = new Date();

  /* Options de formatage français */
  const optDate = { weekday:'long', year:'numeric', month:'long', day:'numeric' };
  const optHeure = { hour:'2-digit', minute:'2-digit', second:'2-digit' };

  const dateStr  = maintenant.toLocaleDateString('fr-MG', optDate);
  const heureStr = maintenant.toLocaleTimeString('fr-MG', optHeure);

  const el = document.getElementById('bienvenue-date');
  if (el) {
    el.innerHTML = `
      <div>${dateStr}</div>
      <div style="font-size:1.1rem;font-weight:bold;color:var(--ad-or)">${heureStr}</div>
    `;
  }
}


/* ═══════════════════════════════════════════════════════════════════════
   5. CHARGEMENT DES DONNÉES ET KPI
═══════════════════════════════════════════════════════════════════════ */

/**
 * chargerKPI()
 * Calcule et affiche les indicateurs clés de performance.
 * En production : fetch('/api/stats/kpi')
 */
async function chargerKPI() {
  try {
    const res  = await fetch(`${API_URL}/api/stats/kpi`, {
      headers: getHeaders()
    });
    const data = await res.json();

    if (data.success) {
      animerCompteur('kpi-total-res', data.data.totalRes);
      animerCompteur('kpi-attente',   data.data.enAttente);
      animerCompteur('kpi-revenus',   data.data.revenusTotaux, true);
      animerCompteur('kpi-clients',   data.data.totalClients);

      /* Badge sidebar */
      const badgeRes = document.getElementById('badge-res');
      const badgeTB  = document.getElementById('badge-tb');

      if (data.data.enAttente > 0) {
        badgeRes.textContent   = data.data.enAttente;
        badgeRes.style.display = 'flex';
        badgeTB.textContent    = data.data.enAttente;
        badgeTB.style.display  = 'flex';
      }

      document.getElementById('notif-badge').textContent = data.data.enAttente + 1;
    }
  } catch (e) {
    console.error('Erreur KPI :', e);
    afficherToastAdmin('Impossible de contacter le serveur', 'erreur');
  }
}

/**
 * animerCompteur(id, valeurCible, estMonetaire)
 * Animation de compteur numérique (0 → valeur cible).
 * @param {string}  id           - ID de l'élément DOM
 * @param {number}  valeurCible  - Valeur finale
 * @param {boolean} estMonetaire - Si true, formate avec des espaces
 */
function animerCompteur(id, valeurCible, estMonetaire = false) {
  const el = document.getElementById(id);
  if (!el) return;

  const duree    = 1200;  /* Durée de l'animation en ms                     */
  const debut    = Date.now();
  const depart   = 0;

  /* Fonction d'animation frame par frame */
  function mettre() {
    const elapsed  = Date.now() - debut;
    const progress = Math.min(elapsed / duree, 1); /* Entre 0 et 1         */

    /* Easing : cubic ease-out pour ralentir en fin d'animation */
    const eased = 1 - Math.pow(1 - progress, 3);
    const valeur = Math.round(depart + (valeurCible - depart) * eased);

    /* Formate la valeur */
    if (estMonetaire) {
      /* Format : 12 500 000 */
      el.textContent = valeur.toLocaleString('fr-MG');
    } else {
      el.textContent = valeur;
    }

    /* Continue l'animation si pas encore finie */
    if (progress < 1) requestAnimationFrame(mettre);
  }

  requestAnimationFrame(mettre);
}

/**
 * chargerReservationsRecentes()
 * Affiche les 5 dernières réservations dans le tableau de bord.
 */
async function chargerReservationsRecentes() {
  try {
    const res  = await fetch(`${API_URL}/api/stats/recentes`, {
      headers: getHeaders()
    });
    const data = await res.json();

    if (!data.success) return;

    const conteneur = document.getElementById('liste-res-recentes');
    if (!conteneur) return;

    conteneur.innerHTML = data.data.map(r => `
      <div class="res-recente-item">
        <div class="res-avatar">
          ${r.prenom.charAt(0)}${r.nom.charAt(0)}
        </div>
        <div class="res-info">
          <div class="res-nom">${r.prenom} ${r.nom}</div>
          <div class="res-hotel">
            <i class="fa-solid fa-location-dot"
               style="color:var(--ad-vert);font-size:.7rem"></i>
            ${r.hotel ? r.hotel.nom : '—'}
          </div>
        </div>
        <div style="text-align:right">
          <div class="res-ref">${r.reference}</div>
          <span class="badge-statut ${r.statut}"
                style="font-size:.65rem;padding:.15rem .5rem">
            ${libellStatut(r.statut)}
          </span>
        </div>
      </div>
    `).join('');

  } catch (e) {
    console.error('Erreur réservations récentes :', e);
  }
}

/**
 * chargerOccupationHotels()
 * Affiche les barres de taux d'occupation par province.
 */
function chargerOccupationHotels() {
  const conteneur = document.getElementById('occupation-barres');
  if (!conteneur) return;

  conteneur.innerHTML = HOTELS_DATA.map(hotel => `
    <div class="occup-item">
      <div class="occup-nom">${hotel.province}</div>
      <div class="occup-barre-fond">
        <!-- Largeur de la barre = taux d'occupation -->
        <div class="occup-barre" style="width: ${hotel.occupation}%"></div>
      </div>
      <div class="occup-pct">${hotel.occupation}%</div>
    </div>
  `).join('');
}


/* ═══════════════════════════════════════════════════════════════════════
   6. GRAPHIQUES CHART.JS
═══════════════════════════════════════════════════════════════════════ */

/* Stockage des instances Chart pour pouvoir les détruire/recréer */
const graphiques = {};

/**
 * creerGraphiqueReservations()
 * Crée le graphique en barres des réservations par mois.
 */
function creerGraphiqueReservations() {
  const ctx = document.getElementById('graphique-reservations');
  if (!ctx) return;

  /* Données simulées par mois */
  const mois = ['Jan','Fév','Mar','Avr','Mai','Juin','Juil','Août','Sep','Oct','Nov','Déc'];
  const donnees = [12, 18, 24, 19, 28, 35, 42, 48, 38, 29, 22, 16];

  /* Détruit le graphique existant s'il y en a un */
  if (graphiques.reservations) graphiques.reservations.destroy();

  graphiques.reservations = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: mois,
      datasets: [{
        label: 'Réservations',
        data: donnees,
        backgroundColor: 'rgba(45,106,79,0.75)',
        borderColor: 'rgba(45,106,79,1)',
        borderWidth: 1,
        borderRadius: 6,       /* Coins arrondis sur les barres              */
        borderSkipped: false
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#0f1923',
          titleColor: '#e9c46a',
          bodyColor: '#fff',
          padding: 10,
          cornerRadius: 8
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: { color: 'rgba(0,0,0,0.05)' },
          ticks: { color: '#6b7a8d', font: { size: 11 } }
        },
        x: {
          grid: { display: false },
          ticks: { color: '#6b7a8d', font: { size: 11 } }
        }
      }
    }
  });
}

/**
 * creerGraphiqueHotels()
 * Crée le graphique en donut : réservations par hôtel.
 */
function creerGraphiqueHotels() {
  const ctx = document.getElementById('graphique-hotels');
  if (!ctx) return;

  if (graphiques.hotels) graphiques.hotels.destroy();

  graphiques.hotels = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: HOTELS_DATA.map(h => h.province),
      datasets: [{
        data: HOTELS_DATA.map(h => h.reservations),
        backgroundColor: [
          '#2d6a4f','#52b788','#e9c46a','#3b82f6','#f59e0b','#8b5cf6'
        ],
        borderWidth: 0,
        hoverOffset: 8
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '65%',           /* Trou central du donut                       */
      plugins: {
        legend: {
          position: 'right',
          labels: {
            color: '#6b7a8d',
            font: { size: 11 },
            boxWidth: 12,
            padding: 8
          }
        },
        tooltip: {
          backgroundColor: '#0f1923',
          titleColor: '#e9c46a',
          bodyColor: '#fff',
          cornerRadius: 8
        }
      }
    }
  });
}

/**
 * creerGraphiquesStats()
 * Crée les graphiques de la section Statistiques.
 */
function creerGraphiquesStats() {
  /* ── Graphique revenus ──────────────────────────────────────────── */
  const ctxRev = document.getElementById('graphique-revenus');
  if (ctxRev) {
    if (graphiques.revenus) graphiques.revenus.destroy();
    const mois = ['Jan','Fév','Mar','Avr','Mai','Juin','Juil','Août','Sep','Oct','Nov','Déc'];
    graphiques.revenus = new Chart(ctxRev, {
      type: 'line',
      data: {
        labels: mois,
        datasets: [{
          label: 'Revenus (Ar)',
          data: [2100000,3200000,4500000,3800000,5200000,6800000,8500000,9200000,7100000,5600000,4200000,3100000],
          borderColor: '#e9c46a',
          backgroundColor: 'rgba(233,196,106,0.1)',
          borderWidth: 2,
          fill: true,
          tension: 0.4,           /* Courbe lissée                           */
          pointBackgroundColor: '#e9c46a',
          pointRadius: 4
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { grid: { color: 'rgba(0,0,0,0.05)' }, ticks: { color: '#6b7a8d', font:{size:10} } },
          x: { grid: { display: false }, ticks: { color: '#6b7a8d', font:{size:10} } }
        }
      }
    });
  }

  /* ── Graphique types de chambres ────────────────────────────────── */
  const ctxTypes = document.getElementById('graphique-types-ch');
  if (ctxTypes) {
    if (graphiques.typesCh) graphiques.typesCh.destroy();
    graphiques.typesCh = new Chart(ctxTypes, {
      type: 'bar',
      data: {
        labels: ['Standard','Supérieure','Suite','Présidentielle'],
        datasets: [{
          label: 'Réservations',
          data: [145, 98, 67, 23],
          backgroundColor: ['#94a3b8','#3b82f6','#e9c46a','#8b5cf6'],
          borderRadius: 6
        }]
      },
      options: {
        indexAxis: 'y',         /* Barres horizontales                        */
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { color: 'rgba(0,0,0,0.05)' }, ticks: { color: '#6b7a8d', font:{size:10} } },
          y: { grid: { display: false }, ticks: { color: '#6b7a8d', font:{size:10} } }
        }
      }
    });
  }

  /* ── Graphique évolution 12 mois ────────────────────────────────── */
  const ctxEvol = document.getElementById('graphique-evolution');
  if (ctxEvol) {
    if (graphiques.evolution) graphiques.evolution.destroy();
    const labels12 = ['Août 24','Sep 24','Oct 24','Nov 24','Déc 24','Jan 25','Fév 25','Mar 25','Avr 25','Mai 25','Juin 25','Juil 25'];
    graphiques.evolution = new Chart(ctxEvol, {
      type: 'line',
      data: {
        labels: labels12,
        datasets: [
          {
            label: 'Réservations',
            data: [38,29,22,16,20,12,18,24,19,28,35,42],
            borderColor: '#2d6a4f', backgroundColor: 'rgba(45,106,79,0.1)',
            borderWidth: 2, fill: true, tension: 0.4, pointRadius: 3
          },
          {
            label: 'Annulations',
            data: [4,3,2,2,1,1,2,2,2,3,3,4],
            borderColor: '#ef4444', backgroundColor: 'transparent',
            borderWidth: 2, tension: 0.4, borderDash: [5,5], pointRadius: 3
          }
        ]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: {
          legend: { labels: { color: '#6b7a8d', font:{size:11} } }
        },
        scales: {
          y: { grid: { color: 'rgba(0,0,0,0.05)' }, ticks: { color: '#6b7a8d', font:{size:10} } },
          x: { grid: { display: false }, ticks: { color: '#6b7a8d', font:{size:10} } }
        }
      }
    });
  }
}

/**
 * mettreAJourGraphique(annee)
 * Régénère le graphique des réservations pour une autre année.
 */
function mettreAJourGraphique(annee) {
  /* Simule des données différentes selon l'année */
  const facteur = annee === '2024' ? 0.75 : 1;
  afficherToastAdmin(`Données ${annee} chargées`, 'info');
  creerGraphiqueReservations(); /* En production : fetch avec ?annee=X      */
}


/* ═══════════════════════════════════════════════════════════════════════
   7. GESTION DES RÉSERVATIONS
═══════════════════════════════════════════════════════════════════════ */

/**
 * chargerTableauReservations()
 * Remplit le tableau des réservations avec les données filtrées.
 */
async function chargerTableauReservations() {
  try {
    /* Construit l'URL avec les filtres actifs */
    let url = `${API_URL}/api/reservations?limite=50`;
    if (filtreStatutActif !== 'tous') {
      url += `&statut=${filtreStatutActif}`;
    }

    const res  = await fetch(url, { headers: getHeaders() });
    const data = await res.json();

    if (!data.success) return;

    const corps = document.getElementById('corps-tableau-res');
    if (!corps) return;

    if (data.data.length === 0) {
      corps.innerHTML = `
        <tr>
          <td colspan="9" style="text-align:center;padding:3rem;color:var(--ad-discret)">
            <i class="fa-solid fa-inbox" style="font-size:2rem;display:block;margin-bottom:1rem"></i>
            Aucune réservation trouvée
          </td>
        </tr>
      `;
      return;
    }

    corps.innerHTML = data.data.map(r => `
      <tr>
        <!-- Référence -->
        <td><span class="td-ref">${r.reference}</span></td>

        <!-- Client -->
        <td>
          <div class="td-client">
            <div class="td-avatar">
              ${r.prenom.charAt(0)}${r.nom.charAt(0)}
            </div>
            <div>
              <div style="font-weight:600;font-size:.85rem">
                ${r.prenom} ${r.nom}
              </div>
              <div style="font-size:.75rem;color:var(--ad-discret)">
                ${r.email}
              </div>
            </div>
          </div>
        </td>

        <!-- Hôtel -->
        <td style="font-size:.85rem">
          ${r.hotel ? r.hotel.nom : '—'}
        </td>

        <!-- Chambre -->
        <td style="font-size:.82rem;color:var(--ad-discret)">
          ${r.chambre ? r.chambre.nom : '—'}
        </td>

        <!-- Arrivée -->
        <td style="font-family:'DM Mono',monospace;font-size:.82rem">
          ${formaterDateAff(r.arrivee)}
        </td>

        <!-- Départ -->
        <td style="font-family:'DM Mono',monospace;font-size:.82rem">
          ${formaterDateAff(r.depart)}
        </td>

        <!-- Nuits -->
        <td style="text-align:center;font-weight:600">
          ${r.nb_nuits}
        </td>

        <!-- Statut -->
        <td>
          <span class="badge-statut ${r.statut}">
            <span class="dot ${statutCouleur(r.statut)}"></span>
            ${libellStatut(r.statut)}
          </span>
        </td>

        <!-- Actions -->
        <td>
          <div class="actions-td">
            ${r.statut === 'en_attente' ? `
            <button class="btn-action check" title="Confirmer"
              onclick="confirmerResAPI('${r.reference}')">
              <i class="fa-solid fa-check"></i>
            </button>` : ''}
            <button class="btn-action del" title="Supprimer"
              onclick="supprimerResAPI('${r.reference}')">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        </td>
      </tr>
    `).join('');

  } catch (e) {
    console.error('Erreur chargement réservations :', e);
  }
}

/**
 * filtrerReservations(statut, bouton)
 * Filtre le tableau des réservations par statut.
 */
function filtrerReservations(statut, bouton) {
  /* Met à jour le filtre actif */
  filtreStatutActif = statut || filtreStatutActif;

  /* Met à jour le style des boutons filtre */
  document.querySelectorAll('.filtre-statut').forEach(btn => btn.classList.remove('actif'));
  if (bouton) bouton.classList.add('actif');

  /* Recharge le tableau */
  chargerTableauReservations();
}

/**
 * confirmerReservation(id)
 * Change le statut d'une réservation à "confirmée".
 */
function confirmerReservation(id) {
  const res = RESERVATIONS_DATA.find(r => r.id === id);
  if (!res) return;

  res.statut = 'confirmee'; /* Mise à jour locale (en prod : PUT /api/reservations/GK-xxx) */
  chargerTableauReservations();
  chargerKPI();
  afficherToastAdmin(`✓ Réservation ${res.reference} confirmée`, 'succes');
}

/**
 * supprimerReservation(id)
 * Ouvre le modal de confirmation de suppression.
 */
function supprimerReservation(id) {
  const res = RESERVATIONS_DATA.find(r => r.id === id);
  if (!res) return;

  document.getElementById('supp-message').textContent =
    `Supprimer la réservation ${res.reference} de ${res.prenom} ${res.nom} ?`;

  document.getElementById('btn-confirm-supp').onclick = () => {
    /* Supprime de l'array local */
    RESERVATIONS_DATA = RESERVATIONS_DATA.filter(r => r.id !== id);
    chargerTableauReservations();
    chargerKPI();
    chargerReservationsRecentes();
    fermerModal('modal-confirm-supp', null, true);
    afficherToastAdmin(`Réservation ${res.reference} supprimée`, 'info');
  };

  /* Ouvre le modal de confirmation */
  document.getElementById('modal-confirm-supp').classList.add('actif');
}


/* ═══════════════════════════════════════════════════════════════════════
   8. GESTION DES HÔTELS
═══════════════════════════════════════════════════════════════════════ */

/**
 * chargerGrilleHotels()
 * Remplit la grille des 6 hôtels dans la section admin.
 */
function chargerGrilleHotels() {
  const grille = document.getElementById('grille-hotels-admin');
  if (!grille) return;

  grille.innerHTML = HOTELS_DATA.map(hotel => `
    <div class="carte-hotel-admin">
      <!-- Image de fond de l'hôtel -->
      <div class="hotel-admin-img" style="background-image:url('${hotel.image}')">
        <!-- Overlay avec boutons d'action -->
        <div class="hotel-admin-overlay">
          <button class="btn-action edit" title="Modifier" style="background:rgba(255,255,255,.9)"
            onclick="ouvrirModalHotel(${hotel.id})">
            <i class="fa-solid fa-pen"></i>
          </button>
          <button class="btn-action view" title="Voir" style="background:rgba(255,255,255,.9)">
            <i class="fa-solid fa-eye"></i>
          </button>
        </div>
      </div>
      <div class="hotel-admin-corps">
        <div class="hotel-admin-province">${hotel.province}</div>
        <div class="hotel-admin-nom">${hotel.nom}</div>
        <div class="hotel-admin-stats">
          <span><i class="fa-solid fa-bed"></i> ${hotel.chambres} chambres</span>
          <span><i class="fa-regular fa-calendar-check"></i> ${hotel.reservations} réserv.</span>
          <span><i class="fa-solid fa-percent"></i> ${hotel.occupation}% occup.</span>
        </div>
      </div>
    </div>
  `).join('');
}

/**
 * ouvrirModalHotel(id)
 * Ouvre le modal d'ajout/modification d'hôtel.
 */
function ouvrirModalHotel(id) {
  idEnCoursModif = id;
  const hotel = HOTELS_DATA.find(h => h.id === id);
  if (hotel) {
    afficherToastAdmin(`Hôtel : ${hotel.nom} — modification en cours`, 'info');
  }
  document.getElementById('modal-chambre').classList.add('actif');
}


/* ═══════════════════════════════════════════════════════════════════════
   9. GESTION DES CHAMBRES
═══════════════════════════════════════════════════════════════════════ */

/**
 * chargerTableauChambres()
 * Remplit le tableau des chambres.
 */
function chargerTableauChambres() {
  const corps = document.getElementById('corps-tableau-ch');
  if (!corps) return;

  corps.innerHTML = CHAMBRES_DATA.map(ch => `
    <tr>
      <td style="font-family:'DM Mono',monospace;font-size:.78rem;color:var(--ad-discret);">#${ch.id}</td>
      <td style="font-size:.85rem;">${ch.hotel}</td>
      <td style="font-weight:600;font-size:.85rem;">${ch.nom}</td>
      <td><span class="badge-type ${ch.type}">${ch.type.charAt(0).toUpperCase()+ch.type.slice(1)}</span></td>
      <td style="font-family:'DM Mono',monospace;font-size:.82rem;color:var(--ad-vert);">
        ${ch.prix.toLocaleString('fr-MG')} Ar
      </td>
      <td style="font-size:.82rem;">${ch.superficie} m²</td>
      <td style="font-size:.82rem;text-align:center;">${ch.capacite}</td>
      <td>
        <span class="badge-statut ${ch.disponible ? 'confirmee' : 'annulee'}">
          ${ch.disponible ? 'Disponible' : 'Occupée'}
        </span>
      </td>
      <td>
        <div class="actions-td">
          <button class="btn-action edit" title="Modifier" onclick="ouvrirModalChambre(${ch.id})">
            <i class="fa-solid fa-pen"></i>
          </button>
          <button class="btn-action del" title="Supprimer" onclick="supprimerChambre(${ch.id})">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      </td>
    </tr>
  `).join('');
}

/**
 * ouvrirModalChambre(id)
 * Ouvre le modal de création/modification de chambre.
 */
function ouvrirModalChambre(id) {
  idEnCoursModif = id;
  const titreModal = document.getElementById('modal-ch-titre');

  if (id) {
    /* Modification : pré-remplit les champs */
    const ch = CHAMBRES_DATA.find(c => c.id === id);
    if (ch) {
      titreModal.textContent = 'Modifier la chambre';
      document.getElementById('mch-hotel').value   = ch.hotel_id;
      document.getElementById('mch-type').value    = ch.type;
      document.getElementById('mch-nom').value     = ch.nom;
      document.getElementById('mch-prix').value    = ch.prix;
      document.getElementById('mch-surface').value = ch.superficie;
      document.getElementById('mch-capacite').value = ch.capacite;
      document.getElementById('mch-statut').value  = ch.disponible ? '1' : '0';
    }
  } else {
    /* Création : réinitialise les champs */
    titreModal.textContent = 'Nouvelle chambre';
    document.getElementById('mch-nom').value   = '';
    document.getElementById('mch-prix').value  = '';
    document.getElementById('mch-surface').value = '';
    document.getElementById('mch-capacite').value = '2';
    document.getElementById('mch-desc').value  = '';
  }

  document.getElementById('modal-chambre').classList.add('actif');
}

/**
 * sauvegarderChambre()
 * Sauvegarde une chambre (création ou modification).
 */
function sauvegarderChambre() {
  const nom     = document.getElementById('mch-nom').value.trim();
  const prix    = parseInt(document.getElementById('mch-prix').value);
  const type    = document.getElementById('mch-type').value;
  const hotelId = parseInt(document.getElementById('mch-hotel').value);

  if (!nom || !prix) {
    afficherToastAdmin('Veuillez remplir les champs obligatoires', 'erreur');
    return;
  }

  if (idEnCoursModif) {
    /* Modification */
    const idx = CHAMBRES_DATA.findIndex(c => c.id === idEnCoursModif);
    if (idx !== -1) {
      CHAMBRES_DATA[idx].nom  = nom;
      CHAMBRES_DATA[idx].prix = prix;
      CHAMBRES_DATA[idx].type = type;
    }
    afficherToastAdmin('Chambre modifiée avec succès ✓', 'succes');
  } else {
    /* Création */
    const hotelNom = HOTELS_DATA.find(h => h.id === hotelId)?.province || '';
    CHAMBRES_DATA.push({
      id: Date.now(), hotel_id: hotelId, hotel: hotelNom,
      nom, type, prix,
      superficie: parseInt(document.getElementById('mch-surface').value) || 0,
      capacite: parseInt(document.getElementById('mch-capacite').value) || 2,
      disponible: document.getElementById('mch-statut').value === '1'
    });
    afficherToastAdmin('Chambre ajoutée avec succès ✓', 'succes');
  }

  fermerModal('modal-chambre', null, true);
  chargerTableauChambres();
}

/**
 * supprimerChambre(id)
 */
function supprimerChambre(id) {
  const ch = CHAMBRES_DATA.find(c => c.id === id);
  document.getElementById('supp-message').textContent = `Supprimer "${ch?.nom}" ?`;
  document.getElementById('btn-confirm-supp').onclick = () => {
    CHAMBRES_DATA = CHAMBRES_DATA.filter(c => c.id !== id);
    chargerTableauChambres();
    fermerModal('modal-confirm-supp', null, true);
    afficherToastAdmin('Chambre supprimée', 'info');
  };
  document.getElementById('modal-confirm-supp').classList.add('actif');
}

/**
 * filtrerChambresPar()
 * Filtre les chambres par hôtel ou type.
 */
function filtrerChambresPar(valeur) {
  chargerTableauChambres(); /* En prod : appel API avec paramètres           */
}


/* ═══════════════════════════════════════════════════════════════════════
   10. GESTION DES CLIENTS
═══════════════════════════════════════════════════════════════════════ */

/**
 * chargerTableauClients()
 * Remplit le tableau des clients.
 */
function chargerTableauClients(donnees = CLIENTS_DATA) {
  const corps = document.getElementById('corps-tableau-clients');
  if (!corps) return;

  corps.innerHTML = donnees.map(client => `
    <tr>
      <td style="font-family:'DM Mono',monospace;font-size:.78rem;color:var(--ad-discret);">#${client.id}</td>
      <td>
        <div class="td-client">
          <div class="td-avatar">${client.prenom.charAt(0)}${client.nom.charAt(0)}</div>
          <div style="font-weight:600;font-size:.85rem;">${client.prenom} ${client.nom}</div>
        </div>
      </td>
      <td style="font-size:.82rem;">${client.email}</td>
      <td style="font-size:.82rem;">${client.tel || '—'}</td>
      <td style="text-align:center;">
        <span style="background:rgba(45,106,79,.1);color:var(--ad-vert);padding:.2rem .7rem;
                     border-radius:50px;font-size:.78rem;font-weight:700;">
          ${client.nb_res} réservation(s)
        </span>
      </td>
      <td style="font-family:'DM Mono',monospace;font-size:.78rem;color:var(--ad-discret);">
        ${formaterDateAff(client.created)}
      </td>
      <td>
        <div class="actions-td">
          <button class="btn-action view" title="Voir les réservations">
            <i class="fa-solid fa-eye"></i>
          </button>
          <button class="btn-action edit" title="Modifier" onclick="ouvrirModalClient(${client.id})">
            <i class="fa-solid fa-pen"></i>
          </button>
          <button class="btn-action del" title="Supprimer">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      </td>
    </tr>
  `).join('');
}

/**
 * rechercherClient(terme)
 * Filtre les clients par nom/email en temps réel.
 */
function rechercherClient(terme) {
  if (!terme) {
    chargerTableauClients();
    return;
  }
  const termeLower = terme.toLowerCase();
  const filtres = CLIENTS_DATA.filter(c =>
    c.prenom.toLowerCase().includes(termeLower) ||
    c.nom.toLowerCase().includes(termeLower) ||
    c.email.toLowerCase().includes(termeLower)
  );
  chargerTableauClients(filtres);
}

function ouvrirModalClient(id) {
  idEnCoursModif = id;
  const client = CLIENTS_DATA.find(c => c.id === id);
  if (client) {
    document.getElementById('mch-nom').value   = client.nom;
    document.getElementById('mch-hotel').value = client.prenom;
  }
  document.getElementById('modal-chambre').classList.add('actif');
}


/* ═══════════════════════════════════════════════════════════════════════
   11. NOTIFICATIONS
═══════════════════════════════════════════════════════════════════════ */

/* Données de notifications */
const NOTIFICATIONS = [
  { type:'vert',   icone:'fa-calendar-check', titre:'Nouvelle réservation', temps:'Il y a 5 min',   lu:false },
  { type:'orange', icone:'fa-clock',          titre:'3 réservations en attente', temps:'Il y a 20 min', lu:false },
  { type:'rouge',  icone:'fa-xmark-circle',   titre:'Annulation : GK-M9N0O',  temps:'Il y a 1h',    lu:false },
  { type:'vert',   icone:'fa-star',           titre:'Nouvel avis 5 étoiles',  temps:'Il y a 2h',    lu:true  }
];

/**
 * chargerNotifications()
 * Remplit le panel de notifications.
 */
function chargerNotifications() {
  const liste = document.getElementById('notif-liste');
  if (!liste) return;

  liste.innerHTML = NOTIFICATIONS.map((n, idx) => `
    <div class="notif-item ${n.lu ? '' : 'non-lu'}" onclick="lireNotif(${idx})">
      <div class="notif-ico ${n.type}">
        <i class="fa-solid ${n.icone}"></i>
      </div>
      <div>
        <div class="notif-titre">${n.titre}</div>
        <div class="notif-temps">${n.temps}</div>
      </div>
    </div>
  `).join('');
}

/**
 * lireNotif(idx)
 * Marque une notification comme lue.
 */
function lireNotif(idx) {
  NOTIFICATIONS[idx].lu = true;
  chargerNotifications();
  /* Met à jour le badge */
  const nonLues = NOTIFICATIONS.filter(n => !n.lu).length;
  document.getElementById('notif-badge').textContent = nonLues;
  if (nonLues === 0) document.getElementById('notif-badge').style.display = 'none';
}

/**
 * marquerToutLu()
 * Marque toutes les notifications comme lues.
 */
function marquerToutLu() {
  NOTIFICATIONS.forEach(n => n.lu = true);
  chargerNotifications();
  document.getElementById('notif-badge').style.display = 'none';
  afficherToastAdmin('Toutes les notifications marquées comme lues', 'succes');
}

/**
 * toggleNotifications()
 * Affiche/cache le panel de notifications.
 */
function toggleNotifications() {
  document.getElementById('notif-panel').classList.toggle('visible');
  document.getElementById('menu-admin').classList.remove('visible');
}

/**
 * toggleMenuAdmin()
 * Affiche/cache le menu admin.
 */
function toggleMenuAdmin() {
  document.getElementById('menu-admin').classList.toggle('visible');
  document.getElementById('notif-panel').classList.remove('visible');
}

/**
 * fermerDropdowns()
 * Ferme tous les menus déroulants.
 */
function fermerDropdowns() {
  document.getElementById('notif-panel').classList.remove('visible');
  document.getElementById('menu-admin').classList.remove('visible');
}


/* ═══════════════════════════════════════════════════════════════════════
   12. MODALS (OUVERTURE, FERMETURE, SAUVEGARDE)
═══════════════════════════════════════════════════════════════════════ */

/**
 * ouvrirModalRes(id)
 * Ouvre le modal de réservation (création ou modification).
 */
function ouvrirModalRes(id) {
  idEnCoursModif = id;
  const titre = document.getElementById('modal-res-titre');

  if (id) {
    /* Modification : pré-remplit avec les données existantes */
    const res = RESERVATIONS_DATA.find(r => r.id === id);
    if (res) {
      titre.textContent = 'Modifier la réservation';
      document.getElementById('mr-prenom').value  = res.prenom;
      document.getElementById('mr-nom').value     = res.nom;
      document.getElementById('mr-email').value   = res.email;
      document.getElementById('mr-tel').value     = res.tel;
      document.getElementById('mr-hotel').value   = res.hotel_id;
      document.getElementById('mr-arrivee').value = res.arrivee;
      document.getElementById('mr-depart').value  = res.depart;
      document.getElementById('mr-statut').value  = res.statut;
    }
  } else {
    /* Création : réinitialise le formulaire */
    titre.textContent = 'Nouvelle réservation';
    document.getElementById('mr-prenom').value  = '';
    document.getElementById('mr-nom').value     = '';
    document.getElementById('mr-email').value   = '';
    document.getElementById('mr-tel').value     = '';
    document.getElementById('mr-arrivee').value = '';
    document.getElementById('mr-depart').value  = '';
    document.getElementById('mr-statut').value  = 'en_attente';
  }

  document.getElementById('modal-reservation').classList.add('actif');
}

/**
 * sauvegarderReservation()
 * Crée ou met à jour une réservation.
 */
function sauvegarderReservation() {
  const prenom  = document.getElementById('mr-prenom').value.trim();
  const nom     = document.getElementById('mr-nom').value.trim();
  const email   = document.getElementById('mr-email').value.trim();
  const arrivee = document.getElementById('mr-arrivee').value;
  const depart  = document.getElementById('mr-depart').value;
  const statut  = document.getElementById('mr-statut').value;
  const hotelId = parseInt(document.getElementById('mr-hotel').value);

  if (!prenom || !nom || !email || !arrivee || !depart) {
    afficherToastAdmin('Veuillez remplir tous les champs obligatoires', 'erreur');
    return;
  }

  const hotel = HOTELS_DATA.find(h => h.id === hotelId);

  if (idEnCoursModif) {
    /* Modification */
    const idx = RESERVATIONS_DATA.findIndex(r => r.id === idEnCoursModif);
    if (idx !== -1) {
      Object.assign(RESERVATIONS_DATA[idx], { prenom, nom, email, arrivee, depart, statut });
    }
    afficherToastAdmin('Réservation modifiée avec succès ✓', 'succes');
  } else {
    /* Création */
    const ref = 'GK-' + Date.now().toString(36).toUpperCase().slice(-5);
    const nbNuits = Math.ceil((new Date(depart) - new Date(arrivee)) / 86400000);

    RESERVATIONS_DATA.unshift({
      id: Date.now(), reference: ref,
      prenom, nom, email,
      hotel_id: hotelId,
      hotel: hotel?.province || '',
      chambre: document.getElementById('mr-chambre').value,
      arrivee, depart,
      adultes: parseInt(document.getElementById('mr-adultes').value),
      enfants: 0, statut, nb_nuits: nbNuits,
      prix_total: (hotel?.prix_depuis || 0) * nbNuits,
      created: new Date().toISOString().split('T')[0]
    });
    afficherToastAdmin(`Réservation ${ref} créée ✓`, 'succes');
  }

  fermerModal('modal-reservation', null, true);
  chargerTableauReservations();
  chargerKPI();
  chargerReservationsRecentes();
}

/**
 * fermerModal(idModal, event, forcer)
 * Ferme un modal générique.
 */
function fermerModal(idModal, event, forcer = false) {
  const modal = document.getElementById(idModal);
  if (!modal) return;

  if (forcer || (event && event.target === modal)) {
    modal.classList.remove('actif');
    idEnCoursModif = null;
  }
}

/**
 * confirmerAction(message)
 * Affiche une confirmation native avant une action.
 */
function confirmerAction(message) {
  if (confirm(message)) {
    afficherToastAdmin('Action effectuée', 'succes');
  }
}


/* ═══════════════════════════════════════════════════════════════════════
   13. RECHERCHE GLOBALE
═══════════════════════════════════════════════════════════════════════ */

/**
 * rechercheGlobale(terme)
 * Recherche dans toutes les données du dashboard.
 */
function rechercheGlobale(terme) {
  if (!terme || terme.length < 2) return;

  const termeLower = terme.toLowerCase();

  /* Recherche dans les réservations */
  const resResultats = RESERVATIONS_DATA.filter(r =>
    r.prenom.toLowerCase().includes(termeLower) ||
    r.nom.toLowerCase().includes(termeLower) ||
    r.reference.toLowerCase().includes(termeLower) ||
    r.email.toLowerCase().includes(termeLower)
  );

  if (resResultats.length > 0) {
    afficherToastAdmin(
      `${resResultats.length} résultat(s) trouvé(s) dans les réservations`,
      'info'
    );
  }
}


/* ═══════════════════════════════════════════════════════════════════════
   14. TOAST NOTIFICATIONS ADMIN
═══════════════════════════════════════════════════════════════════════ */

/* Timer pour masquer le toast */
let toastTimer = null;

/**
 * afficherToastAdmin(message, type)
 * Affiche une notification toast en bas à droite du dashboard.
 * @param {string} message - Texte à afficher
 * @param {string} type    - 'succes' | 'erreur' | 'info'
 */
function afficherToastAdmin(message, type = 'succes') {
  const toast = document.getElementById('admin-toast');
  if (!toast) return;

  /* Réinitialise le timer précédent */
  if (toastTimer) clearTimeout(toastTimer);

  /* Retire les classes de type précédentes */
  toast.className = 'admin-toast';

  /* Applique le message et le type */
  toast.textContent = message;
  toast.classList.add(type, 'visible');

  /* Masque automatiquement après 3 secondes */
  toastTimer = setTimeout(() => {
    toast.classList.remove('visible');
  }, 3000);
}


/* ═══════════════════════════════════════════════════════════════════════
   15. UTILITAIRES
═══════════════════════════════════════════════════════════════════════ */

/**
 * formaterDateAff(dateStr)
 * Formate une date YYYY-MM-DD en DD/MM/YYYY.
 */
function formaterDateAff(dateStr) {
  if (!dateStr) return '—';
  const [y, m, d] = dateStr.split('-');
  return `${d}/${m}/${y}`;
}

/**
 * libellStatut(statut)
 * Retourne le libellé français d'un statut.
 */
function libellStatut(statut) {
  const libelles = {
    'en_attente': 'En attente',
    'confirmee':  'Confirmée',
    'annulee':    'Annulée'
  };
  return libelles[statut] || statut;
}

/**
 * statutCouleur(statut)
 * Retourne la classe de couleur correspondant au statut.
 */
function statutCouleur(statut) {
  const couleurs = {
    'en_attente': 'orange',
    'confirmee':  'vert',
    'annulee':    'rouge'
  };
  return couleurs[statut] || '';
}


/* ═══════════════════════════════════════════════════════════════════════
   16. INITIALISATION
═══════════════════════════════════════════════════════════════════════ */

/**
 * initialiserDashboard()
 * Lance toutes les fonctions au démarrage du dashboard.
 * Appelée après connexion réussie.
 */
function initialiserDashboard() {

  /* ── Horloge en temps réel ──────────────────────────────────────── */
  mettreAJourHorloge();
  setInterval(mettreAJourHorloge, 1000); /* Mise à jour chaque seconde     */

  /* ── KPI et données du tableau de bord ─────────────────────────── */
  setTimeout(() => {
    chargerKPI();
    chargerReservationsRecentes();
    chargerOccupationHotels();
  }, 300); /* Léger délai pour l'animation d'entrée                       */

  /* ── Graphiques (après que les canvas soient rendus) ───────────── */
  setTimeout(() => {
    creerGraphiqueReservations();
    creerGraphiqueHotels();
    creerGraphiquesStats();
  }, 400);

  /* ── Tableaux ───────────────────────────────────────────────────── */
  chargerTableauReservations();
  chargerGrilleHotels();
  chargerTableauChambres();
  chargerTableauClients();

  /* ── Notifications ──────────────────────────────────────────────── */
  chargerNotifications();

  /* ── Fermeture des dropdowns au clic extérieur ──────────────────── */
  document.addEventListener('click', (e) => {
    /* Si le clic n'est pas dans le header */
    if (!e.target.closest('.dash-header-actions')) {
      fermerDropdowns();
    }
  });

  /* ── Fermeture des modals avec Échap ───────────────────────────── */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-fond.actif').forEach(m => {
        m.classList.remove('actif');
      });
      idEnCoursModif = null;
    }
  });

  console.log('%c✅ GasikaraHotel Admin Dashboard initialisé',
    'color:#2d6a4f;font-weight:bold;font-size:1rem;');
}

/* ─────────────────────────────────────────────────────────────────────
   POINT D'ENTRÉE
   Quand le DOM est chargé, vérifie la session ou affiche le login
   ───────────────────────────────────────────────────────────────────── */
/* Confirmer une réservation depuis le dashboard */
async function confirmerResAPI(reference) {
  try {
    const res  = await fetch(
      `${API_URL}/api/reservations/${reference}/confirmer`,
      { method: 'PUT', headers: getHeaders() }
    );
    const data = await res.json();

    if (data.success) {
      afficherToastAdmin(`✓ Réservation ${reference} confirmée`, 'succes');
      chargerTableauReservations();
      chargerKPI();
    } else {
      afficherToastAdmin(data.message, 'erreur');
    }
  } catch (e) {
    afficherToastAdmin('Erreur de connexion', 'erreur');
  }
}

/* Supprimer une réservation depuis le dashboard */
async function supprimerResAPI(reference) {
  if (!confirm(`Supprimer la réservation ${reference} ?`)) return;

  try {
    const res  = await fetch(
      `${API_URL}/api/reservations/${reference}`,
      { method: 'DELETE', headers: getHeaders() }
    );
    const data = await res.json();

    if (data.success) {
      afficherToastAdmin(`Réservation ${reference} supprimée`, 'info');
      chargerTableauReservations();
      chargerKPI();
    } else {
      afficherToastAdmin(data.message, 'erreur');
    }
  } catch (e) {
    afficherToastAdmin('Erreur de connexion', 'erreur');
  }
}
document.addEventListener('DOMContentLoaded', () => {
  /* Vérifie s'il y a une session active */
  /* Si non, le login reste affiché (état par défaut du HTML) */
  verifierSession();
});
