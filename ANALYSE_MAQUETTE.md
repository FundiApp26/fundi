# Analyse des écarts entre l'implémentation et la maquette

Ce document recense les différences identifiées entre le site actuel et les maquettes de référence (Desktop et Mobile).

---

## 1. NAVBAR

| Élément | Statut | Remarque |
|---------|--------|----------|
| Logo "Fundi" italique gras | ✅ Corrigé | `font-bold` ajouté |
| Bouton en majuscules | ✅ Corrigé | `uppercase` ajouté |
| Menu décalé à droite | ✅ Corrigé | `ml-auto` ajouté |
| Flèche langue | ⚠️ À vérifier | SVG original remis |
| **Taille des polices** | ❌ À corriger | Polices globalement trop grandes par rapport à la maquette |

---

## 2. HERO

| Élément | Statut | Remarque |
|---------|--------|----------|
| Titre tricolore (vert/noir/orange) | ✅ OK | |
| Sous-titre avec "crédibilité" en gras | ✅ OK | |
| Badges App Store / Google Play | ✅ OK | |
| Flèche décorative (desktop) | ✅ OK | |
| Grid photos avec bordures/rotations | ✅ OK | |
| Coins décoratifs | ✅ OK | |
| **Mobile: nombre de photos** | ⚠️ À vérifier | Maquette montre 5-6 photos, implémentation en a 4 |

---

## 3. ABOUT (À propos)

| Élément | Statut | Remarque |
|---------|--------|----------|
| "À PROPOS" en orange | ✅ OK | |
| Titre "Fundi" + barre orange | ✅ OK | |
| Description | ✅ OK | |
| 4 features en ligne (desktop) | ✅ OK | |
| **Mobile: layout 1 colonne** | ❌ À corriger | Maquette = 1 feature par ligne, implémentation = grille 2x2 |

---

## 4. HOW IT WORKS (Comment ça marche)

| Élément | Statut | Remarque |
|---------|--------|----------|
| Titre + barre orange | ✅ OK | |
| 3 étapes avec checkmarks | ✅ OK | |
| Téléphones à droite (desktop) | ✅ OK | |
| Background wave SVG | ✅ OK | |

---

## 5. PREMIUM (Avantages Prémium)

| Élément | Statut | Remarque |
|---------|--------|----------|
| Fond sombre avec image | ✅ OK | |
| Titre blanc + orange | ✅ OK | |
| 4 features avec icônes blanches (desktop) | ✅ OK | |
| **Mobile: layout 1 colonne** | ❌ À corriger | Maquette = 1 feature par ligne, implémentation = grille 2x2 |

---

## 6. FAQ

| Élément | Statut | Remarque |
|---------|--------|----------|
| Titre + barre orange | ✅ OK | |
| Accordion avec +/- | ✅ OK | |
| Réponse avec bordure orange gauche | ✅ OK | |
| Question verte quand ouverte | ✅ OK | |
| Formulaire vert avec pattern | ✅ OK | |
| Mobile: empilé verticalement | ✅ OK | |

---

## 7. CTA (Call to Action)

| Élément | Statut | Remarque |
|---------|--------|----------|
| Fond orange + carte monde | ✅ OK | |
| Titre + description | ✅ OK | |
| Badges téléchargement | ✅ OK | |
| Téléphone (desktop) | ✅ OK | |
| **Mobile: téléphone visible** | ❌ À corriger | Actuellement caché (`hidden md:block`), devrait être visible et centré |

---

## 8. FOOTER

| Élément | Statut | Remarque |
|---------|--------|----------|
| Logo "Fundi" vert | ✅ OK | |
| Description | ✅ OK | |
| "Suivez nous" + icônes sociales | ✅ OK | |
| Copyright bar | ✅ OK | |
| **Texte "Designed by"** | ⚠️ À vérifier | Maquette: "M.DODJI", Code: "SEED SARL" |

---

## 9. PROBLÈMES GLOBAUX

| Problème | Priorité | Détail |
|----------|----------|--------|
| **Tailles de police trop grandes** | 🔴 Haute | Les polices semblent globalement plus grandes sur le site que sur la maquette |
| **Responsive mobile About** | 🔴 Haute | Passer de 2 colonnes à 1 colonne |
| **Responsive mobile Premium** | 🔴 Haute | Passer de 2 colonnes à 1 colonne |
| **Téléphone CTA mobile** | 🔴 Haute | Rendre visible sur mobile |
| **Photos Hero mobile** | 🟡 Moyenne | Ajouter 1-2 photos supplémentaires |

---

## Légende

- ✅ Conforme / Corrigé
- ⚠️ À vérifier
- ❌ À corriger
- 🔴 Priorité haute
- 🟡 Priorité moyenne
- 🟢 Priorité basse
