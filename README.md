# 🌌 Solar Explorer

A responsive, high-performance, and educational web portal exploring our Solar System, planetary science, space missions, satellite tracking, and official space merchandise.

> **Project Phase Evaluation 2 (A2 - 30% Assessment)**  
> **Focus:** Full Integration of HTML, CSS, and Interactive JavaScript  
> **Rubric Coverage:** JS Syntax & Concepts (10%), DOM Manipulation (10%), Event Handling (5%), HTML/CSS/JS Integration (5%)  
> **Criteria:** C6 (Progress vs Plan), C7 (Technical Understanding), C8 (Problem Solving), C9 (Working Documentation), C10 (Individual Contribution)

---

## 📑 Table of Contents

1. [Project Synopsis & Charter](#-project-synopsis--charter)
2. [Complete Page Directory](#-complete-page-directory)
3. [Phase Evaluation 2 Assessment Matrix](#-phase-evaluation-2-assessment-matrix)
4. [Data Persistence & Storage Architecture (Evaluator Guide)](#-data-persistence--storage-architecture-evaluator-guide)
5. [New Feature: Space Lovers Merchandise & 19-Day Countdown](#-new-feature-space-lovers-merchandise--19-day-countdown)
6. [Interactive Features Breakdown](#-interactive-features-breakdown)
7. [Testing & Demonstration Guide for Evaluators](#-testing--demonstration-guide-for-evaluators)
8. [Project Timeline: Progress vs Plan (C6)](#-project-timeline-progress-vs-plan-c6)
9. [Team Authors & Individual Contributions (C10)](#-team-authors--individual-contributions-c10)

---

## 🔭 Project Synopsis & Charter

**Solar Explorer** is designed as a modular space educational platform and enthusiast hub. It combines deep celestial knowledge, interactive physical calculators, real-time satellite tracking via external space databases, and an upcoming high-end space merchandise showcase with VIP launch allocation.

### Core Objectives
1. **Interactive Scientific Learning:** Present celestial mechanics, orbital periods, surface gravities, and extreme cosmic phenomena through engaging client-side calculations.
2. **Accessible Web Standards:** Provide semantic HTML5 layouts, WCAG 2.1 accessible forms with `aria-live` error states, keyboard navigation, and responsive typography.
3. **Robust Data Persistence:** Implement structured JSON client-side storage (`localStorage`) with unique record identifiers, formatted DevTools console logging for evaluator inspection, and automatic JSON file download.
4. **Minimalist Aesthetic:** Embody a sleek, dark-mode cosmic theme utilizing Google Fonts (`Orbitron` and `Space Grotesk`), custom vector SVG art, and clean responsive CSS.

---

## 🌐 Complete Page Directory

| Page | File | Description & JavaScript Highlights |
|---|---|---|
| **Home** | [`index.html`](index.html) | Planetary voyage overview with smooth scroll navigation and **Feature A: Planet Search**. |
| **The Sun** | [`sun.html`](sun.html) | High-resolution solar profile, core nuclear fusion stats, and solar dynamics. |
| **Extreme Space** | [`extreme.html`](extreme.html) | Black holes, neutron stars, gamma-ray bursts, and **Feature E: Random Cosmic Fact Generator**. |
| **Missions** | [`missions.html`](missions.html) | Historic human spaceflight timeline with **Feature D: Live Mission Search & Filter**. |
| **Fun Space** | [`fun-space.html`](fun-space.html) | Interactive science calculators: **Feature B: Planetary Age Calculator** & **Feature C: Planetary Weight Calculator**. |
| **Satellites** | [`satellites.html`](satellites.html) | Educational orbiter profiles, live filter, and **Feature G: Live CelesTrak SATCAT API Retrieval** (with NOAA fallback). |
| **Space Merchandise** *(New!)* | [`merchandise.html`](merchandise.html) | **Official Space Lovers Drop**: Live 19-day countdown timer, upcoming merchandise preview cards, category filter, VIP pre-registration form with validation, digital boarding pass generator, and JSON storage. |
| **Feedback** | [`feedback.html`](feedback.html) | Multi-field feedback form with client-side validation, unique Record IDs (`FB-...`), browser `localStorage` JSON storage, DevTools logging, and automatic `.json` file download. |
| **The Planets** | [`planets.html`](planets.html) | Dedicated grid catalog of all 8 solar system worlds with quick specs. |

---


## 💾 Data Persistence & Storage Architecture (Evaluator Guide)

When evaluating in the IDE or browser DevTools, the instructor ("sir") can verify where and how the data is stored:

### 1. Storage Location & Medium
- **Target Medium:** Browser `window.localStorage` (retained across page reloads and browser sessions).
- **Feedback Storage Key:** `solarExplorerFeedback`
- **Merchandise Waitlist Storage Key:** `solarExplorerMerchandiseWaitlist`

### 2. Data Format & Structure
Data is stored strictly as a **serialized JSON array of objects (`application/json`)**.

#### Feedback Submission Record:
```json
{
  "id": "FB-1730456123456",
  "name": "Alex Vance",
  "email": "alex@example.com",
  "topic": "Extreme Space",
  "rating": 5,
  "feedback": "The neutron star density comparisons and black hole explanations are phenomenal.",
  "submittedAt": "2026-11-01T10:15:23.456Z"
}
```

#### Merchandise Waitlist Record:
```json
{
  "id": "MERCH-1730456789123",
  "vipPassId": "VIP-ORBIT-4821",
  "name": "Sarah Connor",
  "email": "sarah@deepspace.org",
  "product": "Apollo 11 Translunar Flight Hoodie",
  "size": "Medium",
  "quantity": 1,
  "suggestions": "Would love an ISS trajectory patch!",
  "discount": "20% VIP DISCOUNT",
  "registeredAt": "2026-11-01T10:20:00.000Z"
}
```

### 3. Record Unique Identification (`id`)
Each submitted record automatically generates a unique identifier:
- Feedback: `FB-<timestamp>` (e.g. `FB-1730456123456`)
- Merchandise: `MERCH-<timestamp>` (e.g. `MERCH-1730456789123`)

### 4. How the Evaluator Can Check in the IDE & Browser

The project supports **direct in-IDE JSON file persistence** as well as **browser LocalStorage**:

1. **Direct IDE Workspace Files (`data/*.json`):**
   - Open [`data/feedback.json`](data/feedback.json) and [`data/merchandise.json`](data/merchandise.json) directly in the IDE file tree.
   - When running the project server (`node server.js`), any form submission in the browser writes directly to these `.json` files in the IDE in real time.
2. **Inspect LocalStorage:** Open DevTools (`F12`) -> Click **Application** (or **Storage**) tab -> Select **Local Storage** -> Inspect `solarExplorerFeedback` and `solarExplorerMerchandiseWaitlist`.
3. **Inspect Console Output:** Every submission automatically logs formatted output to the console:
   ```javascript
   [Solar Explorer] Feedback saved to localStorage["solarExplorerFeedback"] in JSON format: { ... }
   [IDE Storage API] Feedback written directly to data/feedback.json: { ... }
   ```
4. **Inspect File Export:** Submitting feedback or pre-orders also triggers an automatic download of `solar-explorer-feedback.json` and `solar-explorer-merchandise.json`.

---

## 🛍️ New Feature: Space Lovers Merchandise & 19-Day Countdown

The new **Merchandise section ([`merchandise.html`](merchandise.html))** provides a clean, minimalist upcoming shop launchpad for space enthusiasts:

### 1. Coming Soon Hero & 19-Day Countdown
- Ticking countdown timer (`DAYS`, `HOURS`, `MINUTES`, `SECONDS`) initialized at **19 days** counting down smoothly.
- Minimalist typography strictly matching the site's dark cosmic theme.

### 2. Curated Merchandise Preview Grid
- 6 curated product cards with realistic mockups and clean minimalist styling matching the design mockup:
  1. **Lunar Bomber Jacket** ($119.00) - Lightweight space-inspired bomber.
  2. **Saturn Orbit Hoodie** ($69.00) - Premium cotton hoodie with orbital design.
  3. **Lunar Phase T-Shirt** ($39.00) - Minimal moon phase graphic tee.
  4. **Astronaut Tee** ($39.00) - Classic tee for space enthusiasts.
  5. **Andromeda Hoodie** ($69.00) - Cozy hoodie featuring the Andromeda Galaxy.
  6. **Explorer Jacket** ($129.00) - All-weather jacket built for explorers.
- **Quick Action:** Clicking **"Pre-order"** on any card smooth-scrolls to the form and auto-selects that item in the dropdown.

### 3. VIP Early Access / Waitlist Form & Boarding Pass
- Client-side validation for name, email, merchandise item, quantity, and consent.
- Generates a **Digital VIP Boarding Pass** in the DOM with a unique code (`VIP-ORBIT-XXXX`) and locked-in **20% early bird discount**.
- Persists submissions into `localStorage['solarExplorerMerchandiseWaitlist']` in JSON format.

---

## ⚙️ Interactive Features Breakdown

1. **Feature A — Planet Search (`index.html`)**: Real-time planet lookup with error handling and smooth auto-scroll to the target world.
2. **Feature B — Planetary Age Calculator (`fun-space.html`)**: Converts Earth age into orbital years across all 8 planets using orbital period physics.
3. **Feature C — Planetary Weight Calculator (`fun-space.html`)**: Calculates equivalent scale readings using celestial surface gravities.
4. **Feature D — Mission Timeline Search (`missions.html`)**: Instant text filter searching mission names, descriptions, and years.
5. **Feature E — Random Cosmic Fact Generator (`extreme.html`)**: Cycle through astrophysics facts with non-repeating random selection.
6. **Feature F & G — Satellite Explorer & CelesTrak API (`satellites.html`)**: Local catalog filter and live asynchronous API query to CelesTrak SATCAT database with a fallback to NOAA Space Weather.
7. **Feature H — Feedback Persistence & Export (`feedback.html`)**: Client-side validation, `localStorage` JSON storage, unique IDs, console logging, and downloadable JSON file.
8. **Feature K — Merchandise 19-Day Countdown & Waitlist (`merchandise.html`)**: 19-day countdown timer, product filtering, waitlist form, VIP boarding pass generator, and JSON persistence.
9. **Feature I — Scroll Reveal Animations**: IntersectionObserver-based entrance transitions respecting `prefers-reduced-motion`.

---

##

---

## 👥 Team Authors & Individual Contributions (C10)

| Contributor | Primary Modules & Responsibilities | Specific Second Evaluation Deliverables |
|---|---|---|
| **Pratham** | Core Architecture, Data Persistence & Form Handlers | Implemented `localStorage` JSON storage engine, unique ID generation algorithm (`FB-...` / `MERCH-...`), and DevTools inspection logging. |
| **Harsheet** | Merchandise Waitlist & VIP Pass Generation | Developed the 19-day live countdown timer, merchandise category filtering system, and digital VIP boarding pass generator. |
| **Aviraj** | API Integrations & Asynchronous Logic | Built CelesTrak Satellite Catalog (SATCAT) query integration, error handling pipelines, NOAA space weather fallback, and downloadable JSON blob generators. |
| **Samarth** | Interactive Calculators & Search Systems | Authored the Planetary Age Calculator, Planetary Weight Calculator, Planet Search system (`index.html`), and Mission Timeline search filter (`missions.html`). |
| **Shivansh** | UI/UX Design System, SVG Art & Accessibility | Implemented responsive layout styling, bespoke vector merchandise illustrations, WCAG 2.1 accessible form validation, and `prefers-reduced-motion` compliance. |

---

*Solar Explorer — Developed for Web Development Mid-Term Project Phase Evaluation 2 (A2).*
