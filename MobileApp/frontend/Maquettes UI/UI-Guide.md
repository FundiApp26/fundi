# FUNDI - Guide UI & Suivi d'Intégration

> Ce document recense tous les écrans des maquettes, les regroupe par fonctionnalité,
> et suit la progression de l'intégration pixel-perfect.
>
> **Légende statuts** : ⬜ À faire | 🟡 En cours | ✅ Terminé | ⏭️ Post-MVP

---

## Table des matières

1. [Inventaire des Captures](#1-inventaire-des-captures)
2. [Écrans par Fonctionnalité](#2-écrans-par-fonctionnalité)
3. [Parcours Utilisateur (ordre logique)](#3-parcours-utilisateur-ordre-logique)
4. [Assets Requis](#4-assets-requis)
5. [Design Tokens](#5-design-tokens)
6. [Questions Ouvertes](#6-questions-ouvertes)

---

## 1. Inventaire des Captures

| Fichier | Contenu | Nb écrans |
|---------|---------|:---------:|
| 174000.png | Splash Screen, Splash 1, Splash 2 | 3 |
| 174025.png | Onboarding slides 1-4 | 4 |
| 174047.png | Welcome, Vérification numéro (saisie, modal, OTP) | 4 |
| 174105.png | Profil, OM & MoMo, Code PIN, Confirmation PIN | 4 |
| 174159.png | PIN créé, Page connexion, MDP oublié, Vérification MDP | 4 |
| 174209.png | Nouveau mot de passe | 1 |
| 174238.png | Home Cotisation, Home Discussion, Discussion vide, Chat 1-to-1 | 4 |
| 174253.png | Nouvelle discussion, Envoi argent discussion, Succès | 3 |
| 174307.png | Profil contact (vue admin), Profil contact (vue membre) | 2 |
| 174330.png | Historique cotisations contact, Sélection membres, Formulaire cotisation, Groupe vide | 4 |
| 174410.png | Chat groupe, Chat groupe terminé, Profil cotisation, Choix type dépôt | 4 |
| 174425.png | Pop-up cotiser, Dépôt externe, Succès dans liste | 3 |
| 174436.png | Pop-up cotiser (bis), Dépôt externe (bis), Succès, Liste membres | 4 |
| 174455.png | Liste membres édition, Suivi paiements, Suivi paiements (statuts), Détail dépôt | 4 |
| 174510.png | Historique tours, Détail tour, Historique paiement membre, À propos | 4 |
| 174526.png | Notifications, Profil utilisateur, Mon compte, Mon OM et MoMo | 4 |
| 174544.png | Premium, Historique transactions | 2 |

**Total : 18 captures, ~45 écrans**

---

## 2. Écrans par Fonctionnalité

### F1. Splash & Onboarding

| # | Écran | Description | Capture | Statut |
|---|-------|-------------|---------|:------:|
| 1.1 | Splash Screen | Logo seul centré, fond blanc | 174000 | ⬜ |
| 1.2 | Splash Screen 1 | Logo + "COMMON SAFE" + "TONTINER AUTREMENT" | 174000 | ⬜ |
| 1.3 | Splash Screen 2 | Logo + nom + slogan "GÉREZ FACILEMENT VOS TONTINES, EN TOUTE SÉCURITÉ" | 174000 | ⬜ |
| 1.4 | Onboarding 1 | Illustration main + $ + "Recevez votre argent directement sur vos comptes OM et MOMO" | 174025 | ⬜ |
| 1.5 | Onboarding 2 | Illustration personnages + checklist + "Consultez l'historique de cotisation des nouveaux adhérents et leur crédibilité" | 174025 | ⬜ |
| 1.6 | Onboarding 3 | Illustration checklist verte + "Vérifiez les listes qui se cochent automatiquement après chaque dépôt" | 174025 | ⬜ |
| 1.7 | Onboarding 4 | Illustration horloge + "Cotisez plus rapidement et plus simplement, en cliquant sur un bouton" | 174025 | ⬜ |

**Éléments UI communs :**
- Fond vert pâle en haut avec motifs géométriques en filigrane
- Indicateur de pagination (barres orange/grises)
- Bouton "Skyp >>" en bas à droite
- Frise géométrique africaine en pied d'écran

---

### F2. Inscription & Vérification

| # | Écran | Description | Capture | Statut |
|---|-------|-------------|---------|:------:|
| 2.1 | Welcome | Logo + "Welcome to Common Safe" + liens privacy policy/terms + bouton "ACCEPTER ET CONTINUER" | 174047 | ⬜ |
| 2.2 | Vérification numéro | Titre + description + drapeau Cameroun + préfixe +237 + champ téléphone + bouton "SUIVANT" | 174047 | ⬜ |
| 2.3 | Confirmation numéro | Modal overlay : "We have verified the phone number" + numéro affiché + boutons YES / EDIT | 174047 | ⬜ |
| 2.4 | Code de vérification | Titre + numéro affiché + lien "Wrong number?" + 6 tirets pour OTP + "Resend SMS" avec timer + "Call me" avec timer | 174047 | ⬜ |
| 2.5 | Informations profil | Titre + zone photo (icône caméra) + champs "Votre nom" et "Votre prénoms" + bouton "SUIVANT" | 174105 | ⬜ |
| 2.6 | OM & MoMo | Titre + champ N° Orange Money (+237) avec logo OM + "Nom de confirmation" + champ N° MTN Mobile Money (+237) avec logo MOMO + "Nom de confirmation" + bouton "VALIDEZ ET ENTREZ VOTRE CODE" | 174105 | ⬜ |
| 2.7 | Créer code PIN | Avatar + nom utilisateur + "Créer votre code PIN" + description + 6 cercles (remplis = vert foncé, vides = beige) + bouton "CONFIRMER" + clavier numérique | 174105 | ⬜ |
| 2.8 | Confirmer code PIN | Même layout que 2.7 + "Confirmer votre code PIN" + 5 cercles remplis | 174105 | ⬜ |

---

### F3. Connexion & Récupération

| # | Écran | Description | Capture | Statut |
|---|-------|-------------|---------|:------:|
| 3.1 | Code PIN créé ! | Grande icône check vert dans cercle + "Code Pink créé !" + message bienvenue + loader | 174159 | ⬜ |
| 3.2 | Page connexion | Logo + "COMMON SAFE" + "Entrez votre code PIN" + 6 cercles + bouton "CONFIRMER" + lien "Mot de passe oublié" + clavier | 174159 | ⬜ |
| 3.3 | Mot de passe oublié | Titre + champ téléphone (+237) + "Un code vous sera envoyé par SMS" + bouton "ENVOYER LE CODE" + clavier | 174159 | ⬜ |
| 3.4 | Vérification MDP oublié | Titre "Vérification" + "Entrer votre code de vérification" + 4 cercles avec chiffres + bouton "ENVOYER LE CODE" + clavier | 174159 | ⬜ |
| 3.5 | Nouveau mot de passe | Titre + champ "Entrer le nouveau mot de passe" + champ "Confirmer le nouveau mot de passe" + bouton "SAUVEGARDER" | 174209 | ⬜ |

---

### F4. Home & Navigation

| # | Écran | Description | Capture | Statut |
|---|-------|-------------|---------|:------:|
| 4.1 | Home - Cotisation | Header "Common Safe" + icônes recherche/menu + toggle Cotisation(actif)/Discussion + liste groupes (avatar, nom "Cotisation X", dernier message, heure, badge non-lu) + FAB "+" vert | 174238 | ⬜ |
| 4.2 | Home - Discussion | Même header + toggle Discussion(actif) + liste contacts (avatar, nom, dernier message, heure, point vert en ligne, badge non-lu) + FAB stylo vert | 174238 | ⬜ |
| 4.3 | Home - Discussion vide | Même layout + illustration bulle "..." + "Aucun échange" | 174238 | ⬜ |

**Éléments UI communs :**
- Header : nom app à gauche, icône loupe + menu 3 points à droite
- Toggle segmenté : Cotisation / Discussion (fond vert = actif, bordure = inactif) avec badge compteur
- FAB (Floating Action Button) en bas à droite

---

### F5. Messagerie 1-to-1

| # | Écran | Description | Capture | Statut |
|---|-------|-------------|---------|:------:|
| 5.1 | Chat 1-to-1 | Header (flèche retour, avatar, nom, icône appel vidéo, menu) + bulles grises (reçu) et blanches bordure (envoyé) + horodatage + barre input (caméra, emoji, pièce jointe, champ texte, bouton envoi vert) | 174238 | ⬜ |
| 5.2 | Nouvelle discussion | Header "Nouvelle discussion" + barre recherche + "Inviter une personne" (icône verte) + liste contacts A-Z avec séparateurs lettres | 174253 | ⬜ |
| 5.3 | Envoi argent (discussion) | Modal overlay : "Envoyer de l'argent à [Nom]" + champ montant (FCFA) + choix opérateur (OM/MOMO avec images) + nom confirmation affiché + boutons "CONFIRMER" / "ANNULER" + note instructions opérateur | 174253 | ⬜ |
| 5.4 | Succès envoi argent | Modal overlay : grande icône check vert + "Opération effectuée avec succès" + boutons "VOIR L'HISTORIQUE" / "FERMER" | 174253 | ⬜ |

---

### F6. Profil Contact

| # | Écran | Description | Capture | Statut |
|---|-------|-------------|---------|:------:|
| 6.1 | Profil contact (vue admin) | Header vert avec photo + nom + "État des cotisations" (4 blocs : Total, En cours, Succès, Échec) + Montant le plus haut/bas en badges verts + Historique de cotisations + Numéros téléphone + Médias partagés + Groupes en commun + Bloquer/Signaler | 174307 | ⬜ |
| 6.2 | Profil contact (vue membre) | Header vert + nom + icônes (appel, message) + numéro téléphone + "Côte des cotisations" (score X/20) + Groupes en commun + Bloquer/Signaler | 174307 | ⬜ |
| 6.3 | Historique cotisations contact | Liste : Tontine 1-4 avec badge "En cours"/"Terminé" + montant + durée + badge "Aucun échec"/"Échec X" | 174330 | ⬜ |

---

### F7. Création Cotisation

| # | Écran | Description | Capture | Statut |
|---|-------|-------------|---------|:------:|
| 7.1 | Sélection membres | Header "Nouvelle cotisation" + compteur sélection + barre recherche + liste contacts A-Z avec checkmarks verts + bouton "SUIVANT" | 174330 | ⬜ |
| 7.2 | Formulaire cotisation | Champs : Montant (Fcfa), Fréquence (dropdown), Jour de début (dropdown), Heure de cotisation, Nom, Description (textarea) + bouton "CRÉER UNE COTISATION" | 174330 | ⬜ |
| 7.3 | Groupe cotisation vide | Header (avatar, nom "Cotisation 50.000", "Voir les détails du groupe", icônes cotiser/calendrier/menu) + illustration bulle "..." + "Aucun échange" + barre input | 174330 | ⬜ |

---

### F8. Messagerie Groupe Cotisation

| # | Écran | Description | Capture | Statut |
|---|-------|-------------|---------|:------:|
| 8.1 | Chat groupe actif | Header cotisation (avatar, nom, sous-titre, icônes cotiser/liste/calendrier/menu) + date séparateur + bulles avec nom expéditeur en couleur + numéro tagué en orange + barre input | 174410 | ⬜ |
| 8.2 | Chat groupe terminé | Même layout + badge "Terminé" rouge dans header + bannière orange en bas "La cotisation 50.000Fcfa est terminée, vous pouvez créer une nouvelle ou alors la relancer" + lien "Relancer la cotisation" | 174410 | ⬜ |

---

### F9. Profil & Gestion Cotisation

| # | Écran | Description | Capture | Statut |
|---|-------|-------------|---------|:------:|
| 9.1 | Profil cotisation | Header vert + photo groupe + badge vérifié + nom + "En cours" + 3 raccourcis (Cotiser, Liste, Calendrier) + Description + Montant + Historique tours + Médias partagés + Liste membres + "Inviter une personne" + "Quitter la cotisation" / "Signaler" | 174410 | ⬜ |
| 9.2 | Choix type de dépôt | Modal : "Quel type de dépôt souhaitez-vous effectuer ?" + radio "Dépôt via l'application" / "Dépôt avec un autre numéro" + boutons "SUIVANT" / "ANNULER" | 174410 | ⬜ |

---

### F10. Paiements Cotisation

| # | Écran | Description | Capture | Statut |
|---|-------|-------------|---------|:------:|
| 10.1 | Pop-up cotiser | Modal overlay fond vert : "Envoyer votre cotisation" + montant affiché (50.000 Fcfa) + choix opérateur OM/MOMO (images) + nom confirmation + boutons "CONFIRMER" / "ANNULER" + note opérateur | 174425 | ⬜ |
| 10.2 | Dépôt externe | Plein écran : "Insérer la preuve du dépôt externe" + dropdown "Personne concernée" + champ montant (FCFA) + zone upload image (icône galerie) + boutons "CONFIRMER" / "ANNULER" | 174425 | ⬜ |
| 10.3 | Succès paiement | Modal dans liste membres : icône check vert + "Opération effectuée avec succès" + bouton "FERMER" | 174425 | ⬜ |
| 10.4 | Détail du dépôt | Modal : "Detail du dépôt" + personne concernée (nom + numéro) + montant envoyé + capture d'écran preuve + bouton "FERMER" | 174455 | ⬜ |

---

### F11. Listes & Suivi des Paiements

| # | Écran | Description | Capture | Statut |
|---|-------|-------------|---------|:------:|
| 11.1 | Liste des membres (lecture) | Header "Liste des membres" + bouton "Modifier la liste" + barre recherche + liste numérotée (numéro vert, nom, check vert, date) | 174436 | ⬜ |
| 11.2 | Liste des membres (édition) | Header avec X (annuler) et ✓ (valider) + drag handles (≡) + liste réordonnnable + numéros + noms + dates | 174455 | ⬜ |
| 11.3 | Suivi paiements (en cours) | Header "La liste de suivi des paiements" + barre recherche + liste numérotée : nom + check + date/heure + montant en vert + "Detail du dépôt" ou "Dépôt externe" ou "En attente" (badge orange) + bénéficiaire surligné en vert | 174455 | ⬜ |
| 11.4 | Suivi paiements (terminé) | Même layout + tous les montants affichés + badge "Échec" rouge pour les défaillants + noms en rouge pour échecs | 174455 | ⬜ |

---

### F12. Historique des Tours

| # | Écran | Description | Capture | Statut |
|---|-------|-------------|---------|:------:|
| 12.1 | Historique tours | Liste : Tour 1-4 + badge "En cours"/"Terminé" + montant Fcfa/s + durée + badge "Aucun échec"/"Échec X" + flèche détail | 174510 | ⬜ |
| 12.2 | Détail tour | Header "Tour 4 - En cours" + Date [début - fin] + Montant + "Membres (15)" + liste avec avatar, nom, check, date, badge "Aucun échec"/"Échec X" + "Afficher plus" | 174510 | ⬜ |
| 12.3 | Historique paiement membre | Header avec avatar + nom + "Historique de paiement de cotisation" + barre recherche + liste numérotée des paiements (nom, check, date, montant, lien détail) + bénéficiaire surligné | 174510 | ⬜ |

---

### F13. Notifications

| # | Écran | Description | Capture | Statut |
|---|-------|-------------|---------|:------:|
| 13.1 | Notifications | Header "Notifications" + sections "Aujourd'hui" / "Hier" + items : icône type + avatar + texte riche (noms en gras) + horodatage + point vert (non lu) | 174526 | ⬜ |

---

### F14. Profil Utilisateur & Paramètres

| # | Écran | Description | Capture | Statut |
|---|-------|-------------|---------|:------:|
| 14.1 | Profil | Header vert + photo avec icône edit + nom + numéro + stats (Total, En cours, Succès, Échec) + menu : Mon compte, Mon OM et MoMo, Historique, Langue, Inviter des proches, Se déconnecter | 174526 | ⬜ |
| 14.2 | Mon compte | Liste : Mes informations personnelles, Changer de numéro principal, Se déconnecter | 174526 | ⬜ |
| 14.3 | Mon OM et MoMo | Numéro Orange (+237...) avec logo + nom confirmation + icône edit + Numéro MTN (+237...) avec logo + nom confirmation + icône edit | 174526 | ⬜ |

---

### F15. Premium

| # | Écran | Description | Capture | Statut |
|---|-------|-------------|---------|:------:|
| 15.1 | Premium | Fond vert pâle + icône couronne dorée + texte avantages + prix "10.000 FCFA /Mois" + 2 bénéfices illustrés (infinité groupes, infinité envois) + bouton "DEVENIR PRÉMIUM" | 174544 | ⬜ |

---

### F16. Historique Transactions

| # | Écran | Description | Capture | Statut |
|---|-------|-------------|---------|:------:|
| 16.1 | Historique | Header "Historique" + liste par date + items : icône type (cotisation/transfert/dépôt) + nom/numéro + sous-titre type + montant vert (reçu) ou montant avec - (envoyé) + heure | 174544 | ⬜ |

---

### F17. À Propos

| # | Écran | Description | Capture | Statut |
|---|-------|-------------|---------|:------:|
| 17.1 | À propos | Header + Logo + textes descriptifs + liens cliquables + "Common Safe" + "Version 1.0" + "2022 Licence" | 174510 | ⬜ |

---

## 3. Parcours Utilisateur (ordre logique)

L'intégration se fera dans cet ordre, qui suit le parcours naturel de l'utilisateur :

### Phase 1 : Premier lancement
```
1.1 Splash → 1.2 Splash 1 → 1.3 Splash 2
  → 1.4-1.7 Onboarding slides (swipe)
    → 2.1 Welcome (accepter CGU)
```

### Phase 2 : Inscription
```
2.2 Vérification numéro → 2.3 Modal confirmation → 2.4 Saisie OTP
  → 2.5 Informations profil → 2.6 OM & MoMo
    → 2.7 Créer PIN → 2.8 Confirmer PIN → 3.1 Succès
```

### Phase 3 : Connexion (retour utilisateur)
```
3.2 Page connexion (saisie PIN)
  → [si oublié] 3.3 MDP oublié → 3.4 Vérification → 3.5 Nouveau MDP
```

### Phase 4 : Navigation principale
```
4.1 Home Cotisation ←→ 4.2 Home Discussion ←→ 4.3 Discussion vide
```

### Phase 5 : Messagerie
```
5.2 Nouvelle discussion → 5.1 Chat 1-to-1
  → [optionnel] 5.3 Envoi argent → 5.4 Succès
```

### Phase 6 : Cotisations
```
7.1 Sélection membres → 7.2 Formulaire → 7.3 Groupe créé (vide)
  → 8.1 Chat groupe actif → 8.2 Chat groupe terminé
```

### Phase 7 : Paiements
```
9.1 Profil cotisation → 9.2 Choix type dépôt
  → [via app] 10.1 Pop-up cotiser → 10.3 Succès
  → [externe] 10.2 Dépôt externe → 10.3 Succès
  → 10.4 Détail dépôt
```

### Phase 8 : Listes & Suivi
```
11.1 Liste membres (lecture) ←→ 11.2 Liste membres (édition)
11.3 Suivi paiements (en cours) → 11.4 Suivi paiements (terminé)
```

### Phase 9 : Historique
```
12.1 Historique tours → 12.2 Détail tour → 12.3 Historique paiement membre
```

### Phase 10 : Profil & Contacts
```
6.1 Profil contact (admin) / 6.2 Profil contact (membre)
  → 6.3 Historique cotisations contact
14.1 Profil utilisateur → 14.2 Mon compte / 14.3 Mon OM et MoMo
```

### Phase 11 : Fonctionnalités annexes
```
13.1 Notifications
15.1 Premium
16.1 Historique transactions
17.1 À propos
```

---

## 4. Assets Requis

> Les assets XD ont été exportés et organisés dans `src/assets/`.
> Structure : `logo/`, `patterns/`, `illustrations/`, `icons/`, `operators/`, `avatars/`, `badges/`, `screens/maquettes/`, `xd-raw/`

### 4.1 Logo & Branding

| Asset | Fichier | Format | Statut |
|-------|---------|:-:|:------:|
| Logo complet (bouclier + texte incliné) | `logo/logo-full.png` | PNG | ✅ Exporté |
| Texte "Common Safe" (dark) | `logo/text-dark.png` | PNG | ✅ Exporté |
| Texte "Common Safe" (light/gris) | `logo/text-light.png` | PNG | ✅ Exporté |
| Frise géométrique africaine | `patterns/african-geometric.png` | PNG | ✅ Exporté |
| Logo Fundi (bouclier) | — | SVG | ⬜ À vectoriser depuis PNG |
| Pattern header vert (dégradé + motifs) | — | SVG | ⬜ À recréer en CSS/SVG |

### 4.2 Illustrations Onboarding

| Asset | Fichier | Statut |
|-------|---------|:------:|
| Texte slide 1 "Recevez votre argent..." | `illustrations/onboarding-text-receive-money.png` | ✅ Exporté |
| Texte slide 2 "Consultez l'historique..." | `illustrations/onboarding-text-check-history.png` | ✅ Exporté |
| Texte slide 3 "Vérifiez les listes..." | En texte dans l'app | ✅ Via i18n |
| Texte slide 4 "Cotisez plus rapidement..." | `illustrations/onboarding-text-cotise-fast.png` | ✅ Exporté |
| Texte welcome FR | `illustrations/onboarding-text-welcome-fr.png` | ✅ Exporté |
| Texte welcome EN | `illustrations/onboarding-text-welcome-en.png` | ✅ Exporté |
| Illustration slide 1 (main + billets + $) | — | ⬜ À extraire du XD |
| Illustration slide 2 (personnages + checklist) | — | ⬜ À extraire du XD |
| Illustration slide 3 (checklist verte) | — | ⬜ À extraire du XD |
| Illustration slide 4 (horloge orange/verte) | — | ⬜ À extraire du XD |

### 4.3 Logos Opérateurs

| Asset | Fichier | Statut |
|-------|---------|:------:|
| Logo Orange Money (fond noir) | `operators/orange-money-logo.png` | ✅ Exporté |
| Texte "MTN" | `operators/mtn-text.png` | ✅ Exporté |
| Texte "Orange" | `operators/orange-text.png` | ✅ Exporté |
| Texte "OM & MoMo" | `operators/om-momo-text.png` | ✅ Exporté |
| Logo MTN MoMo (fond jaune) | — | ⬜ À fournir |

### 4.4 Icônes Fonctionnelles

| Asset | Fichier | Statut |
|-------|---------|:------:|
| Couronne premium (badge doré) | `badges/premium-crown.png` | ✅ Exporté |
| Recherche (loupe) | `icons/search.png` | ✅ Exporté |
| Envoi (send) | `icons/send.png` | ✅ Exporté |
| Édition (crayon) | `icons/edit.png` | ✅ Exporté |
| Caméra | `icons/camera.png` | ✅ Exporté |
| Check (coche verte) | `icons/check.png` | ✅ Exporté |
| Flèche retour | `icons/arrow-back.png` | ✅ Exporté |
| Drapeau Cameroun + dropdown | `icons/flag-cameroon-dropdown.png` | ✅ Exporté |
| Icône "Cotiser" (billets/main) | Dans `xd-raw/` (à identifier) | 🟡 À trier |
| Icône "Liste" (tableau) | Dans `xd-raw/` (à identifier) | 🟡 À trier |
| Icône "Calendrier" (31) | Dans `xd-raw/` (à identifier) | 🟡 À trier |
| Icône groupe (3 personnes) | Dans `xd-raw/` (à identifier) | 🟡 À trier |
| Icône appel vidéo | Ionicons `videocam-outline` | ✅ Ionic natif |

### 4.5 Icônes Génériques (Ionic/Material)

Ces icônes existent déjà dans Ionicons ou Material Icons, pas besoin de les fournir :

- Flèche retour, loupe, menu 3 points, caméra, emoji, pièce jointe
- Envoi (avion papier), check, croix, edit (crayon), téléphone
- Drag handle (≡), chevron droite, point vert (en ligne)
- Bloquer, signaler, déconnexion, langue

### 4.6 Maquettes Référence (screens/)

29 captures d'écran organisées dans `screens/maquettes/` avec noms dev-ready :

| Écran | Fichier |
|-------|---------|
| Splash Screen | `screens/maquettes/splash-screen.png` |
| Cotisation détail | `screens/maquettes/cotisation-detail.png` |
| Cotisation (variantes montants) | `screens/maquettes/cotisation-{5000,10000,20000,50000}.png` |
| Discussion | `screens/maquettes/discussion-main.png`, `discussion-alt.png` |
| Profil | `screens/maquettes/profil.png` |
| Notifications | `screens/maquettes/notifications.png` |
| Historique | `screens/maquettes/historique-*.png` |
| Liste membres | `screens/maquettes/liste-membres.png` |
| Suivi paiements | `screens/maquettes/suivi-paiements.png` |

### 4.7 Assets bruts XD (xd-raw/)

557 fichiers auto-nommés par XD (Groupe XXXX, Rectangle, Tracé, etc.) + sous-dossiers :
- `xd-raw/text-labels/` — 62 fragments texte exportés
- `xd-raw/avatars-photos/` — 16 photos placeholder
- `xd-raw/misc/` — 441 éléments divers (à trier au besoin)

---

## 5. Design Tokens

### 5.1 Couleurs (à confirmer)

| Token | Valeur supposée | Utilisé pour |
|-------|:-:|-------------|
| `--fundi-green` | #2D5A27 | Header profil, boutons primaires, FAB, badges actifs |
| `--fundi-green-light` | #4A7C42 | Fond header, variantes |
| `--fundi-orange` | #E87A1E | Pagination onboarding, badges, numéros tagués |
| `--fundi-orange-light` | #F5A623 | Bannière cotisation terminée |
| `--fundi-gray` | #F5F5F5 | Fond d'écran principal |
| `--fundi-dark` | #1A1A1A | Texte principal |
| `--fundi-success` | #4CAF50 ? | Check succès, montants reçus |
| `--fundi-error` | #E53935 ? | Badges "Échec", noms en échec |
| `--fundi-warning` | #FF9800 ? | Badges "En attente" |
| `--fundi-bg-light-green` | #F0F7EF ? | Fond slides onboarding |
| `--fundi-pin-filled` | #2D5A27 | Cercles PIN remplis |
| `--fundi-pin-empty` | #E8DFC5 ? | Cercles PIN vides |

### 5.2 Typographie

| Élément | Police supposée | Taille | Poids |
|---------|:-:|:-:|:-:|
| Titre principal (splash) | Poppins | 24-28px | Bold |
| Titre écran | Poppins | 20-22px | SemiBold |
| Sous-titre | Poppins | 16px | Medium |
| Corps texte | Poppins | 14px | Regular |
| Label | Poppins | 12px | Regular |
| Bouton | Poppins | 14-16px | SemiBold, uppercase |
| Badge | Poppins | 10-12px | Bold |

### 5.3 Rayons de Bordure

| Élément | Rayon estimé |
|---------|:-:|
| Boutons primaires | 25-30px (pill) |
| Boutons secondaires (outline) | 25-30px (pill) |
| Cards / Modals | 12-16px |
| Avatars | 50% (cercle) |
| Champs input | 8px |
| Badges statut | 4-6px |
| Toggle Cotisation/Discussion | 20px |

---

## 6. Questions Ouvertes

| # | Question | Réponse |
|---|----------|---------|
| Q1 | **Nom de l'app** : Les maquettes affichent "Common Safe". On remplace par "Fundi" partout ? | ⬜ En attente |
| Q2 | **Fichier source design** : Figma, Sketch ou Adobe XD disponible ? (pour espacements et valeurs exactes) | ⬜ En attente |
| Q3 | **Police** : Poppins confirmé ? Ou autre ? | ⬜ En attente |
| Q4 | **Couleurs exactes** : Les valeurs du tableau 5.1 sont-elles correctes ? | ⬜ En attente |
| Q5 | **Code PIN** : 6 chiffres (comme dans la maquette inscription) ou 4 chiffres (comme dans la maquette MDP oublié) ? | ⬜ En attente |
| Q6 | **Icône appel vidéo** dans le chat 1-to-1 : fonctionnalité prévue au MVP ou juste UI ? | ⬜ En attente |
| Q7 | **Calendrier** : un écran calendrier est mentionné dans le cahier de charges mais absent des maquettes. Existe-t-il une maquette ? | ⬜ En attente |
| Q8 | **Menu hamburger** : pas visible dans les maquettes. Le menu est-il uniquement via le profil et les 3 points ? | ⬜ En attente |

---

## Progression Globale

| Phase | Écrans | Terminés | % |
|-------|:------:|:--------:|:-:|
| F1. Splash & Onboarding | 7 | 0 | 0% |
| F2. Inscription | 8 | 0 | 0% |
| F3. Connexion | 5 | 0 | 0% |
| F4. Home | 3 | 0 | 0% |
| F5. Messagerie 1-to-1 | 4 | 0 | 0% |
| F6. Profil Contact | 3 | 0 | 0% |
| F7. Création Cotisation | 3 | 0 | 0% |
| F8. Chat Groupe | 2 | 0 | 0% |
| F9. Profil Cotisation | 2 | 0 | 0% |
| F10. Paiements | 4 | 0 | 0% |
| F11. Listes & Suivi | 4 | 0 | 0% |
| F12. Historique Tours | 3 | 0 | 0% |
| F13. Notifications | 1 | 0 | 0% |
| F14. Profil & Paramètres | 3 | 0 | 0% |
| F15. Premium | 1 | 0 | 0% |
| F16. Historique Transactions | 1 | 0 | 0% |
| F17. À Propos | 1 | 0 | 0% |
| **TOTAL** | **55** | **0** | **0%** |
