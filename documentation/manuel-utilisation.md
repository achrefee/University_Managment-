<div align="center">

# 📖 Manuel d'Utilisation

## Système de Gestion Universitaire

**Guide Complet de Démarrage et d'Utilisation**

</div>

---

## 📌 Table des Matières

1. [Prérequis](#1-prérequis)
2. [Installation](#2-installation)
3. [Démarrage des Services](#3-démarrage-des-services)
4. [Utilisation par Rôle](#4-utilisation-par-rôle)
5. [API Endpoints](#5-api-endpoints)
6. [Dépannage](#6-dépannage)

---

## 1. 📋 Prérequis

### Logiciels Requis

| Logiciel | Version | Vérification |
|----------|---------|--------------|
| ☕ Java | 21+ | `java -version` |
| 🟢 Node.js | 18+ | `node -v` |
| 🐍 Python | 3.11+ | `python --version` |
| 🔷 .NET | 8+ | `dotnet --version` |
| 🗄️ MongoDB | 6+ | `mongod --version` |
| 📦 Maven | 3.9+ | `mvn -v` |

### Ports Utilisés

```
┌────────────────────────────────────────────┐
│  Port   │  Service                         │
├─────────┼──────────────────────────────────┤
│  8080   │  🚪 API Gateway                  │
│  8081   │  🔐 OAuth Service                │
│  3001   │  🎓 Student Service              │
│  8000   │  📊 Grades Service               │
│  8082   │  📚 Course Service               │
│  8083   │  💰 Facturation Service          │
│  27017  │  🗄️ MongoDB                      │
└─────────┴──────────────────────────────────┘
```

---

## 2. 📥 Installation

### Cloner le projet

```bash
git clone <repository-url>
cd university_managment
```

### Installer les dépendances

```bash
# 🟢 Student Service
cd student_service && npm install

# 🐍 Grades Service  
cd grades_service && pip install -r requirements.txt

# 🧪 Tests
cd test && npm install
```

---

## 3. 🚀 Démarrage des Services

### ⚠️ Ordre de démarrage important

```
1️⃣ MongoDB
2️⃣ API Gateway
3️⃣ OAuth Service
4️⃣ Student Service
5️⃣ Grades Service
6️⃣ Course Service
7️⃣ Facturation Service
```

### Commandes de démarrage

<table>
<tr>
<td width="50%">

#### 🗄️ MongoDB
```bash
mongod --dbpath /data/db
```

#### 🚪 API Gateway
```bash
cd api_gateway
mvn spring-boot:run
```

#### 🔐 OAuth Service
```bash
cd oauth_service/oauth
mvn spring-boot:run
```

</td>
<td width="50%">

#### 🎓 Student Service
```bash
cd student_service
npm start
```

#### 📊 Grades Service
```bash
cd grades_service
python run.py
```

#### 📚 Course Service
```bash
cd cours_emploi_service
mvn exec:java -Dexec.mainClass="com.university.cours.CourseServicePublisher"
```

</td>
</tr>
</table>

#### 💰 Facturation Service
```bash
cd facturation_service
dotnet run
```

### ✅ Vérification

```bash
# Health Check Gateway
curl http://localhost:8080/actuator/health

# Réponse attendue
{"status":"UP"}
```

---

## 4. 👥 Utilisation par Rôle

### 🔑 Administrateur

<table>
<tr>
<td width="40%">

**Connexion**
```json
POST /api/auth/login

{
  "email": "admin@test.com",
  "password": "Admin123!"
}
```

</td>
<td width="60%">

**Permissions**
| Action | Disponible |
|--------|:----------:|
| Gérer les étudiants | ✅ |
| Gérer les cours | ✅ |
| Gérer les factures | ✅ |
| Voir toutes les notes | ✅ |

</td>
</tr>
</table>

---

### 👨‍🏫 Professeur

<table>
<tr>
<td width="40%">

**Connexion**
```json
POST /api/auth/login

{
  "email": "professor@test.com",
  "password": "Professor123!"
}
```

</td>
<td width="60%">

**Permissions**
| Action | Disponible |
|--------|:----------:|
| Créer des notes | ✅ |
| Modifier des notes | ✅ |
| Voir ses cours | ✅ |
| Gérer les étudiants | ❌ |

</td>
</tr>
</table>

---

### 🎓 Étudiant

<table>
<tr>
<td width="40%">

**Connexion**
```json
POST /api/auth/login

{
  "email": "student@test.com",
  "password": "Student123!"
}
```

</td>
<td width="60%">

**Permissions**
| Action | Disponible |
|--------|:----------:|
| Voir ses notes | ✅ |
| Voir ses cours | ✅ |
| Modifier des données | ❌ |
| Administration | ❌ |

</td>
</tr>
</table>

---

## 5. 🌐 API Endpoints

### Référence Rapide

| Service | Endpoint | Méthodes | Auth |
|---------|----------|----------|:----:|
| 🔐 OAuth | `/api/auth/login` | POST | ❌ |
| 🔐 OAuth | `/api/auth/register/*` | POST | ❌ |
| 🔐 OAuth | `/api/auth/validate` | GET | ❌ |
| 🎓 Student | `/api/students` | CRUD | 🔑 Admin |
| 📊 Grades | `/api/grades/health` | GET | ❌ |
| 📊 Grades | `/api/grades/` | GET | 🔑 Any |
| 📊 Grades | `/api/grades/` | POST/PUT/DEL | 🔑 Prof |
| 📚 Course | `/courses` | SOAP | 🔑 Token |
| 💰 Factur | `/FacturationService.asmx` | SOAP | 🔑 Admin |

### Exemples d'utilisation

#### Créer un étudiant
```bash
curl -X POST http://localhost:8080/api/students \
  -H "Authorization: Bearer <admin_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "studentId": "STU001",
    "email": "alice@university.com",
    "firstName": "Alice",
    "lastName": "Johnson",
    "major": "Computer Science"
  }'
```

#### Créer une note
```bash
curl -X POST http://localhost:8080/api/grades/ \
  -H "Authorization: Bearer <professor_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "student_id": "STU001",
    "course_id": "CS101",
    "grade": 85.5
  }'
```

---

## 6. 🔧 Dépannage

### ❌ Erreurs Courantes

<table>
<tr>
<td width="20%">

**Code**

</td>
<td width="35%">

**Cause**

</td>
<td width="45%">

**Solution**

</td>
</tr>
<tr>
<td>

`401`

</td>
<td>

Token manquant ou expiré

</td>
<td>

Reconnectez-vous pour obtenir un nouveau token

</td>
</tr>
<tr>
<td>

`403`

</td>
<td>

Permissions insuffisantes ou accès direct

</td>
<td>

Vérifiez votre rôle et passez par le Gateway (port 8080)

</td>
</tr>
<tr>
<td>

`500`

</td>
<td>

Erreur serveur

</td>
<td>

Vérifiez que MongoDB est démarré et consultez les logs

</td>
</tr>
<tr>
<td>

`ECONNREFUSED`

</td>
<td>

Service non accessible

</td>
<td>

Vérifiez que le service est démarré sur le bon port

</td>
</tr>
</table>

### 🔍 Vérifier les ports

```bash
# Windows
netstat -an | findstr "8080 8081 3001 8000 8082 8083"

# Linux/Mac
netstat -an | grep -E "8080|8081|3001|8000|8082|8083"
```

### 📊 Tests automatisés

```bash
cd test

# Tests complets
npm test

# Tests via Gateway uniquement
npm run test:gateway

# Vérification architecture
npm run test:interconnection
```

---

## 📁 Structure du Projet

```
university_managment/
│
├── 🚪 api_gateway/              # Spring Cloud Gateway
│
├── 🔐 oauth_service/            # Authentification
│   └── oauth/                   # Spring Boot
│
├── 🎓 student_service/          # Gestion étudiants
│   └── src/                     # Express.js
│
├── 📊 grades_service/           # Gestion notes
│   └── app/                     # FastAPI
│
├── 📚 cours_emploi_service/     # Gestion cours
│   └── src/                     # JAX-WS SOAP
│
├── 💰 facturation_service/      # Facturation
│   └── Services/                # .NET SOAP
│
├── 🧪 test/                     # Tests d'intégration
│   ├── test-all.js
│   ├── test-gateway.js
│   └── test-interconnection.js
│
├── 📚 documentation/            # Documentation
│   ├── cahier-des-charges.md
│   ├── specifications-techniques.md
│   └── manuel-utilisation.md
│
└── 📖 docs/
    └── POSTMAN_TESTING_GUIDE.md
```

---

<div align="center">

### 📞 Support

En cas de problème :
1. Consultez les logs des services
2. Vérifiez la documentation technique
3. Exécutez les tests d'interconnexion

---

*© 2024 - Système de Gestion Universitaire*

</div>
