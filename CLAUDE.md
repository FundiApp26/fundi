# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Fundi is a landing page for a digital tontine (rotating savings group) management mobile app. The website supports French and English languages and is built with HTML + Tailwind CSS.

## Commands

```bash
# Install dependencies
npm install

# Start development (watches for CSS changes)
npm run dev

# Build for production (minifies CSS)
npm run build
```

## Project Structure

```
Fundi/
├── src/
│   ├── index.html      # Main landing page
│   ├── css/
│   │   ├── input.css   # Tailwind input with custom styles
│   │   └── output.css  # Generated CSS (run npm run build)
│   └── js/
│       └── i18n.js     # Translation system (FR/EN)
├── UI Desktop/         # Design assets (images, icons, SVGs)
├── UI Mobile/          # Mobile design reference
├── tailwind.config.js  # Tailwind configuration
└── package.json
```

## Design System

Colors defined in `tailwind.config.js`:
- `fundi-green`: #2D5A27 (primary brand color)
- `fundi-green-light`: #4A7C42
- `fundi-green-button`: #53893D (couleur des boutons verts dans l'app mobile)
- `fundi-orange`: #E87A1E (accent color)
- `fundi-pagination-active`: #FDA810 (tiret actif sur les slides onboarding)
- `fundi-pagination-inactive`: #E6E6E6 (tirets inactifs sur les slides onboarding)
- `fundi-button-shadow`: #A8D496 (ombre portée bouton Welcome — X:0 Y:4 Flou:23)
- `fundi-orange-light`: #F5A623
- `fundi-gray`: #F5F5F5 (background)
- `fundi-dark`: #1A1A1A (text)

Font: Poppins (loaded via Google Fonts)

## Internationalization (i18n)

The site uses a custom vanilla JS translation system:

- Translations are in `src/js/i18n.js` in the `translations` object
- Use `data-i18n="key"` attribute for text content
- Use `data-i18n-placeholder="key"` for input placeholders
- Language preference is stored in localStorage (`fundi-lang`)
- Call `setLanguage('fr')` or `setLanguage('en')` to switch

To add a new translation:
1. Add keys to both `fr` and `en` objects in `i18n.js`
2. Add `data-i18n="your_key"` to the HTML element

## Assets

Images are located in `UI Desktop/Landingpage common safe – Web/`. Key assets:
- Badge SVGs for App Store/Google Play
- Phone mockup images (Groupe 2705, 2727, 2758)
- Feature icons (clipboard, skills, processing, transaction, user)
- Background image for premium section (mobile-app-bg.png)
