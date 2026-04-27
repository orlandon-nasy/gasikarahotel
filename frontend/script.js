/* ═══════════════════════════════════════════════════════════════════════
   GASIKARAHOTEL – SCRIPT JAVASCRIPT (script.js)
   Auteur : GasikaraHotel Dev Team
   Description : Toutes les interactions et fonctionnalités du site
                 de réservation GasikaraHotel (6 provinces de Madagascar)

   TABLE DES MATIÈRES :
   1.  Données des hôtels (base de données locale)
   2.  Preloader (écran de chargement)
   3.  Navigation (scroll, burger, liens actifs)
   4.  Animations au scroll (IntersectionObserver)
   5.  Particules décoratives du hero
   6.  Dates (initialisation et validation)
   7.  Widget de recherche de disponibilités
   8.  Modal hôtel (ouverture/fermeture)
   9.  Filtre des chambres
   10. Modal chambre
   11. Formulaire de réservation
   12. Modal de confirmation
   13. Notifications toast
   14. Utilitaires
   15. Initialisation générale
═══════════════════════════════════════════════════════════════════════ */


/* ═══════════════════════════════════════════════════════════════════════
   1. BASE DE DONNÉES DES HÔTELS
   Chaque hôtel correspond à une province de Madagascar.
   Ces données sont utilisées pour remplir le modal de détail.
═══════════════════════════════════════════════════════════════════════ */

/* Objet contenant les informations de chacun des 6 hôtels */
const DONNEES_HOTELS = {

  /* ── Hôtel d'Antananarivo ─────────────────────────────────────────── */
  antananarivo: {
    nom:      "GasikaraHotel Tana",
    province: "Province d'Antananarivo – Hautes Terres Centrales",
    /* Description longue affichée dans le modal */
    desc: `Situé au cœur d'Antananarivo, la capitale de Madagascar,
           GasikaraHotel Tana offre une vue imprenable sur la ville des mille collines
           et le mythique Palais de la Reine (Rova). Architecture Art Déco réinterprétée
           à la sauce malgache, le palace allie patrimoine et modernité absolue.
           À 15 minutes de l'aéroport international d'Ivato.`,
    /* URL de l'image de fond (Unsplash) */
    image:    "../img/tana.jpg",
    /* Liste des équipements affichés dans le modal */
    equip: ["Wi-Fi Fibre","Piscine Panoramique","Spa Orchidée","Restaurant Gastronomique",
            "Salle de Conférences","Bar Rooftop","Navette Aéroport","Fitness Center"],
    prix:     "250 000"
  },

  /* ── Hôtel de Toamasina ──────────────────────────────────────────── */
  toamasina: {
    nom:      "GasikaraHotel Tamatave",
    province: "Province de Toamasina – Côte Est, Océan Indien",
    desc: `Face à l'Océan Indien, GasikaraHotel Tamatave est la porte d'entrée
           de Madagascar pour les voyageurs arrivant par mer. Entouré de palmiers
           et de plages de sable noir volcanique, l'hôtel propose une immersion
           totale dans la culture côtière malgache. Accès direct à l'île aux Prunes
           et au canal des Pangalanes pour des excursions inoubliables.`,
    image:    "../img/toamasina.jpg",
    equip: ["Wi-Fi Haut Débit","Accès Plage Privée","Piscine Infinity","Plongée & Snorkeling",
            "Restaurant Fruits de Mer","Excursions Canal","Spa Ylang-ylang","Bar de Plage"],
    prix:     "280 000"
  },

  /* ── Hôtel de Mahajanga ──────────────────────────────────────────── */
  mahajanga: {
    nom:      "GasikaraHotel Majunga",
    province: "Province de Mahajanga – Côte Ouest, Canal de Mozambique",
    desc: `Majunga, ville cosmopolite de la côte ouest, est célèbre pour ses
           couchers de soleil flamboyants sur le Canal de Mozambique. Notre hôtel
           s'inspire de l'architecture swahili et arabe qui a marqué l'histoire
           de la ville. Profitez des mangroves, des excursions vers Cirque Rouge
           et des randonnées dans le Parc National d'Ankarafantsika.`,
    image:    "../img/mojanga.jpg",
    equip: ["Wi-Fi","Piscine Vue Mer","Spa Baobab","Restaurant Saveurs d'Afrique",
            "Excursions Cirque Rouge","Croisières Mangroves","Bar Coucher de Soleil","Parking"],
    prix:     "240 000"
  },

  /* ── Hôtel de Fianarantsoa ───────────────────────────────────────── */
  fianarantsoa: {
    nom:      "GasikaraHotel Fianar",
    province: "Province de Fianarantsoa – Hautes Terres du Sud",
    desc: `Niché dans les collines verdoyantes du pays Betsileo, GasikaraHotel Fianar
           est un havre de paix entouré de vignobles et de forêts primaires.
           La région est réputée pour sa production de vin, son chemin de fer
           mythique vers Manakara, et la Réserve de Ranomafana abritant
           de nombreuses espèces de lémuriens endémiques.`,
    image:    "../img/fianara.jpg",
    equip: ["Wi-Fi","Cave à Vin Privée","Jardin Botanique","Restaurant Cuisine Betsileo",
            "Excursions Ranomafana","Visite Vignobles","Spa Nature","Bibliothèque"],
    prix:     "220 000"
  },

  /* ── Hôtel de Toliara ────────────────────────────────────────────── */
  toliara: {
    nom:      "GasikaraHotel Tuléar",
    province: "Province de Toliara – Grand Sud, Lagon de Toliara",
    desc: `Au bord du récif corallien de Toliara, l'un des plus grands du monde,
           GasikaraHotel Tuléar est un paradis pour les amateurs de plongée et
           de nature sauvage. Le Grand Sud malgache avec ses baobabs majestueux,
           son peuple Vezo de pêcheurs et ses paysages quasi désertiques
           vous plongeront dans un autre monde.`,
    image:    "../img/tulear.jpg",
    equip: ["Wi-Fi","Plongée & Apnée","Plage Corallienne","Kitesurf","Restaurant Langouste",
            "Excursions Baobabs","Piscine Lagon","Spa Coco"],
    prix:     "260 000"
  },

  /* ── Hôtel d'Antsiranana ─────────────────────────────────────────── */
  antsiranana: {
    nom:      "GasikaraHotel Diego",
    province: "Province d'Antsiranana – Extrême Nord, Baie des Sakalava",
    desc: `À Diego-Suarez, porte d'entrée de l'extrême nord de Madagascar,
           GasikaraHotel Diego surplombe l'une des plus belles baies du monde.
           Paradis du kitesurf, des randonnées dans la Montagne des Français
           et de l'observation des lémuriens. La Baie des Sakalava et la mer
           d'Émeraude constituent un décor naturel exceptionnel.`,
    image:    "../img/diego.jpg",
    equip: ["Wi-Fi","Kitesurf & Windsurf","Plongée Baie","Excursions Montagne Française",
            "Piscine Vue Baie","Spa Mer d'Émeraude","Restaurant Poissons","Voilier Privatif"],
    prix:     "290 000"
  }
};

