<div align="center">

# 📋 Cahier des Charges

## Système de Gestion Universitaire

**Version 1.0** | **Décembre 2024**

---

*Architecture Microservices avec API Gateway*

</div>

---

## 📌 Table des Matières

1. [Présentation du Projet](#1-présentation-du-projet)
2. [Acteurs du Système](#2-acteurs-du-système)
3. [Fonctionnalités](#3-fonctionnalités)
4. [Exigences Non-Fonctionnelles](#4-exigences-non-fonctionnelles)
5. [Contraintes Techniques](#5-contraintes-techniques)
6. [Livrables](#6-livrables)

---

## 1. 🎯 Présentation du Projet

### 1.1 Contexte

> Développement d'un **système de gestion universitaire** moderne basé sur une architecture **microservices** pour gérer efficacement les étudiants, les cours, les notes et la facturation.

### 1.2 Objectifs Principaux

| # | Objectif | Priorité |
|:-:|----------|:--------:|
| 1 | Centraliser la gestion des données universitaires | 🔴 Haute |
| 2 | Assurer une authentification sécurisée via OAuth/JWT | 🔴 Haute |
| 3 | Permettre une communication inter-services via API Gateway | 🔴 Haute |
| 4 | Offrir une interface uniforme pour tous les acteurs | 🟡 Moyenne |
| 5 | Garantir la scalabilité et la maintenabilité | 🟡 Moyenne |

---

## 2. 👥 Acteurs du Système

<table>
<tr>
<td width="33%" align="center">

### 🔑 Administrateur

**Gestion complète**

- ✅ CRUD Étudiants
- ✅ CRUD Cours
- ✅ Gestion Factures
- ✅ Toutes permissions

</td>
<td width="33%" align="center">

### 👨‍🏫 Professeur

**Gestion pédagogique**

- ✅ Créer des notes
- ✅ Modifier des notes
- ✅ Voir ses cours
- ❌ Gérer étudiants

</td>
<td width="33%" align="center">

### 🎓 Étudiant

**Consultation**

- ✅ Voir ses notes
- ✅ Voir ses cours
- ❌ Modifications
- ❌ Administration

</td>
</tr>
</table>

---

## 3. 📦 Fonctionnalités

### 3.1 🔐 Service OAuth (Authentification)

| Code | Fonctionnalité | Description |
|:----:|----------------|-------------|
| FR-01 | Inscription | Création de compte (Admin/Prof/Étudiant) |
| FR-02 | Connexion | Authentification email/mot de passe |
| FR-03 | Token JWT | Génération et validation de tokens |
| FR-04 | Rôles | Gestion des permissions par rôle |

### 3.2 🎓 Service Étudiant

| Code | Fonctionnalité | Description |
|:----:|----------------|-------------|
| FR-05 | Créer | Création d'un profil étudiant |
| FR-06 | Lister | Consultation de la liste des étudiants |
| FR-07 | Modifier | Modification des informations |
| FR-08 | Frais | Gestion du statut des frais d'inscription |
| FR-09 | Supprimer | Suppression d'un étudiant |

### 3.3 📊 Service Notes

| Code | Fonctionnalité | Description |
|:----:|----------------|-------------|
| FR-10 | Saisie | Saisie des notes par les professeurs |
| FR-11 | Consultation | Consultation par les étudiants |
| FR-12 | Modification | Modification/Suppression des notes |
| FR-13 | Statistiques | Stats par cours/étudiant |

### 3.4 📚 Service Cours

| Code | Fonctionnalité | Description |
|:----:|----------------|-------------|
| FR-14 | Création | Création de cours avec EDT |
| FR-15 | Horaires | Gestion des créneaux horaires |
| FR-16 | Affectation | Affectation professeurs aux cours |
| FR-17 | Inscription | Inscription étudiants aux cours |

### 3.5 💰 Service Facturation

| Code | Fonctionnalité | Description |
|:----:|----------------|-------------|
| FR-18 | Frais | Création des frais d'inscription |
| FR-19 | Paiements | Suivi des paiements |
| FR-20 | Stats | Génération de statistiques |

### 3.6 🌐 API Gateway

| Code | Fonctionnalité | Description |
|:----:|----------------|-------------|
| FR-21 | Routage | Routage centralisé des requêtes |
| FR-22 | CORS | Gestion CORS centralisée |
| FR-23 | Logging | Logging des requêtes |
| FR-24 | Sécurité | Vérification origine des requêtes |

---

## 4. ⚙️ Exigences Non-Fonctionnelles

### 4.1 🚀 Performance

```
┌────────────────────────────────────────┐
│  ⏱️  Temps de réponse < 200ms          │
│  👥 Support 100 utilisateurs simultanés │
│  📈 Scalabilité horizontale possible    │
└────────────────────────────────────────┘
```

### 4.2 🔒 Sécurité

```
┌────────────────────────────────────────┐
│  🔑 Authentification JWT obligatoire   │
│  🌐 Communication via Gateway uniquement│
│  🔐 Chiffrement BCrypt des mots de passe│
└────────────────────────────────────────┘
```

### 4.3 📊 Disponibilité & Maintenabilité

| Critère | Objectif |
|---------|----------|
| Disponibilité | 99% |
| Health Check | Chaque service |
| Architecture | Microservices découplés |
| Documentation | API complète |
| Tests | Automatisés |

---

## 5. 🛠️ Contraintes Techniques

| Composant | Technologie |
|-----------|-------------|
| 🗄️ Base de données | MongoDB |
| 🔑 Authentification | JWT (HS384) |
| 🌐 Protocoles | REST + SOAP |
| 🚪 Gateway | Spring Cloud Gateway |
| ☕ Backend Java | Spring Boot 3.2 |
| 🟢 Backend Node | Express.js |
| 🐍 Backend Python | FastAPI |
| 🔷 Backend .NET | .NET 8 |

---

## 6. 📦 Livrables

<table>
<tr>
<td>

### 📁 Code

- [x] Microservices complets
- [x] API Gateway
- [x] Tests automatisés

</td>
<td>

### 📚 Documentation

- [x] Cahier des charges
- [x] Spécifications techniques
- [x] Manuel d'utilisation

</td>
<td>

### 🧪 Tests

- [x] Collection Postman
- [x] Scripts Node.js
- [x] Tests d'intégration

</td>
</tr>
</table>

---

<div align="center">

**📅 Planning**

| Phase | Durée |
|-------|-------|
| Conception | 1 semaine |
| Développement | 3 semaines |
| Tests | 1 semaine |
| Documentation | 3 jours |

---

*© 2024 - Système de Gestion Universitaire*

</div>
