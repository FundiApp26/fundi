# FUNDI MVP - Plan Technique Complet

> **Objectif** : Application mobile de gestion de tontines fonctionnelle en **6 semaines**
> **Taux de conversion** : 1 EUR = 655,957 XAF (taux fixe CFA)

---

## Table des matières

1. [Architecture Générale](#1-architecture-générale)
2. [Frontend Mobile](#2-frontend-mobile)
3. [Backend API](#3-backend-api)
4. [Intégration Frontend-Backend](#4-intégration-frontend-backend)
5. [Infrastructure & Déploiement](#5-infrastructure--déploiement)
6. [Planning 6 Semaines](#6-planning-6-semaines)
7. [Budget & Coûts](#7-budget--coûts)

---

## 1. Architecture Générale

```
┌─────────────────┐     HTTPS/WSS      ┌──────────────────────┐
│   App Mobile    │◄──────────────────► │   Nginx Reverse      │
│  (Ionic/Angular)│                     │   Proxy (Docker)     │
└─────────────────┘                     └──────────┬───────────┘
                                                   │
                              ┌─────────────────────┼─────────────────────┐
                              │                     │                     │
                    ┌─────────▼──────┐  ┌───────────▼────────┐  ┌────────▼────────┐
                    │  API REST      │  │  WebSocket Server  │  │  Worker Jobs    │
                    │  (Node/Express)│  │  (Socket.io)       │  │  (Bull Queue)   │
                    └─────────┬──────┘  └───────────┬────────┘  └────────┬────────┘
                              │                     │                     │
                    ┌─────────▼─────────────────────▼─────────────────────▼────────┐
                    │                        Redis                                 │
                    │              (Cache, Sessions, Queue, Pub/Sub)               │
                    └─────────────────────────────┬────────────────────────────────┘
                                                  │
                    ┌─────────────────────────────▼────────────────────────────────┐
                    │                      PostgreSQL                              │
                    │              (Données utilisateurs, tontines,                │
                    │               transactions, messages)                        │
                    └──────────────────────────────────────────────────────────────┘

Services externes :
  ├── Dohone API (paiements OM / MOMO)
  ├── Brevo (emails transactionnels)
  ├── Camoo SMS / Orange SMS API (vérification OTP)
  └── Google AdMob (publicités vidéo)
```

**Choix technologiques justifiés** :

| Composant | Technologie | Justification |
|-----------|------------|---------------|
| Mobile | Ionic + Angular + Capacitor | Un seul codebase web/iOS/Android, réutilise les compétences HTML/CSS/TS, plugins natifs via Capacitor |
| API | Node.js + Express | Performances I/O, même langage que le front, large communauté |
| BDD | PostgreSQL | ACID, relations complexes (tontines, tours, paiements), JSON support |
| Cache/Queue | Redis | Sessions, cache, pub/sub pour le temps réel, file de jobs |
| Temps réel | Socket.io | Messagerie instantanée, notifications live |
| Conteneurs | Docker + Docker Compose | Déploiement reproductible, isolation des services |

---

## 2. Frontend Mobile

### 2.1 Stack Technique

- **Framework** : Ionic 8 + Angular 17+ + Capacitor 6
- **Navigation** : Angular Router + Ionic Navigation (ion-router-outlet, Tabs)
- **State Management** : NgRx SignalStore (léger, réactif, signals Angular)
- **Requêtes API** : Angular HttpClient + interceptors (auth, retry)
- **WebSocket** : Socket.io-client (via service Angular injectable)
- **UI Kit** : Ionic Components (ion-card, ion-list, ion-modal, etc.) + composants custom
- **Stockage local** : Capacitor Preferences (clé/valeur) + @capacitor/secure-storage (tokens)
- **Caméra** : @capacitor/camera (photo, vidéo, galerie)
- **Notifications** : @capacitor/push-notifications (FCM Android / APNs iOS)
- **Build natif** : Capacitor 6 (bridge web → natif iOS/Android)

### 2.2 Structure du Projet (MVP)

```
src/
├── app/
│   ├── app.routes.ts                          # Routes principales (lazy-loaded)
│   ├── app.component.ts                       # Composant racine
│   │
│   ├── pages/
│   │   ├── onboarding/
│   │   │   ├── splash/splash.page.ts          # Logo + animation
│   │   │   ├── welcome/welcome.page.ts        # 4 slides (ion-slides)
│   │   │   ├── phone-verify/phone-verify.page.ts  # Saisie numéro + OTP
│   │   │   ├── profile-setup/profile-setup.page.ts # Nom + photo de profil
│   │   │   └── momo-setup/momo-setup.page.ts  # Numéros OM/MOMO + mot de passe
│   │   │
│   │   ├── tabs/
│   │   │   ├── tabs.page.ts                   # Layout onglets (ion-tabs)
│   │   │   ├── cotisations/cotisations.page.ts    # Liste groupes cotisations
│   │   │   ├── discussions/discussions.page.ts    # Liste conversations
│   │   │   └── menu/menu.page.ts              # Menu hamburger
│   │   │
│   │   ├── cotisation/
│   │   │   ├── create/create.page.ts          # Formulaire création
│   │   │   ├── chat/chat.page.ts              # Messagerie du groupe
│   │   │   ├── members-list/members-list.page.ts  # Liste membres + tours
│   │   │   ├── payment-tracking/payment-tracking.page.ts  # Suivi paiements par tour
│   │   │   ├── calendar/calendar.page.ts      # Calendrier des cotisations
│   │   │   ├── payment-form/payment-form.page.ts  # Formulaire envoi d'argent
│   │   │   ├── manual-payment/manual-payment.page.ts  # Déclaration paiement externe
│   │   │   └── history/history.page.ts        # Historique tours précédents
│   │   │
│   │   ├── discussion/
│   │   │   ├── chat/chat.page.ts              # Conversation 1-to-1
│   │   │   └── send-money/send-money.page.ts  # Envoi d'argent direct
│   │   │
│   │   ├── profile/
│   │   │   ├── my-profile/my-profile.page.ts  # Mon profil
│   │   │   ├── user-profile/user-profile.page.ts  # Profil autre utilisateur
│   │   │   └── edit-profile/edit-profile.page.ts  # Modification profil
│   │   │
│   │   └── premium/
│   │       ├── premium/premium.page.ts        # Offre premium
│   │       └── ad-reward/ad-reward.page.ts    # Visionnage pub = 3 envois
│   │
│   ├── components/
│   │   ├── chat/
│   │   │   ├── message-bubble/message-bubble.component.ts
│   │   │   ├── message-input/message-input.component.ts
│   │   │   ├── media-picker/media-picker.component.ts   # Photo/vidéo preuves
│   │   │   └── system-message/system-message.component.ts  # "X a mis à jour..."
│   │   │
│   │   ├── cotisation/
│   │   │   ├── tour-table/tour-table.component.ts        # Tableau des tours
│   │   │   ├── payment-status-badge/payment-status-badge.component.ts
│   │   │   ├── cotisation-card/cotisation-card.component.ts
│   │   │   └── time-picker/time-picker.component.ts      # Montre analogique
│   │   │
│   │   └── common/
│   │       ├── avatar/avatar.component.ts
│   │       ├── invite-link/invite-link.component.ts
│   │       └── operator-selector/operator-selector.component.ts  # Choix OM/MOMO
│   │
│   ├── services/
│   │   ├── api.service.ts                     # HttpClient configuré + interceptors
│   │   ├── socket.service.ts                  # Connexion Socket.io
│   │   ├── auth.service.ts                    # Authentification + tokens
│   │   ├── notification.service.ts            # Push notifications Capacitor
│   │   └── storage.service.ts                 # Capacitor Preferences wrapper
│   │
│   ├── store/
│   │   ├── auth.store.ts                      # SignalStore auth
│   │   ├── chat.store.ts                      # SignalStore messages
│   │   └── cotisation.store.ts                # SignalStore cotisations
│   │
│   ├── guards/
│   │   ├── auth.guard.ts                      # Protection routes authentifiées
│   │   └── premium.guard.ts                   # Vérification limites free
│   │
│   ├── interceptors/
│   │   ├── auth.interceptor.ts                # Injection JWT dans les headers
│   │   └── error.interceptor.ts               # Gestion erreurs globale
│   │
│   └── utils/
│       ├── format-currency.ts                 # Formatage XAF
│       ├── date-helpers.ts                    # Calcul périodicité
│       └── credit-score.ts                    # Calcul note utilisateur
│
├── assets/                                    # Icônes, images, fonts
├── theme/
│   └── variables.scss                         # Couleurs Fundi (CSS custom properties)
├── global.scss                                # Styles globaux
└── capacitor.config.ts                        # Config Capacitor (appId, plugins)
```

### 2.3 Fonctionnalités MVP vs Post-MVP

| Fonctionnalité | MVP (6 sem.) | Post-MVP |
|----------------|:---:|:---:|
| Onboarding + OTP | X | |
| Création compte + profil | X | |
| Créer/rejoindre cotisation | X | |
| Liste des tours | X | |
| Suivi paiements (statuts) | X | |
| Paiement via Dohone (OM/MOMO) | X | |
| Déclaration paiement externe | X | |
| Messagerie groupe cotisation | X | |
| Messagerie 1-to-1 | X | |
| Notifications push | X | |
| Calendrier cotisations | X | |
| Lien d'invitation | X | |
| Compte premium + paiement | X | |
| Google Ads (reward vidéo) | | X |
| Historique transactions complet | | X |
| Sauvegarde/restauration conversations | | X |
| Envoi d'argent direct entre utilisateurs | | X |
| Montants aléatoires | | X |

---

## 3. Backend API

### 3.1 Stack Technique

- **Runtime** : Node.js 20 LTS
- **Framework** : Express.js + express-validator
- **ORM** : Prisma (typage fort, migrations, introspection)
- **Auth** : JWT (access + refresh tokens) + OTP via SMS
- **Temps réel** : Socket.io (salles par groupe de cotisation)
- **Queue** : Bull (Redis) pour jobs asynchrones (SMS, emails, rappels)
- **Upload** : Multer + stockage local (ou S3-compatible Contabo Object Storage)
- **Documentation** : Swagger/OpenAPI auto-générée

### 3.2 Schéma de Base de Données (PostgreSQL)

```sql
-- Utilisateurs
CREATE TABLE users (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone           VARCHAR(20) UNIQUE NOT NULL,
    name            VARCHAR(100) NOT NULL,
    avatar_url      VARCHAR(500),
    om_number       VARCHAR(20),
    momo_number     VARCHAR(20),
    password_hash   VARCHAR(255) NOT NULL,
    is_premium      BOOLEAN DEFAULT FALSE,
    premium_until   TIMESTAMPTZ,
    monthly_sends   INT DEFAULT 0,
    sends_reset_at  TIMESTAMPTZ,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Cotisations (groupes de tontine)
CREATE TABLE cotisations (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            VARCHAR(100) NOT NULL,
    avatar_url      VARCHAR(500),
    description     TEXT,
    amount          INT NOT NULL,                    -- Montant en XAF
    periodicity     VARCHAR(20) NOT NULL,            -- daily, every_2_days, every_3_days, weekly
    weekly_day      INT,                             -- 0-6 si weekly (lundi-dimanche)
    deadline_time   TIME NOT NULL,                   -- Heure limite
    status          VARCHAR(20) DEFAULT 'pending',   -- pending, active, completed
    started_at      TIMESTAMPTZ,
    created_by      UUID REFERENCES users(id),
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Membres d'une cotisation
CREATE TABLE cotisation_members (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cotisation_id   UUID REFERENCES cotisations(id) ON DELETE CASCADE,
    user_id         UUID REFERENCES users(id),
    role            VARCHAR(20) DEFAULT 'member',    -- admin, member
    joined_at       TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(cotisation_id, user_id)
);

-- Tours de cotisation (qui reçoit quand)
CREATE TABLE tours (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cotisation_id   UUID REFERENCES cotisations(id) ON DELETE CASCADE,
    tour_number     INT NOT NULL,
    beneficiary_id  UUID REFERENCES users(id),
    scheduled_date  DATE NOT NULL,
    status          VARCHAR(20) DEFAULT 'upcoming',  -- upcoming, active, completed
    UNIQUE(cotisation_id, tour_number)
);

-- Paiements
CREATE TABLE payments (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tour_id         UUID REFERENCES tours(id),
    payer_id        UUID REFERENCES users(id),
    amount          INT NOT NULL,
    operator        VARCHAR(10),                     -- om, momo, manual
    status          VARCHAR(20) DEFAULT 'unpaid',    -- unpaid, pending, paid, failed
    proof_url       VARCHAR(500),                    -- Capture pour paiement manuel
    confirmed_by    UUID REFERENCES users(id),       -- Bénéficiaire confirme
    dohone_ref      VARCHAR(100),                    -- Référence transaction Dohone
    paid_at         TIMESTAMPTZ,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Messages (messagerie)
CREATE TABLE messages (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL,                   -- cotisation_id ou discussion_id
    conversation_type VARCHAR(20) NOT NULL,           -- cotisation, discussion
    sender_id       UUID REFERENCES users(id),
    content         TEXT,
    media_url       VARCHAR(500),
    message_type    VARCHAR(20) DEFAULT 'user',      -- user, system
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Discussions 1-to-1
CREATE TABLE discussions (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user1_id        UUID REFERENCES users(id),
    user2_id        UUID REFERENCES users(id),
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user1_id, user2_id)
);

-- Invitations
CREATE TABLE invitations (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cotisation_id   UUID REFERENCES cotisations(id),
    token           VARCHAR(100) UNIQUE NOT NULL,
    created_by      UUID REFERENCES users(id),
    expires_at      TIMESTAMPTZ,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Transactions premium
CREATE TABLE premium_transactions (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID REFERENCES users(id),
    amount          INT NOT NULL,
    dohone_ref      VARCHAR(100),
    status          VARCHAR(20) DEFAULT 'pending',
    created_at      TIMESTAMPTZ DEFAULT NOW()
);
```

### 3.3 Endpoints API (principaux)

```
AUTH
  POST   /api/auth/send-otp          # Envoi OTP par SMS
  POST   /api/auth/verify-otp        # Vérification OTP
  POST   /api/auth/register          # Création compte
  POST   /api/auth/login             # Connexion
  POST   /api/auth/refresh           # Refresh token

USERS
  GET    /api/users/me               # Mon profil
  PUT    /api/users/me               # Modifier profil
  GET    /api/users/:id              # Profil utilisateur (vue filtrée)
  PUT    /api/users/me/mobile-money  # Mettre à jour numéros OM/MOMO

COTISATIONS
  POST   /api/cotisations                     # Créer une cotisation
  GET    /api/cotisations                     # Mes cotisations
  GET    /api/cotisations/:id                 # Détail cotisation
  PUT    /api/cotisations/:id                 # Modifier (admin)
  POST   /api/cotisations/:id/members         # Ajouter membres
  DELETE /api/cotisations/:id/members/:uid    # Retirer membre
  PUT    /api/cotisations/:id/members/:uid/role  # Changer rôle

TOURS
  GET    /api/cotisations/:id/tours           # Liste des tours
  POST   /api/cotisations/:id/tours           # Créer/modifier tours
  PUT    /api/cotisations/:id/tours/:tid      # Modifier un tour (admin)

PAYMENTS
  POST   /api/payments/initiate               # Initier paiement Dohone
  POST   /api/payments/callback               # Webhook Dohone
  POST   /api/payments/manual                 # Déclarer paiement manuel
  PUT    /api/payments/:id/confirm            # Bénéficiaire confirme
  GET    /api/cotisations/:id/tours/:tid/payments  # Paiements d'un tour

MESSAGES
  GET    /api/conversations/:id/messages      # Historique messages
  POST   /api/conversations/:id/messages      # Envoyer message (+ média)

DISCUSSIONS
  GET    /api/discussions                     # Mes discussions
  POST   /api/discussions                     # Créer discussion

INVITATIONS
  POST   /api/cotisations/:id/invite          # Générer lien invitation
  POST   /api/invitations/:token/join         # Rejoindre via lien

PREMIUM
  POST   /api/premium/subscribe               # Paiement premium
  POST   /api/premium/callback                # Webhook Dohone premium

ADMIN (Dashboard métriques)
  GET    /api/admin/metrics                   # Users totaux, premium, en ligne
```

### 3.4 Jobs Asynchrones (Bull Queue)

| Job | Déclencheur | Action |
|-----|-------------|--------|
| `send-otp` | Inscription/login | Envoie SMS OTP via Camoo/Orange API |
| `cotisation-reminder` | CRON 1h avant deadline | Push notification + SMS optionnel |
| `midnight-check` | CRON minuit | Marque les non-paiements comme échec |
| `advance-tour` | Fin d'un tour | Active le tour suivant, notifie le bénéficiaire |
| `send-email` | Événements divers | Email transactionnel via Brevo |
| `reset-monthly-sends` | CRON 1er du mois | Remet le compteur d'envois à 0 |

---

## 4. Intégration Frontend-Backend

### 4.1 Authentification

```
┌──────────┐                          ┌──────────┐
│  Mobile  │  POST /auth/send-otp     │  Backend │
│          │ ──────────────────────►   │          │
│          │                          │  → Bull queue → Camoo SMS API
│          │  { message: "OTP sent" } │          │
│          │ ◄──────────────────────   │          │
│          │                          │          │
│          │  POST /auth/verify-otp   │          │
│          │ ──────────────────────►   │          │
│          │  { valid: true }         │          │
│          │ ◄──────────────────────   │          │
│          │                          │          │
│          │  POST /auth/register     │          │
│          │  { name, avatar, om,     │          │
│          │    momo, password }      │          │
│          │ ──────────────────────►   │          │
│          │  { accessToken,          │          │
│          │    refreshToken, user }  │          │
│          │ ◄──────────────────────   │          │
└──────────┘                          └──────────┘

Tokens stockés dans @capacitor/secure-storage (côté mobile)
Access token : expire en 15 min
Refresh token : expire en 30 jours
```

### 4.2 Flux de Paiement (Cotisation via Dohone)

```
┌──────────┐       ┌──────────┐       ┌──────────┐       ┌──────────┐
│  Mobile  │       │  Backend │       │  Dohone  │       │  OM/MOMO │
│          │       │          │       │          │       │          │
│ Clic     │ POST  │          │ API   │          │       │          │
│ Cotiser  │──────►│ Crée     │──────►│ Initie   │──────►│ USSD     │
│          │       │ payment  │       │ paiement │       │ prompt   │
│          │       │ pending  │       │          │       │ au user  │
│          │       │          │       │          │       │          │
│          │       │          │◄──────│ Callback │       │ User     │
│          │       │          │ POST  │ succès/  │◄──────│ valide   │
│          │       │          │       │ échec    │       │ PIN      │
│          │       │          │       │          │       │          │
│          │◄──────│ Socket   │       │          │       │          │
│ Liste    │ emit  │ update   │       │          │       │          │
│ mise à   │ "payment│ payment │       │          │       │          │
│ jour     │ _updated"│ status │       │          │       │          │
└──────────┘       └──────────┘       └──────────┘       └──────────┘

Statuts payment : unpaid → pending → paid/failed
```

### 4.3 Messagerie Temps Réel (Socket.io)

```javascript
// Événements Socket.io

// Client → Serveur
socket.emit('join_room', { conversationId, type })    // Rejoindre une salle
socket.emit('leave_room', { conversationId })          // Quitter une salle
socket.emit('send_message', { conversationId, content, mediaUrl })
socket.emit('typing', { conversationId, userId })

// Serveur → Client
socket.on('new_message', (message) => {})              // Nouveau message
socket.on('payment_updated', (payment) => {})          // Statut paiement changé
socket.on('tour_updated', (tour) => {})                // Modification liste tours
socket.on('member_joined', (member) => {})             // Nouveau membre
socket.on('system_message', (msg) => {})               // "X a mis à jour la liste"
socket.on('typing', ({ userId, conversationId }) => {})
```

### 4.4 Gestion des Notifications Push

```
Déclencheurs :
  1. Rappel cotisation (1h avant deadline)        → "L'heure limite de cotisation de X est 18h"
  2. Nouveau message dans un groupe               → "Nom: contenu du message"
  3. Paiement reçu (bénéficiaire)                  → "Y a cotisé dans X"
  4. Paiement en attente de confirmation           → "Y déclare un paiement manuel"
  5. Modification de la liste des tours            → "Z a mis à jour la liste des bénéficiaires"
  6. Invitation à rejoindre une cotisation         → "Vous êtes invité à rejoindre X"

Stack : @capacitor/push-notifications → FCM (Android) / APNs (iOS) → Backend envoie via firebase-admin
```

### 4.5 Gestion Hors-Ligne

- **Angular HttpClient + NgRx SignalStore** met en cache les données critiques (cotisations, tours, messages récents)
- Les messages envoyés hors-ligne sont mis en queue localement et synchronisés au retour du réseau
- Les paiements nécessitent obligatoirement une connexion (sécurité)

---

## 5. Infrastructure & Déploiement

### 5.1 Architecture Docker (Contabo VPS)

```yaml
# docker-compose.yml (simplifié)
version: '3.8'

services:
  # Reverse proxy + SSL
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - certbot-data:/etc/letsencrypt
    depends_on:
      - api

  # API + WebSocket
  api:
    build: ./backend
    environment:
      - DATABASE_URL=postgresql://fundi:xxx@postgres:5432/fundi
      - REDIS_URL=redis://redis:6379
      - JWT_SECRET=${JWT_SECRET}
      - DOHONE_MERCHANT_CODE=${DOHONE_CODE}
      - BREVO_API_KEY=${BREVO_KEY}
      - CAMOO_API_KEY=${CAMOO_KEY}
    depends_on:
      - postgres
      - redis

  # Base de données
  postgres:
    image: postgres:16-alpine
    volumes:
      - postgres-data:/var/lib/postgresql/data
    environment:
      - POSTGRES_DB=fundi
      - POSTGRES_USER=fundi
      - POSTGRES_PASSWORD=${DB_PASSWORD}

  # Cache + Queue
  redis:
    image: redis:7-alpine
    volumes:
      - redis-data:/data

  # SSL auto-renew
  certbot:
    image: certbot/certbot
    volumes:
      - certbot-data:/etc/letsencrypt

volumes:
  postgres-data:
  redis-data:
  certbot-data:
```

### 5.2 Contabo VPS Recommandé

**Cloud VPS M** (recommandé pour le MVP) :
- 6 vCPU, 16 Go RAM, 200 Go NVMe
- ~7,99 EUR/mois (~5 245 XAF/mois)
- Suffisant pour : PostgreSQL + Redis + API Node.js + Nginx
- Bande passante : 32 To/mois (largement suffisant)
- Localisation : Europe (Allemagne) - latence acceptable pour l'Afrique Centrale

### 5.3 Nom de Domaine (LWS)

- Domaine : `fundi.app` ou `fundi.cm` ou `getfundi.com`
- Sous-domaines :
  - `api.fundi.app` → API REST + WebSocket
  - `admin.fundi.app` → Dashboard métriques (futur)

### 5.4 CI/CD Pipeline

```
GitHub → GitHub Actions → Build & Test → SSH Deploy sur Contabo
                                          └→ docker compose pull && docker compose up -d
```

---

## 6. Planning 6 Semaines

### Semaine 1 : Fondations

| Jour | Frontend | Backend |
|------|----------|---------|
| J1-J2 | Setup Ionic/Angular + Capacitor + thème Fundi | Setup Express + Prisma + Docker Compose |
| J3 | Écrans onboarding (splash, slides) | Auth: envoi OTP + vérification (Camoo SMS) |
| J4 | Écrans inscription (phone, profil, OM/MOMO) | Auth: register + login + JWT |
| J5 | Intégration auth frontend-backend | Tests auth + déploiement initial Contabo |

**Livrable S1** : Un utilisateur peut s'inscrire, vérifier son numéro par SMS, et se connecter.

### Semaine 2 : Cotisations - Création & Gestion

| Jour | Frontend | Backend |
|------|----------|---------|
| J1 | Vue principale (tabs cotisations/discussions) | CRUD cotisations + gestion membres |
| J2 | Formulaire création cotisation | Logique tours (génération automatique dates) |
| J3 | Liste des tours (tableau) | API tours + permissions admin |
| J4 | Suivi paiements (tableau avec statuts) | API paiements + statuts |
| J5 | Intégration + ajustements | Tests + liens d'invitation |

**Livrable S2** : Créer une cotisation, ajouter des membres, voir les tours et la liste de suivi.

### Semaine 3 : Paiements & Dohone

| Jour | Frontend | Backend |
|------|----------|---------|
| J1 | Formulaire paiement (choix opérateur) | Intégration Dohone API (initiation paiement) |
| J2 | Écran déclaration paiement manuel + caméra | Webhook Dohone (callback) |
| J3 | Mise à jour liste en temps réel après paiement | Logique confirmation paiement manuel |
| J4 | Calendrier des cotisations | Jobs CRON : rappels + vérif minuit |
| J5 | Tests paiements end-to-end | Tests paiements + gestion erreurs opérateurs |

**Livrable S3** : Paiement fonctionnel via OM/MOMO, déclaration manuelle, calendrier.

### Semaine 4 : Messagerie

| Jour | Frontend | Backend |
|------|----------|---------|
| J1 | Chat groupe cotisation (UI) | Socket.io : salles, envoi/réception messages |
| J2 | Messages système ("X a mis à jour...") | Stockage messages PostgreSQL |
| J3 | Envoi média (photos pour preuves) | Upload fichiers + stockage |
| J4 | Discussions 1-to-1 | API discussions + socket rooms |
| J5 | Notifications push (@capacitor/push-notifications) | firebase-admin + logique push |

**Livrable S4** : Messagerie fonctionnelle dans les groupes et en 1-to-1, notifications push.

### Semaine 5 : Premium, Profil & Métriques

| Jour | Frontend | Backend |
|------|----------|---------|
| J1 | Écran profil (avec toutes les stats) | API profil + calcul note utilisateur |
| J2 | Profil autre utilisateur (vue filtrée) | Logique visibilité selon rôle |
| J3 | Écran premium + paiement | Gestion abonnement premium via Dohone |
| J4 | Menu complet + "À propos" | Limiteur d'envois (free: 3 cotisations, 15 envois) |
| J5 | Dashboard admin (métriques simples) | API métriques (total users, premium, online) |

**Livrable S5** : Profils complets, premium fonctionnel, limites free, dashboard admin.

### Semaine 6 : Tests, Polish & Déploiement

| Jour | Frontend | Backend |
|------|----------|---------|
| J1 | Tests E2E parcours critique | Tests intégration API |
| J2 | Fix bugs + edge cases paiements | Sécurité : rate limiting, validation, sanitization |
| J3 | Performance + UX polish | Backup PostgreSQL automatisé |
| J4 | Build APK/AAB via Capacitor + Android Studio | Déploiement production Contabo |
| J5 | Tests utilisateurs bêta | Monitoring + correction bugs critiques |

**Livrable S6** : APK prêt pour distribution bêta (Play Store internal testing).

---

## 7. Budget & Coûts

### 7.1 Infrastructure Mensuelle

| Service | Fournisseur | Coût/mois (EUR) | Coût/mois (XAF) | Détails |
|---------|-------------|:---:|:---:|---------|
| VPS Cloud M | Contabo | 7,99 | 5 243 | 6 vCPU, 16 Go RAM, 200 Go NVMe |
| Nom de domaine | LWS | ~1,00 | ~656 | ~12 EUR/an pour un .com, soit ~1 EUR/mois |
| Rafraîchissement équipe dev | - | 228,68 | 150 000 | Budget mensuel équipe développement |
| **Sous-total infra + équipe** | | **~237,68** | **~155 899** | |

### 7.2 Services Transactionnels

| Service | Fournisseur | Coût unitaire | Volume estimé MVP | Coût/mois (EUR) | Coût/mois (XAF) |
|---------|-------------|:---:|:---:|:---:|:---:|
| SMS OTP | Camoo | 20 XAF/SMS (~0,03 EUR) | ~500 SMS/mois | ~15,00 | ~9 839 |
| Email transactionnel | Brevo | Gratuit | 300/jour = 9 000/mois | 0,00 | 0 |
| Paiements OM/MOMO | Dohone | ~2% par transaction | Variable | Variable | Variable |

**Note sur Dohone** : Les frais de transaction (environ 2%) sont généralement répercutés sur l'utilisateur ou absorbés dans le modèle économique. Pas de frais mensuels fixes - vous payez par transaction. Contacter infos@my-dohone.com pour obtenir un code marchand et les tarifs exacts.

### 7.3 Outils de Développement

| Service | Coût | Détails |
|---------|:---:|---------|
| Ionic/Capacitor (build local) | Gratuit | Builds via Android Studio / Xcode en local, pas de service cloud requis |
| GitHub | Gratuit | Repos privés gratuits |
| Google Play Console | 25 USD unique (~15 250 XAF) | Publication sur Play Store |
| Apple Developer | 99 USD/an (~60 440 XAF) | Publication sur App Store (optionnel pour le MVP) |

### 7.4 Récapitulatif Budget MVP (6 semaines)

| Catégorie | Coût total 6 sem. (EUR) | Coût total 6 sem. (XAF) |
|-----------|:---:|:---:|
| Infrastructure (VPS + domaine) | ~14 | ~9 183 |
| SMS OTP (Camoo) | ~23 | ~15 090 |
| Emails (Brevo) | 0 | 0 |
| Google Play Console (unique) | ~23 | ~15 250 |
| Rafraîchissement équipe dev (6 sem.) | ~343 | 225 000 |
| **TOTAL MVP (sans Apple)** | **~403** | **~264 523** |
| Apple Developer (optionnel) | +99/an | +64 940/an |

### 7.5 Budget Mensuel en Production (estimation 1 000 utilisateurs)

| Catégorie | Coût/mois (EUR) | Coût/mois (XAF) |
|-----------|:---:|:---:|
| VPS Contabo (Cloud M) | 7,99 | 5 243 |
| Nom de domaine (lissé) | 1,00 | 656 |
| SMS OTP (~200 nouveaux users + re-auth) | ~10 | ~6 560 |
| Emails Brevo | 0 (plan gratuit) | 0 |
| Frais Dohone (~2% sur transactions) | Variable | Variable |
| Rafraîchissement équipe dev | 228,68 | 150 000 |
| **Total fixe mensuel** | **~248** | **~162 459** |

### 7.6 Comparatif avec l'Upgrade si Croissance

| Palier utilisateurs | VPS recommandé | Coût VPS (EUR/mois) | Coût VPS (XAF/mois) |
|:---:|-------------|:---:|:---:|
| 0 - 1 000 | Cloud VPS M (6 vCPU, 16 Go) | 7,99 | 5 243 |
| 1 000 - 5 000 | Cloud VPS L (8 vCPU, 30 Go) | 14,99 | 9 838 |
| 5 000 - 20 000 | Cloud VPS XL (10 vCPU, 60 Go) | 29,99 | 19 677 |
| 20 000+ | VPS dédié ou multi-serveurs | 59,99+ | 39 355+ |

---

## Annexes

### A. Variables d'Environnement Requises

```env
# Base de données
DATABASE_URL=postgresql://fundi:password@postgres:5432/fundi

# Redis
REDIS_URL=redis://redis:6379

# Auth
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret

# Dohone (Paiements)
DOHONE_MERCHANT_CODE=your-merchant-code
DOHONE_API_URL=https://www.my-dohone.com/dohone/pay
DOHONE_CALLBACK_URL=https://api.fundi.app/api/payments/callback

# Camoo SMS
CAMOO_API_KEY=your-camoo-key
CAMOO_API_SECRET=your-camoo-secret

# Brevo (Emails)
BREVO_API_KEY=your-brevo-key

# Firebase (Push Notifications)
FIREBASE_PROJECT_ID=fundi-app
FIREBASE_PRIVATE_KEY=...
FIREBASE_CLIENT_EMAIL=...

# App
NODE_ENV=production
PORT=3000
FRONTEND_URL=https://fundi.app
```

### B. Sécurité MVP

- **HTTPS** obligatoire (Let's Encrypt via Certbot)
- **Rate limiting** sur les endpoints sensibles (auth, paiements)
- **Validation** de toutes les entrées (express-validator)
- **Sanitization** contre XSS/injection
- **CORS** restreint aux domaines autorisés
- **Helmet.js** pour les headers de sécurité
- Mots de passe hashés avec **bcrypt** (cost factor 12)
- Tokens OTP : **6 chiffres, expiration 5 minutes, max 3 tentatives**
- Webhook Dohone : **vérification de signature/IP source**

### C. Sources & Références

- [Contabo VPS Pricing](https://contabo.com/en/pricing/)
- [LWS Noms de domaine](https://www.lws.fr/nom-de-domaine.php)
- [Dohone API Documentation](https://www.my-dohone.com)
- [Dohone JS SDK](https://github.com/MatHermann/dohone-sdk-js)
- [Brevo Pricing](https://www.brevo.com/pricing/)
- [Camoo Bulk SMS Cameroun](https://www.camoo.cm/bulk-sms)
- [Orange SMS API Cameroun](https://developer.orange.com/apis/sms-cm)