/* Données des types de chambres (pour le modal chambre) */
const DONNEES_CHAMBRES = {
  standard: {
    nom:  "Chambre Classique",
    imgs: [
      "../img/standard.jpg",
      "../img/standard1.jpg",
      "../img/standard2.jpg"
    ],
    desc: "Chambre élégante de 28m² avec vue sur les jardins, literie premium et salle de bain privée avec douche.",
    prix: "180 000"
  },
  superieure: {
    nom:  "Chambre Baobab",
    imgs: [
      "../img/sup.jpg",
      "../img/sup1.jpg",
      "../img/sup2.jpg"
    ],
    desc: "42m² avec terrasse privée, décoration inspirée du baobab, baignoire îlot et produits de luxe.",
    prix: "320 000"
  },
  suite: {
    nom:  "Suite Vanille",
    imgs: [
      "../img/vanille.jpg",
      "../img/vanille1.jpg",
      "../img/vanille2.jpg"
    ],
    desc: "75m² avec salon séparé, jacuzzi panoramique, butler dédié et accès illimité au spa.",
    prix: "750 000"
  },
  presidentielle: {
    nom:  "Suite Présidentielle",
    imgs: [
      "../img/pres.jpg",
      "../img/pres1.jpg",
      "../img/pres2.jpg"
    ],
    desc: "150m² avec piscine privée, 2 chambres, salon, chef et voiture avec chauffeur. L'ultime expérience.",
    prix: "1 500 000"
  }
};


/* ═══════════════════════════════════════════════════════════════════════
   2. PRELOADER
   Gère l'écran de chargement au démarrage de la page
═══════════════════════════════════════════════════════════════════════ */

/**
 * masquerPreloader()
 * Ajoute la classe 'masque' au preloader après un délai.
 * La classe déclenche une animation CSS (opacity: 0 + visibility: hidden).
 */
function masquerPreloader() {
  /* Récupère l'élément preloader dans le DOM */
  const preloader = document.getElementById('preloader');

  /* Attend 1.5 secondes avant de masquer le preloader */
  setTimeout(() => {
    /* Ajoute la classe 'masque' définie dans le CSS */
    preloader.classList.add('masque');

    /* Supprime l'élément du DOM après la fin de la transition CSS (0.6s) */
    setTimeout(() => {
      if (preloader.parentNode) {
        preloader.remove();
      }
    }, 600); /* 600ms correspond à la durée de la transition CSS           */

  }, 1500); /* 1500ms = 1.5 secondes d'affichage du preloader              */
}


/* ═══════════════════════════════════════════════════════════════════════
   3. NAVIGATION
═══════════════════════════════════════════════════════════════════════ */

/* Référence à la navbar dans le DOM */
const navbar = document.getElementById('navbar');

/**
 * gererScroll()
 * Appelée à chaque événement 'scroll'.
 * Met à jour la navbar, le bouton retour en haut,
 * et surligne le lien actif selon la section visible.
 */
