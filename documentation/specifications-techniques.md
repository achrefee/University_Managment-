<div align="center">

# 🔧 Spécifications Techniques

## Système de Gestion Universitaire

**Version 1.0** | **Architecture Microservices**

</div>

---

## 📌 Table des Matières

1. [Architecture Globale](#1-architecture-globale)
2. [Services](#2-services)
3. [Base de Données](#3-base-de-données)
4. [Sécurité](#4-sécurité)
5. [Dépendances](#5-dépendances)

---

## 1. 🏗️ Architecture Globale

```
                              ┌─────────────────────────┐
                              │      🌐 Clients         │
                              │   (Web / Mobile / API)  │
                              └───────────┬─────────────┘
                                          │
                                          ▼
                        ┌─────────────────────────────────┐
                        │        🚪 API GATEWAY           │
                        │         Port: 8080              │
                        │      (Spring Cloud Gateway)     │
                        │  ┌───────────────────────────┐  │
                        │  │ • Routage    • CORS       │  │
                        │  │ • Logging    • Security   │  │
                        │  └───────────────────────────┘  │
                        └───────────────┬─────────────────┘
                                        │
          ┌──────────┬──────────┬───────┼───────┬──────────┐
          ▼          ▼          ▼       ▼       ▼          ▼
    ┌──────────┐┌──────────┐┌──────────┐┌──────────┐┌──────────┐
    │ 🔐 OAuth ││ 🎓 Student││ 📊 Grades││ 📚 Course││ 💰 Factur│
    │   :8081  ││   :3001  ││   :8000  ││   :8082  ││   :8083  │
    │ ┌──────┐ ││ ┌──────┐ ││ ┌──────┐ ││ ┌──────┐ ││ ┌──────┐ │
    │ │Spring│ ││ │Express│ ││ │FastAPI│ ││ │JAX-WS│ ││ │ .NET │ │
    │ └──────┘ ││ └──────┘ ││ └──────┘ ││ └──────┘ ││ └──────┘ │
    └────┬─────┘└────┬─────┘└────┬─────┘└────┬─────┘└────┬─────┘
         │           │           │           │           │
         └───────────┴───────────┼───────────┴───────────┘
                                 ▼
                        ┌─────────────────┐
                        │   🗄️ MongoDB    │
                        │     :27017      │
                        └─────────────────┘
```

---

## 2. 🔌 Services

### 2.1 🔐 OAuth Service

<table>
<tr>
<td width="50%">

#### Informations Générales

| Propriété | Valeur |
|-----------|--------|
| **Framework** | Spring Boot 3.2.0 |
| **Langage** | Java 21 |
| **Port** | 8081 |
| **Protocole** | REST |
| **Base** | MongoDB (oauth_db) |

</td>
<td width="50%">

#### Endpoints

| Méthode | Endpoint | Auth |
|:-------:|----------|:----:|
| `POST` | `/api/auth/register/admin` | ❌ |
| `POST` | `/api/auth/register/student` | ❌ |
| `POST` | `/api/auth/register/professor` | ❌ |
| `POST` | `/api/auth/login` | ❌ |
| `GET` | `/api/auth/validate` | ❌ |

</td>
</tr>
</table>

---

### 2.2 🎓 Student Service

<table>
<tr>
<td width="50%">

#### Informations Générales

| Propriété | Valeur |
|-----------|--------|
| **Framework** | Express.js |
| **Langage** | Node.js 18+ |
| **Port** | 3001 |
| **Protocole** | REST |
| **Base** | MongoDB (student_db) |

</td>
<td width="50%">

#### Endpoints

| Méthode | Endpoint | Auth |
|:-------:|----------|:----:|
| `GET` | `/api/students` | 🔑 Admin |
| `GET` | `/api/students/:id` | 🔑 Admin |
| `POST` | `/api/students` | 🔑 Admin |
| `PUT` | `/api/students/:id` | 🔑 Admin |
| `DELETE` | `/api/students/:id` | 🔑 Admin |

</td>
</tr>
</table>

#### Modèle de Données

```javascript
{
  studentId: String,           // 🆔 Identifiant unique
  email: String,               // 📧 Email (unique)
  firstName: String,           // 👤 Prénom
  lastName: String,            // 👤 Nom
  phoneNumber: String,         // 📱 Téléphone
  dateOfBirth: Date,           // 📅 Date de naissance
  major: String,               // 🎓 Filière
  year: Number,                // 📆 Année d'études
  inscriptionFeeStatus: Enum,  // 💰 'NOT_PAID' | 'PARTIAL' | 'PAID'
  enabled: Boolean             // ✅ Actif
}
```

---

### 2.3 📊 Grades Service

<table>
<tr>
<td width="50%">

#### Informations Générales

| Propriété | Valeur |
|-----------|--------|
| **Framework** | FastAPI |
| **Langage** | Python 3.11+ |
| **Port** | 8000 |
| **Protocole** | REST |
| **Base** | MongoDB (grades_db) |

</td>
<td width="50%">

#### Endpoints

| Méthode | Endpoint | Auth |
|:-------:|----------|:----:|
| `GET` | `/api/grades/health` | ❌ |
| `GET` | `/api/grades/` | 🔑 Student |
| `POST` | `/api/grades/` | 🔑 Prof |
| `PUT` | `/api/grades/:id` | 🔑 Prof |
| `DELETE` | `/api/grades/:id` | 🔑 Prof |

</td>
</tr>
</table>

#### Modèle de Données

```python
{
  "student_id": str,       # 🆔 ID étudiant
  "student_name": str,     # 👤 Nom étudiant
  "course_id": str,        # 📚 ID cours
  "course_name": str,      # 📚 Nom cours
  "grade": float,          # 📊 Note (0-100)
  "semester": str,         # 📅 Semestre
  "professor_id": str,     # 👨‍🏫 ID professeur
  "professor_name": str,   # 👨‍🏫 Nom professeur
  "comments": str          # 💬 Commentaires
}
```

---

### 2.4 📚 Course Service

<table>
<tr>
<td width="50%">

#### Informations Générales

| Propriété | Valeur |
|-----------|--------|
| **Framework** | JAX-WS |
| **Langage** | Java 21 |
| **Port** | 8082 |
| **Protocole** | SOAP/XML |
| **Base** | MongoDB (courses_db) |

</td>
<td width="50%">

#### Opérations SOAP

| Opération | Auth |
|-----------|:----:|
| `getAllCourses` | 🔑 Token |
| `getCourseById` | 🔑 Token |
| `createCourse` | 🔑 Admin |
| `updateCourse` | 🔑 Admin |
| `deleteCourse` | 🔑 Admin |

</td>
</tr>
</table>

---

### 2.5 💰 Facturation Service

<table>
<tr>
<td width="50%">

#### Informations Générales

| Propriété | Valeur |
|-----------|--------|
| **Framework** | SoapCore |
| **Langage** | .NET 8 |
| **Port** | 8083 |
| **Protocole** | SOAP/XML |
| **Base** | MongoDB (facturation_db) |

</td>
<td width="50%">

#### Opérations SOAP

| Opération | Auth |
|-----------|:----:|
| `GetAllFees` | 🔑 Admin |
| `CreateFee` | 🔑 Admin |
| `UpdatePayment` | 🔑 Admin |
| `GetStatistics` | 🔑 Admin |

</td>
</tr>
</table>

---

### 2.6 🚪 API Gateway

<table>
<tr>
<td width="50%">

#### Configuration

| Propriété | Valeur |
|-----------|--------|
| **Framework** | Spring Cloud Gateway |
| **Port** | 8080 |
| **CORS** | Centralisé |
| **Logging** | Activé |

</td>
<td width="50%">

#### Routes

| Route | Backend |
|-------|---------|
| `/api/auth/**` | OAuth :8081 |
| `/api/students/**` | Student :3001 |
| `/api/grades/**` | Grades :8000 |
| `/courses/**` | Course :8082 |
| `/FacturationService.asmx/**` | Factur :8083 |

</td>
</tr>
</table>

#### Headers de Sécurité

```yaml
X-Gateway-Request: true
X-Gateway-Secret: university-gateway-2024
```

---

## 3. 🗄️ Base de Données

### Collections MongoDB

| Service | Base de données | Collection | Documents |
|---------|-----------------|------------|-----------|
| 🔐 OAuth | `oauth_db` | `users` | Utilisateurs |
| 🎓 Student | `student_db` | `students` | Étudiants |
| 📊 Grades | `grades_db` | `grades` | Notes |
| 📚 Course | `courses_db` | `courses` | Cours |
| 💰 Facturation | `facturation_db` | `fees` | Frais |

---

## 4. 🔒 Sécurité

### 4.1 Structure JWT Token

```json
{
  "role": "ROLE_ADMIN",      // 🔑 Rôle utilisateur
  "sub": "user@example.com", // 📧 Email (subject)
  "iat": 1701782400,         // 📅 Issued at
  "exp": 1701868800          // ⏰ Expiration (24h)
}
```

### 4.2 Flux d'Authentification

```
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│  Client  │───▶│ Gateway  │───▶│  OAuth   │───▶│ MongoDB  │
└──────────┘    └──────────┘    └──────────┘    └──────────┘
     │                │               │               │
     │  1. Login      │               │               │
     │───────────────▶│───────────────▶               │
     │                │               │  2. Verify    │
     │                │               │───────────────▶
     │                │               │◀──────────────│
     │  3. JWT Token  │               │               │
     │◀───────────────│◀──────────────│               │
     │                │               │               │
     │  4. Request    │               │               │
     │  + Bearer Token│               │               │
     │───────────────▶│  5. Validate  │               │
     │                │───────────────▶               │
     │                │◀──────────────│               │
     │  6. Response   │               │               │
     │◀───────────────│               │               │
```

---

## 5. 📦 Dépendances

### ☕ Java (Maven)

```xml
<dependencies>
  <dependency>spring-boot-starter:3.2.0</dependency>
  <dependency>spring-cloud-gateway:2023.0.0</dependency>
  <dependency>mongodb-driver:4.11.1</dependency>
  <dependency>jjwt:0.12.3</dependency>
</dependencies>
```

### 🟢 Node.js (npm)

```json
{
  "express": "^4.18.0",
  "mongoose": "^8.0.0",
  "axios": "^1.6.0",
  "jsonwebtoken": "^9.0.0"
}
```

### 🐍 Python (pip)

```txt
fastapi==0.104.0
motor==3.3.0
httpx==0.25.0
python-jose==3.3.0
```

### 🔷 .NET (NuGet)

```xml
<PackageReference Include="SoapCore" Version="1.1.0" />
<PackageReference Include="MongoDB.Driver" Version="2.22.0" />
```

---

<div align="center">

*© 2024 - Système de Gestion Universitaire*

</div>
