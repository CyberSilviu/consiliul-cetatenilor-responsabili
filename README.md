# Director de școală pentru 2 minute

Joc interactiv educațional creat pentru **Gala Premiilor Directorilor 2025** organizat de Asociația pentru Valori în Educație (AVE).

![Game Banner](public/assets/images/background.jpg)

## 📋 Cuprins

- [Despre Joc](#despre-joc)
- [Caracteristici](#caracteristici)
- [Setup Tehnic](#setup-tehnic)
- [Documentație](#documentație)
- [Tehnologii](#tehnologii)
- [Structura Proiectului](#structura-proiectului)

## 🎮 Despre Joc

**"Director de școală pentru 2 minute"** este o experiență interactivă care pune participanții în rolul unui director de școală cu provocarea de a gestiona un buget de €450,000 în doar 2 minute.

### Obiectiv

Jucătorii trebuie să:
- Aloce bugetul strategic între 30 de provocări diferite
- Echilibreze 3 categorii: **Antreprenoriat**, **Egalitate de Șanse**, și **Inovare**
- Atingă minimum 50% în fiecare categorie
- Cheltuiască aproape tot bugetul (maxim €25,000 rămas - 5% toleranță)

### Context

Jocul simulează presiunea reală a unui director de școală:
- ⏱️ **Timp limitat** - 2 minute pentru decizii critice
- 💰 **Buget finit** - €450,000 pentru toate nevoile
- 📞 **Întreruperi** - Apeluri telefonice de la inspectorat
- 🎯 **Echilibru** - Toate domeniile trebuie acoperite

## ✨ Caracteristici

### Gameplay
- **30 de provocări** împărțite în 3 categorii
- **Sistem de timp real** cu numărătoare inversă de 2 minute
- **Apeluri telefonice** de la inspectorat (cu penalități de timp)
- **Undo nelimitat** pentru a permite experimentarea
- **Muzică de fundal** care accelerează când timpul scade

### Interfață
- **Tastatură virtuală** cu caractere românești (Ă, Â, Î, Ș, Ț)
- **Bare de progres** animate pentru fiecare categorie
- **Design responsive** optimizat pentru touchscreen (9:16 aspect ratio)
- **Feedback vizual** pentru toate acțiunile

### Sistem de Punctaj
- **Scor maxim:** 1000 de puncte
- **Bonus timp:** până la 500 puncte (bazat pe cât de repede finalizezi)
- **Bonus categorii:** până la 500 puncte (bazat pe echilibrul categoriilor)
- **Leaderboard:** percentile ranking față de jucători anteriori

### Colectare Date
- Salvare automată locală a rezultatelor
- Export CSV/JSON pentru analiză
- Suport multi-totem (4 dispozitive simultan)
- Tracking detaliat al deciziilor jucătorului

### Panou Administrare (Hidden)
- Acces securizat doar prin tastatură: **Ctrl+Shift+A**
- Export date (JSON/CSV)
- Debug info și statistici live
- Control audio (mute/unmute)
- Reset date cu dublă confirmare obligatorie
- Fără elemente UI vizibile (securitate kiosk)

## 🚀 Setup Tehnic

### Cerințe Sistem
- Node.js 18+ și npm
- Browser modern (Chrome, Firefox, Edge)
- 1GB RAM disponibil
- Conexiune la internet (pentru fonturi și assets)

### Instalare Rapidă

```bash
# 1. Clonează repository-ul
cd game-app

# 2. Instalează dependențele
npm install

# 3. Rulează în modul dezvoltare
npm run dev

# 4. Deschide browser la
http://localhost:5173
```

### Build pentru Producție

```bash
# Build
npm run build

# Preview build-ul
npm run preview

# Deploy folder-ul dist/
```

### Configurare Totem

Pentru rulare pe totem kiosk:

1. **Build aplicația**
   ```bash
   npm run build
   ```

2. **Configurează browser în modul kiosk**
   ```bash
   # Chrome kiosk mode
   chrome.exe --kiosk --app=file:///path/to/dist/index.html
   ```

3. **Setează Totem ID** (în browser console)
   ```javascript
   localStorage.setItem('totem-id', '1'); // 1-4
   ```

Pentru detalii complete, vezi [SETUP.md](./docs/SETUP.md)

## 📚 Documentație

- **[SETUP.md](./docs/SETUP.md)** - Ghid complet de instalare și configurare
- **[USER_GUIDE.md](./docs/USER_GUIDE.md)** - Ghid pentru utilizatori non-tehnici

## 🛠️ Tehnologii

### Core
- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool & dev server

### State & Logic
- **Zustand** - State management (lightweight & performant)
- **Framer Motion** - Animații fluide
- **Howler.js** - Audio management

### UI & Styling
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Icon library
- **Canvas Confetti** - Victory animations

### Development
- **ESLint** - Code linting
- **TypeScript** - Static typing
- **Vite HMR** - Hot module replacement

## 📁 Structura Proiectului

```
game-app/
├── public/
│   ├── assets/
│   │   ├── audio/          # SFX și muzică
│   │   └── images/         # Logo și grafice
│   └── game-config.json    # Configurare runtime (nefolosit)
├── src/
│   ├── components/
│   │   ├── screens/        # Ecrane principale (Start, Game, Won, Timeout)
│   │   ├── popups/         # Modal-uri (Phone, Instructions, etc)
│   │   └── ui/             # Componente refolosibile
│   ├── config/             # Config loader (experimentale)
│   ├── data/
│   │   ├── gameData.ts     # Date joc (provocări, categorii)
│   │   └── types.ts        # TypeScript interfaces
│   ├── store/
│   │   └── gameStore.ts    # Zustand state management
│   ├── utils/
│   │   ├── gameLogic.ts    # Logica de joc
│   │   ├── audioController.ts  # Control audio
│   │   ├── storage.ts      # localStorage wrapper
│   │   └── exportData.ts   # Export CSV/JSON
│   ├── App.tsx             # Root component
│   └── main.tsx            # Entry point
├── docs/                   # Documentație detaliată
└── dist/                   # Build output (generat)
```

## 🎯 Caracteristici Cheie

### Echilibrare Joc (v2.0)
- **Formula contribuție:** Cost ÷ 2,500 = puncte procentuale
- **Toleranță buget:** ≤ €25,000 rămas (5% toleranță - nu exact €0)
- **50+ combinații câștigătoare** posibile

### Sisteme Apeluri
- **Primul apel:** 30 secunde în joc (-10s dacă răspunzi)
- **Al doilea apel:** 60 secunde în joc (-15s dacă răspunzi, doar dacă ai ignorat primul)

### Colectare Date
- Auto-save în localStorage
- Tracking complet decizii
- Export pentru analiză
- Statistici agregat

## 🔧 Comenzi NPM

```bash
# Development
npm run dev          # Start dev server
npm run build        # Build pentru producție
npm run preview      # Preview build local

# Code Quality
npm run lint         # Run ESLint
npm run typecheck    # Check TypeScript

# Deployment
npm run deploy       # Build + deploy (dacă configurat)
```

## 📊 Statistici Proiect

- **30 provocări** cu costuri între €20k-€70k
- **3 categorii** echilibrate
- **1000 puncte** maxim posibil
- **120 secunde** timp de joc
- **50%** prag minim per categorie
- **€450,000** buget total

## 🎨 Brand & Design

- **Culori principale:**
  - Background: `#0e0513` (deep purple-black)
  - Accent: `#51bdf3` (cyan-blue)
  - Categorii: Green, Purple, Blue

- **Fonturi:**
  - Primary: Poppins (300-800)
  - Secondary: Roboto

- **Aspect Ratio:** 9:16 (portrait, optimizat pentru totem)

## 👥 Echipa

Dezvoltat pentru **Asociația pentru Valori în Educație (AVE)**
Gala Premiilor Directorilor 2025

## 📝 Licență

Proprietar - © 2025 Asociația pentru Valori în Educație

---

**🔗 Link-uri Utile:**
- [Documentație Completă](./docs/)
- [Issues & Bug Reports](https://github.com/anthropics/claude-code/issues)
- [AVE Website](https://www.valoriineducatie.ro/)

Pentru întrebări tehnice, consultați [SETUP.md](./docs/SETUP.md).
Pentru ghid utilizare, consultați [USER_GUIDE.md](./docs/USER_GUIDE.md).