function gererScroll() {
  const scrollY = window.scrollY; /* Position verticale actuelle du défilement */

  /* ── Classe 'scrolled' sur la navbar ─────────────────────────────────
     Quand l'utilisateur descend de plus de 60px, la navbar change de style :
     fond blanc, ombre portée, hauteur réduite (gérés par CSS).              */
  if (scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  /* ── Bouton "retour en haut" ──────────────────────────────────────────
     Devient visible après 400px de défilement.                              */
  const btnTop = document.getElementById('btn-top');
  if (btnTop) {
    if (scrollY > 400) {
      btnTop.classList.add('visible');
    } else {
      btnTop.classList.remove('visible');
    }
  }

  /* ── Lien de navigation actif ─────────────────────────────────────────
     Détermine quelle section est actuellement dans le viewport et
     surligne le lien de navigation correspondant.                          */
  mettreAJourLienActif();
}

/**
 * mettreAJourLienActif()
 * Parcourt toutes les sections et surligne le lien de nav correspondant
 * à la section actuellement visible à l'écran.
 */
function mettreAJourLienActif() {
  /* Sélectionne toutes les sections avec un ID */
  const sections = document.querySelectorAll('section[id], div[id]');
  /* Sélectionne tous les liens de navigation */
  const liensNav = document.querySelectorAll('.nav-lien');

  /* Position actuelle + 30% de la hauteur de l'écran (zone de détection) */
  const positionDetection = window.scrollY + window.innerHeight * 0.3;

  let sectionActive = '';

  /* Trouve la section dont le début est le plus proche de la position */
  sections.forEach(section => {
    const debut = section.offsetTop; /* Distance depuis le haut de la page   */
    if (positionDetection >= debut) {
      sectionActive = section.id;    /* Met à jour le ID de la section active */
    }
  });

  /* Ajoute la classe 'actif' au lien correspondant et la retire aux autres */
  liensNav.forEach(lien => {
    lien.classList.remove('actif');
    /* Le href du lien contient '#nomSection', on compare avec sectionActive */
    if (lien.getAttribute('href') === '#' + sectionActive) {
      lien.classList.add('actif');
    }
  });
}

/**
 * initialiserBurger()
 * Configure le menu hamburger pour le mobile.
 * Toggle l'affichage du menu en cliquant sur le bouton burger.
 */
function initialiserBurger() {
  const burger   = document.getElementById('burger');
  const navLiens = document.getElementById('nav-liens');

  if (!burger || !navLiens) return; /* Sécurité si les éléments n'existent pas */

  /* Clic sur le bouton burger */
  burger.addEventListener('click', () => {
    /* Toggle : ajoute ou retire la classe 'ouvert' */
    const estOuvert = navLiens.classList.toggle('ouvert');
    burger.classList.toggle('ouvert');  /* Pour l'animation du burger en X   */
    /* Mise à jour de l'attribut d'accessibilité */
    burger.setAttribute('aria-expanded', estOuvert.toString());
  });

  /* Ferme le menu quand on clique sur un lien */
  navLiens.querySelectorAll('a').forEach(lien => {
    lien.addEventListener('click', () => {
      navLiens.classList.remove('ouvert');
      burger.classList.remove('ouvert');
      burger.setAttribute('aria-expanded', 'false');
    });
  });

  /* Ferme le menu si on clique en dehors */
  document.addEventListener('click', (e) => {
    /* Si le clic n'est ni sur la navbar ni sur le burger */
    if (!navbar.contains(e.target)) {
      navLiens.classList.remove('ouvert');
      burger.classList.remove('ouvert');
      burger.setAttribute('aria-expanded', 'false');
    }
  });
}


/* ═══════════════════════════════════════════════════════════════════════
   4. ANIMATIONS AU SCROLL (INTERSECTION OBSERVER)
   Révèle les éléments avec la classe 'reveler' quand ils entrent
   dans la zone visible de la page.
═══════════════════════════════════════════════════════════════════════ */

/**
 * initialiserAnimationsScroll()
 * Crée un IntersectionObserver qui surveille tous les éléments .reveler.
 * Quand un élément devient visible, la classe 'visible' est ajoutée
 * déclenchant l'animation CSS (fadeIn + translateY).
 */
function initialiserAnimationsScroll() {
  /* Sélectionne tous les éléments à animer */
  const elements = document.querySelectorAll('.reveler');

  /* Configuration de l'observateur */
  const observateur = new IntersectionObserver(
    /* Callback appelée quand la visibilité d'un élément change */
    (entrees) => {
      entrees.forEach(entree => {
        /* isIntersecting = true quand l'élément entre dans le viewport */
        if (entree.isIntersecting) {
          /* Ajoute 'visible' pour déclencher l'animation CSS */
          entree.target.classList.add('visible');
          /* Arrête d'observer cet élément (l'animation ne se rejoue pas) */
          observateur.unobserve(entree.target);
        }
      });
    },
    {
      threshold:  0.1,              /* Déclenche quand 10% de l'élément est visible */
      rootMargin: '0px 0px -50px 0px' /* Marge de 50px : l'animation commence un peu avant */
    }
  );

  /* Lance l'observation de chaque élément */
  elements.forEach(el => observateur.observe(el));
}


/* ═══════════════════════════════════════════════════════════════════════
   5. PARTICULES DÉCORATIVES DU HERO
   Crée des cercles animés flottants dans le fond du hero
═══════════════════════════════════════════════════════════════════════ */

/**
 * creerParticules()
 * Génère 15 cercles colorés positionnés aléatoirement dans le hero.
 * Les propriétés d'animation sont personnalisées via des variables CSS.
 */
function creerParticules() {
  const conteneur = document.getElementById('particules');
  if (!conteneur) return; /* Sécurité si le conteneur n'existe pas          */

  const NB_PARTICULES = 15; /* Nombre total de particules à créer           */

  for (let i = 0; i < NB_PARTICULES; i++) {
    const particule = document.createElement('div');
    particule.classList.add('particule');

    /* Taille aléatoire entre 10px et 80px */
    const taille = Math.random() * 70 + 10;

    /* Styles appliqués directement en JavaScript */
    particule.style.cssText = `
      width:  ${taille}px;
      height: ${taille}px;
      left:   ${Math.random() * 100}%;   /* Position horizontale aléatoire  */
      top:    ${Math.random() * 100}%;   /* Position verticale aléatoire     */
      --dur:   ${Math.random() * 6 + 6}s;  /* Durée entre 6 et 12 secondes  */
      --delay: ${Math.random() * 5}s;      /* Délai de départ entre 0 et 5s  */
    `;

    conteneur.appendChild(particule); /* Ajoute la particule au DOM         */
  }
}


/* ═══════════════════════════════════════════════════════════════════════
   6. GESTION DES DATES
   Initialise les contraintes sur les champs de date
═══════════════════════════════════════════════════════════════════════ */

/**
 * initialiserDates()
 * Définit les dates minimales pour les champs d'arrivée et de départ.
 * L'arrivée minimale est aujourd'hui, le départ est au lendemain de l'arrivée.
 */
function initialiserDates() {
  /* Date d'aujourd'hui */
  const aujourdhui = new Date();
  /* Date de demain (aujourd'hui + 1 jour) */
  const demain = new Date(aujourdhui);
  demain.setDate(demain.getDate() + 1);

  /**
   * formaterDate(date)
   * Convertit un objet Date en chaîne YYYY-MM-DD (format requis par input[type="date"])
   * @param {Date} date - L'objet date à formater
   * @returns {string} - La date au format YYYY-MM-DD
   */
  const formaterDate = (date) => date.toISOString().split('T')[0];

  /* Champs d'arrivée : widget + formulaire */
  const champsArrivee = ['w-arrivee', 'r-arrivee'];
  champsArrivee.forEach(id => {
    const champ = document.getElementById(id);
    if (champ) champ.min = formaterDate(aujourdhui); /* Minimum = aujourd'hui */
  });

  /* Champs de départ : widget + formulaire */
  const champsDepart = ['w-depart', 'r-depart'];
  champsDepart.forEach(id => {
    const champ = document.getElementById(id);
    if (champ) champ.min = formaterDate(demain); /* Minimum = demain         */
  });

  /* ── Synchronisation widget → formulaire ──────────────────────────────
     Quand l'utilisateur choisit une date dans le widget,
     elle est automatiquement copiée dans le formulaire principal.          */

  const wArrivee = document.getElementById('w-arrivee');
  const rArrivee = document.getElementById('r-arrivee');
  const wDepart  = document.getElementById('w-depart');
  const rDepart  = document.getElementById('r-depart');

  if (wArrivee && rArrivee) {
    wArrivee.addEventListener('change', () => {
      /* Copie la valeur dans le formulaire principal */
      rArrivee.value = wArrivee.value;

      /* Met à jour le minimum du départ (lendemain de l'arrivée choisie) */
      if (wArrivee.value) {
        const dateArrivee = new Date(wArrivee.value);
        dateArrivee.setDate(dateArrivee.getDate() + 1);
        const minDepart = formaterDate(dateArrivee);
        /* Applique à tous les champs de départ */
        [wDepart, rDepart].forEach(el => { if (el) el.min = minDepart; });
      }
    });
  }

  if (wDepart && rDepart) {
    /* Synchronise aussi le départ */
    wDepart.addEventListener('change', () => {
      rDepart.value = wDepart.value;
    });
  }
}


/* ═══════════════════════════════════════════════════════════════════════
   7. WIDGET DE RECHERCHE DE DISPONIBILITÉS
═══════════════════════════════════════════════════════════════════════ */

/**
 * rechercherDisponibilites()
 * Validations les champs du widget de recherche et simule une recherche.
 * En production, enverrait une requête à l'API du serveur.
 */
function rechercherDisponibilites() {
  /* Récupération des valeurs des champs */
  const hotel     = document.getElementById('w-hotel').value;
  const arrivee   = document.getElementById('w-arrivee').value;
  const depart    = document.getElementById('w-depart').value;
  const voyageurs = document.getElementById('w-voyageurs').value;

  /* ── Validation : les dates sont obligatoires ─────────────────────── */
  if (!arrivee || !depart) {
    afficherToast(
      '⚠️ Veuillez sélectionner vos dates d\'arrivée et de départ.',
      'erreur'
    );
    return; /* Arrête l'exécution si validation échoue                    */
  }

  /* ── Validation : date de départ après date d'arrivée ───────────── */
  if (new Date(depart) <= new Date(arrivee)) {
    afficherToast(
      '⚠️ La date de départ doit être après la date d\'arrivée.',
      'erreur'
    );
    return;
  }

  /* ── Construction du message de confirmation ─────────────────────── */
  const nomHotel = hotel
    ? hotel.charAt(0).toUpperCase() + hotel.slice(1) /* Première lettre majuscule */
    : 'tous les hôtels';

  /* Formatage des dates en français (DD/MM/YYYY) */
  const dateArrivee = formaterDate(arrivee);
  const dateDepart  = formaterDate(depart);

  /* Calcul du nombre de nuits */
  const nbNuits = Math.ceil(
    (new Date(depart) - new Date(arrivee)) / (1000 * 60 * 60 * 24)
  );

  /* Affichage du toast de confirmation */
  afficherToast(
    `✓ Recherche lancée · ${nbNuits} nuit(s) · ${voyageurs} voyageur(s) · ${dateArrivee} → ${dateDepart}`,
    'succes'
  );

  /* Défilement vers la section hôtels pour voir les résultats */
  document.getElementById('hotels').scrollIntoView({ behavior: 'smooth' });
}


/* ═══════════════════════════════════════════════════════════════════════
   8. MODAL HÔTEL (DÉTAIL D'UN HÔTEL)
═══════════════════════════════════════════════════════════════════════ */

/**
 * ouvrirHotel(province)
 * Ouvre le modal de détail pour un hôtel donné.
 * @param {string} province - La clé de l'hôtel dans DONNEES_HOTELS
 */
function ouvrirHotel(province) {
  /* Récupère les données de l'hôtel depuis l'objet de données */
  const hotel = DONNEES_HOTELS[province];
  if (!hotel) return; /* Sécurité si la province n'existe pas              */

  /* ── Remplit le modal avec les données de l'hôtel ─────────────────── */

  /* Image de fond du modal */
  document.getElementById('modal-hotel-img').style.backgroundImage
    = `url('${hotel.image}')`;

  /* Province */
  document.getElementById('modal-province').innerHTML
    = `<i class="fa-solid fa-location-dot"></i> ${hotel.province}`;

  /* Nom de l'hôtel */
  document.getElementById('modal-hotel-titre').textContent = hotel.nom;

  /* Description longue */
  document.getElementById('modal-hotel-desc').textContent = hotel.desc;

  /* ── Génération dynamique des badges d'équipements ─────────────────
     Pour chaque équipement dans le tableau, crée un badge HTML          */
  const conteneurEquip = document.getElementById('modal-equip');
  conteneurEquip.innerHTML = ''; /* Vide le contenu précédent              */

  hotel.equip.forEach(item => {
    /* Crée un élément <span> pour chaque équipement */
    const badge = document.createElement('span');
    badge.innerHTML = `<i class="fa-solid fa-check"></i> ${item}`;
    conteneurEquip.appendChild(badge);
  });

  /* ── Affiche le modal ──────────────────────────────────────────────── */
  const modal = document.getElementById('modal-hotel');
  modal.classList.add('actif'); /* La classe 'actif' rend le modal visible */

  /* Empêche le défilement de la page derrière le modal */
  document.body.style.overflow = 'hidden';
}

/**
 * fermerModalHotel(event, forcer)
 * Ferme le modal de détail d'un hôtel.
 * @param {Event|null} event  - L'événement de clic (pour tester si c'est le fond)
 * @param {boolean}   forcer - Si true, ferme sans vérifier l'événement
 */
function fermerModalHotel(event, forcer = false) {
  const modal = document.getElementById('modal-hotel');

  /* Ferme si : forcé OU si le clic est directement sur le fond du modal */
  if (forcer || (event && event.target === modal)) {
    modal.classList.remove('actif'); /* Retire la classe qui rend visible  */
    document.body.style.overflow = ''; /* Restaure le défilement de la page */
  }
}


/* ═══════════════════════════════════════════════════════════════════════
   9. FILTRE DES CHAMBRES
   Affiche/masque les cartes de chambres selon le type sélectionné
═══════════════════════════════════════════════════════════════════════ */

/**
 * filtrerChambres(filtre, bouton)
 * Filtre les cartes de chambres par type.
 * @param {string}      filtre - Le type de chambre à afficher ('tous', 'standard', etc.)
 * @param {HTMLElement} bouton - Le bouton filtre cliqué (pour le style actif)
 */
function filtrerChambres(filtre, bouton) {
  /* ── Met à jour le style des boutons filtre ──────────────────────── */
  /* Retire la classe 'actif' de tous les boutons */
  document.querySelectorAll('.filtre-btn').forEach(btn => {
    btn.classList.remove('actif');
  });
  /* Ajoute 'actif' au bouton cliqué */
  bouton.classList.add('actif');

  /* ── Filtre les cartes de chambres ───────────────────────────────── */
  const cartes = document.querySelectorAll('.carte-chambre');

  cartes.forEach(carte => {
    /* data-type est l'attribut HTML indiquant le type de la chambre */
    const typeChambre = carte.dataset.type;

    if (filtre === 'tous' || typeChambre === filtre) {
      /* Affiche la carte : retire la classe 'masque' */
      carte.classList.remove('masque');
      /* Petite animation d'apparition */
      carte.style.animationDelay = '0.1s';
    } else {
      /* Masque la carte : ajoute la classe 'masque' (display:none en CSS) */
      carte.classList.add('masque');
    }
  });
}


/* ═══════════════════════════════════════════════════════════════════════
   10. MODAL DE DÉTAIL D'UNE CHAMBRE
   S'ouvre quand on clique sur le bouton "Voir la chambre"
═══════════════════════════════════════════════════════════════════════ */

/**
 * ouvrirChambre(event, typeChambre)
 * Affiche un modal avec les détails et photos de la chambre sélectionnée.
 * @param {Event}  event       - L'événement de clic (pour arrêter la propagation)
 * @param {string} typeChambre - La clé du type de chambre dans DONNEES_CHAMBRES
 */
function ouvrirChambre(event, typeChambre) {
  /* Arrête la propagation pour ne pas déclencher d'autres événements */
  event.stopPropagation();

  const chambre = DONNEES_CHAMBRES[typeChambre];
  if (!chambre) return;

  /* ── Crée le modal dynamiquement ─────────────────────────────────── */
  /* Supprime un modal existant s'il y en a déjà un */
  const existant = document.getElementById('modal-chambre-dyn');
  if (existant) existant.remove();

  /* Génère le HTML du carrousel d'images */
  const imagesHTML = chambre.imgs.map((src, idx) => `
    <img
      src="${src}"
      alt="${chambre.nom} - photo ${idx + 1}"
      class="chambre-modal-img ${idx === 0 ? 'active' : ''}"
      data-index="${idx}"
    />
  `).join('');

  /* Génère les indicateurs de position du carrousel */
  const indicateursHTML = chambre.imgs.map((_, idx) => `
    <button
      class="carrousel-dot ${idx === 0 ? 'actif' : ''}"
      onclick="changerSlide(${idx})"
    ></button>
  `).join('');

  /* HTML complet du modal de chambre */
  const modalHTML = `
    <div class="modal-fond actif" id="modal-chambre-dyn"
         onclick="fermerModalChambre(event)">
      <div class="modal-chambre-boite">
        <!-- Bouton fermeture -->
        <button class="modal-fermer" onclick="fermerModalChambre(null, true)">
          <i class="fa-solid fa-xmark"></i>
        </button>

        <!-- Carrousel d'images -->
        <div class="modal-chambre-carrousel" id="carrousel">
          ${imagesHTML}
          <!-- Boutons navigation précédent/suivant -->
          <button class="carr-prev" onclick="naviguerCarrousel(-1)">
            <i class="fa-solid fa-chevron-left"></i>
          </button>
          <button class="carr-next" onclick="naviguerCarrousel(1)">
            <i class="fa-solid fa-chevron-right"></i>
          </button>
          <!-- Indicateurs de position (points) -->
          <div class="carrousel-dots">${indicateursHTML}</div>
        </div>

        <!-- Informations de la chambre -->
        <div class="modal-chambre-info">
          <h3 class="modal-chambre-titre">${chambre.nom}</h3>
          <p class="modal-chambre-desc">${chambre.desc}</p>
          <div class="modal-chambre-prix">
            <span class="cp-montant">${chambre.prix}</span>
            <span class="cp-unite">Ar / nuit</span>
          </div>
          <a href="#reservation" class="btn btn-primaire"
             onclick="fermerModalChambre(null, true)">
            <i class="fa-regular fa-calendar-check"></i>
            Réserver cette chambre
          </a>
        </div>
      </div>
    </div>
  `;

  /* Insère le modal dans le DOM */
  document.body.insertAdjacentHTML('beforeend', modalHTML);
  /* Empêche le défilement de la page */
  document.body.style.overflow = 'hidden';

  /* Ajoute les styles du modal dynamiquement si pas encore dans le CSS */
  ajouterStylesModalChambre();
}

/**
 * ajouterStylesModalChambre()
 * Injecte des styles CSS pour le modal de chambre (créé dynamiquement).
 * Évite de dupliquer si les styles existent déjà.
 */
function ajouterStylesModalChambre() {
  /* Vérifie que les styles n'ont pas déjà été ajoutés */
  if (document.getElementById('styles-modal-chambre')) return;

  const style = document.createElement('style');
  style.id = 'styles-modal-chambre';
  style.textContent = `
    /* Boîte du modal chambre */
    .modal-chambre-boite {
      background: var(--blanc);
      border-radius: 16px;
      max-width: 680px;
      width: 100%;
      overflow: hidden;
      position: relative;
      transform: scale(0.9);
      transition: transform 0.3s ease;
    }
    .modal-fond.actif .modal-chambre-boite { transform: scale(1); }

    /* Carrousel */
    .modal-chambre-carrousel {
      height: 320px;
      position: relative;
      overflow: hidden;
    }

    /* Image du carrousel */
    .chambre-modal-img {
      position: absolute;
      inset: 0;
      width: 100%; height: 100%;
      object-fit: cover;
      opacity: 0;             /* Invisible par défaut */
      transition: opacity 0.5s ease;
    }
    .chambre-modal-img.active { opacity: 1; } /* Image active visible */

    /* Boutons navigation carrousel */
    .carr-prev, .carr-next {
      position: absolute;
      top: 50%; transform: translateY(-50%);
      background: rgba(0,0,0,0.5);
      color: white;
      border: none;
      width: 40px; height: 40px;
      border-radius: 50%;
      font-size: 0.9rem;
      cursor: pointer;
      z-index: 5;
      display: flex; align-items: center; justify-content: center;
      transition: background 0.2s;
    }
    .carr-prev { left: 1rem; }
    .carr-next { right: 1rem; }
    .carr-prev:hover, .carr-next:hover { background: var(--vert); }

    /* Points indicateurs */
    .carrousel-dots {
      position: absolute;
      bottom: 1rem; left: 50%;
      transform: translateX(-50%);
      display: flex; gap: 0.5rem; z-index: 5;
    }
    .carrousel-dot {
      width: 8px; height: 8px;
      border-radius: 50%;
      background: rgba(255,255,255,0.5);
      border: none; cursor: pointer;
      transition: background 0.2s, transform 0.2s;
    }
    .carrousel-dot.actif {
      background: var(--blanc);
      transform: scale(1.3);
    }

    /* Infos de la chambre dans le modal */
    .modal-chambre-info { padding: 1.8rem 2rem; }
    .modal-chambre-titre {
      font-family: var(--font-titre);
      font-size: 1.6rem; font-weight: 700;
      color: var(--texte); margin-bottom: 0.6rem;
    }
    .modal-chambre-desc {
      font-size: 0.88rem; color: var(--discret);
      line-height: 1.7; margin-bottom: 1.2rem;
    }
    .modal-chambre-prix {
      display: flex; align-items: baseline; gap: 0.4rem;
      margin-bottom: 1.5rem;
    }
  `;
  document.head.appendChild(style);
}

/* Indice de la slide active dans le carrousel */
let slideActif = 0;

/**
 * naviguerCarrousel(direction)
 * Navigue dans le carrousel d'images d'une chambre.
 * @param {number} direction - -1 pour précédent, +1 pour suivant
 */
function naviguerCarrousel(direction) {
  /* Récupère toutes les images du carrousel */
  const images = document.querySelectorAll('.chambre-modal-img');
  const total  = images.length;

  if (total === 0) return;

  /* Cache l'image actuelle */
  images[slideActif].classList.remove('active');
  document.querySelectorAll('.carrousel-dot')[slideActif]?.classList.remove('actif');

  /* Calcule le nouvel indice avec retour circulaire (modulo) */
  slideActif = (slideActif + direction + total) % total;

  /* Affiche la nouvelle image */
  images[slideActif].classList.add('active');
  document.querySelectorAll('.carrousel-dot')[slideActif]?.classList.add('actif');
}

/**
 * changerSlide(index)
 * Va directement à une slide spécifique via les points indicateurs.
 * @param {number} index - L'indice de la slide cible
 */
function changerSlide(index) {
  const images = document.querySelectorAll('.chambre-modal-img');

  if (images.length === 0) return;

  /* Cache l'image actuelle */
  images[slideActif].classList.remove('active');
  document.querySelectorAll('.carrousel-dot')[slideActif]?.classList.remove('actif');

  /* Va à l'image ciblée */
  slideActif = index;
  images[slideActif].classList.add('active');
  document.querySelectorAll('.carrousel-dot')[slideActif]?.classList.add('actif');
}

/**
 * fermerModalChambre(event, forcer)
 * Ferme le modal de détail d'une chambre.
 */
function fermerModalChambre(event, forcer = false) {
  const modal = document.getElementById('modal-chambre-dyn');
  if (!modal) return;

  /* Ferme si forcé ou si le clic est sur le fond du modal */
  if (forcer || (event && event.target === modal)) {
    modal.remove(); /* Supprime entièrement le modal du DOM                  */
    document.body.style.overflow = ''; /* Restaure le défilement            */
    slideActif = 0; /* Remet le carrousel à zéro                            */
  }
}


/* ═══════════════════════════════════════════════════════════════════════
   11. FORMULAIRE DE RÉSERVATION
═══════════════════════════════════════════════════════════════════════ */

/**
 * soumettreReservation(event)
 * Gère la soumission du formulaire de réservation.
 * Valide les champs, génère un numéro de réservation et affiche la confirmation.
 * @param {Event} event - L'événement submit du formulaire
 */
async function soumettreReservation(event) {
  /* Empêche le rechargement de la page */
  event.preventDefault();

  /* ── Récupération des valeurs ────────────────────────────────────── */
  const prenom   = document.getElementById('r-prenom').value.trim();
  const nom      = document.getElementById('r-nom').value.trim();
  const email    = document.getElementById('r-email').value.trim();
  const tel      = document.getElementById('r-tel').value.trim();
  const hotel    = document.getElementById('r-hotel').value;
  const arrivee  = document.getElementById('r-arrivee').value;
  const depart   = document.getElementById('r-depart').value;
  const adultes  = document.getElementById('r-adultes').value;
  const enfants  = document.getElementById('r-enfants').value;
  const chambre  = document.getElementById('r-chambre').value;
  const demandes = document.getElementById('r-demandes').value;

  /* ── Validation des champs obligatoires ─────────────────────────── */
  if (!prenom || !nom || !email || !hotel || !arrivee || !depart || !chambre) {
    afficherToast('⚠️ Veuillez remplir tous les champs obligatoires (*).', 'erreur');
    return;
  }

  /* ── Validation email ────────────────────────────────────────────── */
  const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!REGEX_EMAIL.test(email)) {
    afficherToast('⚠️ Veuillez entrer une adresse email valide.', 'erreur');
    return;
  }

  /* ── Validation dates ────────────────────────────────────────────── */
  if (new Date(depart) <= new Date(arrivee)) {
    afficherToast('⚠️ La date de départ doit être après la date d\'arrivée.', 'erreur');
    return;
  }

  /* ── Correspondance hotel texte → hotel_id ───────────────────────── */
  const hotelIds = {
    'tana':      1,
    'tamatave':  2,
    'majunga':   3,
    'fianar':    4,
    'tulear':    5,
    'diego':     6
  };

  /* ── Correspondance chambre texte → chambre_id ───────────────────── */
  const chambreIds = {
    'classique':      1,
    'baobab':         3,
    'vanille':        5,
    'presidentielle': 6
  };

  const hotelId   = hotelIds[hotel]    || 1;
  const chambreId = chambreIds[chambre] || 1;

  /* ── URL API selon environnement ─────────────────────────────────── */
  const API_URL = (window.location.hostname === 'localhost' ||
                   window.location.hostname === '127.0.0.1')
    ? 'http://localhost:5000'
    : 'https://gasikarahotel-api.onrender.com';

  try {
    /* ── Envoie la réservation au backend ────────────────────────────── */
    const response = await fetch(`${API_URL}/api/reservations`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prenom,
        nom,
        email,
        telephone:  tel,
        hotel_id:   hotelId,
        chambre_id: chambreId,
        arrivee,
        depart,
        adultes:    parseInt(adultes)  || 2,
        enfants:    parseInt(enfants)  || 0,
        demandes:   demandes || ''
      })
    });

    const data = await response.json();

    if (data.success) {
      /* ── Affiche la référence reçue du backend ─────────────────────── */
      document.getElementById('confirm-ref').textContent = data.reference;

      /* ── Affiche le modal de confirmation ──────────────────────────── */
      document.getElementById('modal-confirm').classList.add('actif');
      document.body.style.overflow = 'hidden';

      /* ── Réinitialise le formulaire ────────────────────────────────── */
      document.getElementById('form-reserv').reset();

      console.log('✅ Réservation créée :', data.reference);

    } else {
      /* ── Erreur retournée par le backend ───────────────────────────── */
      afficherToast('❌ ' + data.message, 'erreur');
    }

  } catch (erreur) {
    /* ── Erreur réseau (serveur éteint) ────────────────────────────── */
    afficherToast('❌ Impossible de contacter le serveur. Vérifiez que le backend tourne.', 'erreur');
    console.error('Erreur réseau :', erreur);
  }
}


