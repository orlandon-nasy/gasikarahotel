# 🏨 GasikaraHotel — Site de Réservation Hôtelière Madagascar

![GitHub last commit](https://img.shields.io/github/last-commit/orlandon-nasy/gasikarahotel)
![GitHub repo size](https://img.shields.io/github/repo-size/orlandon-nasy/gasikarahotel)

## 📌 Description

GasikaraHotel est une application web de réservation hôtelière dédiée à Madagascar.
Elle permet aux clients de consulter les chambres disponibles, effectuer des réservations
en ligne, et aux administrateurs de gérer l'hôtel via un tableau de bord complet.

## 🚀 Fonctionnalités

- 🛏️ Consultation des chambres disponibles
- 📅 Réservation en ligne avec sélection de dates
- 👤 Inscription et connexion des clients
- 🔐 Espace administrateur (gestion chambres, réservations, clients)
- 📊 Tableau de bord avec statistiques

## 🛠️ Technologies utilisées

| Côté | Technologies |
|------|-------------|
| Frontend | HTML, CSS, JavaScript |
| Backend | Node.js, Express.js |
| Base de données | MySQL |
| Authentification | JWT (JSON Web Token) |
| Déploiement | GitHub Pages + Render + Railway |

## 📁 Structure du projet

RESERVATION-HOTEL/
├── frontend/        # Interface client (HTML/CSS/JS)
├── backend/         # API REST Node.js/Express
├── admin/           # Tableau de bord administrateur
├── img/             # Images de l'hôtel
└── .gitignore

## 🌐 Démo en ligne

- 🔵 **Frontend** : [Voir le site](https://orlandon-nasy.github.io/gasikarahotel/frontend/)
- 🟢 **Backend API** : [Voir l'API](https://gasikarahotel.onrender.com)

## ⚙️ Installation locale

### Prérequis
- Node.js v18+
- MySQL
- Git

### Étapes

```bash
# 1. Cloner le dépôt
git clone https://github.com/orlandon-nasy/gasikarahotel.git
cd gasikarahotel

# 2. Installer les dépendances backend
cd backend
npm install

# 3. Configurer les variables d'environnement
cp .env.example .env
# Remplis les valeurs dans .env

# 4. Lancer le backend
npm start

# 5. Ouvrir le frontend
# Ouvre frontend/index.html dans ton navigateur
```

## 🔑 Variables d'environnement

Crée un fichier `.env` dans le dossier `backend/` :

```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=gasikarahotel
DB_USER=root
DB_PASSWORD=ton_mot_de_passe
JWT_SECRET=ton_secret_jwt
PORT=3000
```

## 👨‍💻 Auteur

**Orlandon NASY**
- GitHub : [@orlandon-nasy](https://github.com/orlandon-nasy)
- Email : rodinalandon@gmail.com

## 📄 Licence

Ce projet est réalisé dans le cadre d'un projet académique.
