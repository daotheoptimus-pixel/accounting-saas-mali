# Accounting SaaS Mali

Une solution SaaS complète de comptabilité conçue spécifiquement pour les entreprises au Mali.

## 🎯 Fonctionnalités Principales

- **Gestion des Factures** : Créer, éditer et gérer les factures
- **Suivi des Dépenses** : Enregistrer et catégoriser les dépenses
- **Rapports Financiers** : Générer des rapports détaillés
- **Gestion des Clients** : Maintenir une base de données client
- **Gestion des Fournisseurs** : Suivre les fournisseurs et les paiements
- **Tableaux de Bord** : Visualiser les métriques clés
- **Multi-devise** : Support pour XOF et autres devises
- **Audit Trail** : Journalisation complète des modifications

## 🛠️ Stack Technologique

### Frontend
- **React 18** - Interface utilisateur
- **TypeScript** - Typage statique
- **Vite** - Bundler moderne
- **React Router** - Navigation
- **Zustand** - État global

### Backend (À venir)
- **Node.js + Express**
- **PostgreSQL** - Base de données
- **Prisma** - ORM
- **JWT** - Authentification

## 📦 Installation

```bash
npm install
```

## 🚀 Démarrage

### Mode Développement
```bash
npm run dev
```

### Build Production
```bash
npm run build
```

## 📝 Scripts Disponibles

- `npm run dev` - Démarrer le serveur de développement
- `npm run build` - Construire pour la production
- `npm run test` - Exécuter les tests
- `npm run lint` - Vérifier le code
- `npm run format` - Formater le code
- `npm run typecheck` - Vérifier les types TypeScript

## 📂 Structure du Projet

```
.
├── src/
│   ├── components/      # Composants React réutilisables
│   ├── pages/          # Pages de l'application
│   ├── hooks/          # Hooks personnalisés
│   ├── stores/         # État Zustand
│   ├── services/       # Services API
│   ├── types/          # Définitions TypeScript
│   ├── utils/          # Utilitaires
│   ├── App.tsx         # Composant principal
│   └── main.tsx        # Point d'entrée
├── public/             # Assets statiques
├── tests/              # Tests unitaires et intégration
├── vite.config.ts      # Configuration Vite
├── tsconfig.json       # Configuration TypeScript
├── package.json        # Dépendances du projet
└── README.md           # Ce fichier
```

## 🔐 Sécurité

- Validation des inputs avec Zod
- HTTPS en production
- CORS configuré
- Authentification JWT
- Chiffrement des données sensibles

## 📄 Conformité

- Conforme aux normes comptables maliennes
- RGPD compatible
- Audit trail complet
- Rapports fiscaux

## 🤝 Contribution

Les contributions sont les bienvenues ! Veuillez créer une branche pour chaque fonctionnalité.

## 📧 Contact

Pour toute question, contactez : daotheoptimus-pixel

## 📄 License

MIT License - Voir LICENSE pour plus de détails