/* ═══════════════════════════════════════════════════════════════════════
   12. MODAL DE CONFIRMATION
═══════════════════════════════════════════════════════════════════════ */

/**
 * fermerConfirm(event, forcer)
 * Ferme le modal de confirmation de réservation.
 */
function fermerConfirm(event, forcer = false) {
  const modal = document.getElementById('modal-confirm');
  if (forcer || (event && event.target === modal)) {
    modal.classList.remove('actif'); /* Cache le modal                      */
    document.body.style.overflow = ''; /* Restaure le défilement            */
  }
}


/* ═══════════════════════════════════════════════════════════════════════
   13. NOTIFICATIONS TOAST
   Petit message qui apparaît en bas de l'écran pendant 3.5 secondes
═══════════════════════════════════════════════════════════════════════ */

/**
 * afficherToast(message, type)
 * Crée et affiche une notification toast dynamique.
 * @param {string} message - Le texte à afficher
 * @param {string} type    - 'succes' (fond vert) ou 'erreur' (fond rouge)
 */
function afficherToast(message, type = 'succes') {
  /* Supprime un toast existant pour éviter les doublons */
  const existant = document.querySelector('.toast');
  if (existant) existant.remove();

  /* Crée l'élément toast */
  const toast = document.createElement('div');
  toast.className = 'toast';

  /* Couleurs selon le type */
  const estErreur = type === 'erreur';
  const couleurFond    = estErreur ? '#3d0a0a' : '#1a3d2b'; /* Fond rouge sombre ou vert sombre */
  const couleurTexte   = estErreur ? '#ff9999' : '#90e4b8'; /* Texte rouge clair ou vert clair  */
  const couleurBordure = estErreur ? '#c55' : 'var(--vert-clair)'; /* Bordure correspondante    */

  /* Application des styles inline (complète le CSS de base .toast) */
  Object.assign(toast.style, {
    background:   couleurFond,
    color:        couleurTexte,
    borderLeft:   `4px solid ${couleurBordure}`,
    padding:      '0.9rem 1.8rem',
    fontSize:     '0.88rem',
    opacity:      '0',            /* Commence invisible                      */
    transform:    'translateX(-50%) translateY(20px)', /* Décalé vers le bas */
    transition:   'opacity 0.4s ease, transform 0.4s ease',
  });

  toast.textContent = message;
  document.body.appendChild(toast); /* Ajoute au DOM                        */

  /* Animation d'entrée (double requestAnimationFrame pour la fluidité) */
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      toast.style.opacity   = '1';
      toast.style.transform = 'translateX(-50%) translateY(0)';
    });
  });

  /* Disparition automatique après 3.5 secondes */
  setTimeout(() => {
    toast.style.opacity   = '0';
    toast.style.transform = 'translateX(-50%) translateY(20px)';
    /* Supprime du DOM après la fin de la transition (400ms) */
    setTimeout(() => {
      if (toast.parentNode) toast.remove();
    }, 400);
  }, 3500);
}


