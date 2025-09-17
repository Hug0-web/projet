# 📇 Contacts & Users API

API RESTful développée en **Node.js / Express** avec **MongoDB**, permettant :

- la **gestion des utilisateurs** (inscription, connexion, mise à jour, suppression, logout)
- la **gestion des contacts** liés à chaque utilisateur

La documentation interactive est disponible via **Swagger UI**.

---

## 🚀 Fonctionnalités principales

### Utilisateurs
- **POST** `/users/register` : inscription (email + mot de passe)
- **POST** `/users/login` : connexion avec retour d’un JWT
- **GET** `/users/{id}` : récupérer les informations d’un utilisateur
- **PATCH** `/users/{id}` : mettre à jour les informations d’un utilisateur
- **DELETE** `/users/{id}` : supprimer un utilisateur
- **POST** `/logout` : déconnexion (suppression du cookie `token` ou blacklist optionnelle)

### Contacts
- **GET** `/contact/{id}` : lister les contacts d’un utilisateur
- **POST** `/contact/{id}/create` : créer un contact pour l’utilisateur
- **PATCH** `/contact/{userId}/update/{contactId}` : mettre à jour un contact
- **DELETE** `/contact/{userId}/delete/{contactId}` : supprimer un contact

---

## 🛠️ Stack Technique

- **Node.js / Express**
- **MongoDB & Mongoose**
- **JWT** pour l’authentification
- **bcrypt** pour le hash des mots de passe
- **Swagger UI** pour la documentation
- **Jest + Supertest** pour les tests d’intégration
- **mongodb-memory-server** pour une base en mémoire durant les tests

