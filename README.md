# 🤖 Bot Discord Utilitaire

Un bot Discord polyvalent offrant diverses fonctionnalités de modération et d'utilité pour votre serveur.

## ✨ Fonctionnalités

- 🛡️ **Modération**
  - `/ban`: Bannir des utilisateurs
  - `/clear`: Nettoyer les messages d'un salon
- 👥 **Gestion des utilisateurs**
  - `/verify`: Système de vérification des membres
  - `/user`: Afficher les informations d'un utilisateur
  - `/activite`: Voir l'activité en cours d'un utilisateur
- 📢 **Communication**
  - `/annonce`: Créer des annonces
  - `/suggestion`: Système de suggestions
- ℹ️ **Utilitaires**
  - `/ping`: Vérifier la latence du bot
  - `/info`: Voir les informations du bot

## 🚀 Installation

1. Clonez le repository

```bash
git clone https://github.com/N0tFond/Bot_Server.git
cd Bot_Server
```

2. Installez les dépendances

```bash
npm install
```

3. Configurez le fichier `.env`

```env
TOKEN=votre_token_discord
APP_ID=votre_app_id
PUBLIC_KEY=votre_public_key
STAFF_ROLE=id_role_staff

# Personnalisation
FOOTER_MSG="Développé par VotreNom"
COLOR_WARN=FFBF18
COLOR_SUCCESS=90955C
COLOR_ERROR=D12128
COLOR_INFO=5E7381
```

4. Démarrez le bot

```bash
npm run start
```

## 📋 Prérequis

- Node.js v16.x ou supérieur
- npm v7.x ou supérieur
- Un compte Discord développeur
- Un serveur Discord pour tester le bot

## 🛠️ Technologies utilisées

- [Discord.js](https://discord.js.org/) v14.19.2
- dotenv v16.5.0
- moment v2.30.1

## 📄 Licence

Ce projet est sous licence propriétaire. Voir le fichier [LICENCE](./LICENCE) pour plus de détails.

## 👥 Contribution

Ce projet est privé et ne prend pas de contributions externes pour le moment.

## 🔗 Liens utiles

- [Documentation Discord.js](https://discord.js.org/)
- [Portail Développeur Discord](https://discord.com/developers/applications)