/* ═══════════════════════════════════════════════════════════════════════
   14. UTILITAIRES
═══════════════════════════════════════════════════════════════════════ */

/**
 * formaterDate(dateStr)
 * Convertit une date au format ISO (YYYY-MM-DD) en format français (DD/MM/YYYY).
 * @param {string} dateStr - La date au format YYYY-MM-DD
 * @returns {string} - La date au format DD/MM/YYYY
 */
function formaterDate(dateStr) {
  if (!dateStr) return ''; /* Retourne vide si pas de date                  */
  const [annee, mois, jour] = dateStr.split('-'); /* Découpe la chaîne      */
  return `${jour}/${mois}/${annee}`;              /* Réassemble en français  */
}

/**
 * aller(sectionId)
 * Fait défiler la page vers une section donnée.
 * @param {string} sectionId - L'ID de la section cible
 */
function aller(sectionId) {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' }); /* Défilement fluide    */
  }
}

/**
 * Fermeture des modals avec la touche Échap
 */
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    /* Essaie de fermer chaque type de modal */
    fermerModalHotel(null, true);
    fermerConfirm(null, true);
    fermerModalChambre(null, true);
  }
});


/* ═══════════════════════════════════════════════════════════════════════
   15. INITIALISATION GÉNÉRALE
   Point d'entrée principal : tout commence ici quand la page est chargée.
═══════════════════════════════════════════════════════════════════════ */

/**
 * init()
 * Fonction principale d'initialisation.
 * Est appelée quand le DOM est entièrement chargé (DOMContentLoaded).
 */
function init() {

  /* ── 1. Masque le preloader ──────────────────────────────────────── */
  masquerPreloader();

  /* ── 2. Configure la navigation ────────────────────────────────────
     Écoute le défilement pour mettre à jour la navbar et le lien actif */
  window.addEventListener('scroll', gererScroll, { passive: true });
  /* passive: true améliore la performance du défilement               */

  /* ── 3. Initialise le menu burger mobile ──────────────────────────── */
  initialiserBurger();

  /* ── 4. Lance les animations au scroll ────────────────────────────── */
  initialiserAnimationsScroll();

  /* ── 5. Crée les particules décoratives du hero ───────────────────── */
  creerParticules();

  /* ── 6. Configure les dates minimales des champs ──────────────────── */
  initialiserDates();

  /* ── 7. Appel initial de gererScroll pour l'état de départ ────────── */
  gererScroll();

  /* ── 8. Liaison des boutons des cartes hôtels ─────────────────────── */
  /* Au cas où onclick HTML ne suffirait pas (bonne pratique) */
  document.querySelectorAll('.carte-hotel').forEach(carte => {
    carte.addEventListener('click', () => {
      const province = carte.dataset.province;
      if (province) ouvrirHotel(province);
    });
  });

  /* ── 9. Défilement fluide pour tous les liens d'ancre ─────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(lien => {
    lien.addEventListener('click', (e) => {
      const cible = lien.getAttribute('href');
      /* Évite le "#" seul qui recharge la page */
      if (cible === '#') return;

      const element = document.querySelector(cible);
      if (element) {
        e.preventDefault(); /* Empêche le comportement par défaut          */
        /* Hauteur de la navbar pour ne pas la masquer */
        const hauteurNav = navbar ? navbar.offsetHeight : 70;
        const positionCible = element.getBoundingClientRect().top
                            + window.scrollY - hauteurNav;

        window.scrollTo({ top: positionCible, behavior: 'smooth' });
      }
    });
  });

  /* ── 10. Message de bienvenue dans la console ─────────────────────── */
  console.log(
    '%c🌿 GasikaraHotel%c\n' +
    'Chaîne hôtelière 5 étoiles · Madagascar\n' +
    '6 Provinces · gasikarahotel@gmail.com',
    'color: #2d6a4f; font-size: 1.2rem; font-weight: bold;',
    'color: #7a7268; font-size: 0.9rem;'
  );
}

/* ─────────────────────────────────────────────────────────────────────
   DÉCLENCHEMENT DE L'INITIALISATION
   'DOMContentLoaded' se déclenche quand le HTML est parsé
   (pas besoin d'attendre les images et ressources externes)
───────────────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', init);
