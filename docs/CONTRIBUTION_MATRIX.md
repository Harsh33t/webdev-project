# 👥 SOLAR EXPLORER — FINAL GROUP & SELF CONTRIBUTION MATRIX
**Course:** Web Development & Full-Stack Software Engineering  
**Evaluation:** Phase Evaluation 3 (A3 End-Term Assessment — 40% Course Weightage)  
**Academic Year:** Fall/Winter 2026  
**Engineering Team:**
1. **Pratham** (Full-Stack Architecture & Database Lead)
2. **Harsheet** (E-Commerce Systems & Interactive Logic Lead)
3. **Aviraj** (Asynchronous Integration & External Telemetry Lead)
4. **Samarth** (Scientific Astrophysics Computations & Search Lead)
5. **Shivansh** (UI/UX Engineering, EJS SSR & Accessibility Lead)

---

## 1. Executive Domain Assignment Summary

| Member Name | Assigned Technical Domain | Key Modules & Code Artifacts Owned | Evaluation Criteria Focus |
|---|---|---|---|
| **Pratham** | Full-Stack Architecture, Database Persistence & Testing Lead | `server.js`, `routes/apiRoutes.js`, `models/` (User, Observation, Order, etc.), `services/storageService.js` (Dual-Storage Fallback Engine), `controllers/observationController.js`, `Solar_Explorer_API.postman_collection.json`, `docs/FINAL_PROJECT_REPORT.md` | C11, C12, C15 |
| **Harsheet** | E-Commerce Engine, Pre-Order Systems & Interactive Checkout Lead | `merchandise.html`, `controllers/orderController.js`, `models/Merchandise.js`, `models/Order.js`, `services/emailService.js` (Dark HTML Receipt generator), 19-Day Launch Countdown Clock, Digital VIP Boarding Pass generator | C11, C13, C15 |
| **Aviraj** | Asynchronous Network Pipelines & Live Telemetry Lead | `satellites.html`, `controllers/satelliteController.js`, `models/SatelliteTrack.js`, CelesTrak NORAD SATCAT gateway, WhereTheISS telemetry client, NOAA Space Weather API, AbortController timeout failovers | C12, C13, C15 |
| **Samarth** | Scientific Astrophysics Calculations & Gamified Quiz Lead | `fun-space.html`, `missions.html`, `controllers/quizController.js`, `models/QuizScore.js`, Keplerian Planetary Age Calculator ($T^2 \propto a^3$), Newtonian Surface Gravity Weight Calculator ($g = GM/R^2$), Real-time DOM search engine | C11, C12, C15 |
| **Shivansh** | UI/UX Engineering, EJS SSR Templating & Accessibility Lead | `views/dashboard.ejs`, `views/telemetry.ejs`, `views/partials/` (`header.ejs`, `navbar.ejs`, `footer.ejs`), `style.css` (Dark cosmic design tokens, CSS Grid/Flexbox), `feedback.html`, WCAG 2.1 AA accessible forms (`aria-live`) | C11, C14, C15 |

---

## 2. In-Depth Technical Breakdown by Team Member

### 👤 1. PRATHAM (Lead Full-Stack Architect & Database Persistence Engineer)
- **Node.js & Express.js Setup (Rubric Weightage: 10%):**
  - Architected the core Express application in `server.js` featuring clean middleware sequencing: CORS security headers, payload buffer bounds (`express.json({ limit: '5mb' })`), and centralized error logging.
  - Designed the decoupled MVC router hierarchy (`routes/apiRoutes.js` and `routes/viewRoutes.js`).
- **MongoDB Operations via Mongoose ODM (Rubric Weightage: 5%):**
  - Designed seven production Mongoose schemas with strict data typing, RFC email regex, required field assertions, and lifecycle timestamps.
  - Implemented the complete **Celestial Observations CRUD subsystem** (`POST`, `GET`, `GET /:id`, `PATCH /:id`, `DELETE /:id`) in `controllers/observationController.js` and `models/Observation.js`.
- **Resilient Dual-Storage Fallback Engine:**
  - Engineered the abstraction layer in `services/storageService.js` enabling dynamic sensing of MongoDB connectivity. Automatically redirects CRUD operations to structured JSON files (`data/observations.json`, `data/users.json`, etc.) if MongoDB is offline, guaranteeing 100% viva uptime.
- **Automated Postman Test Suite:**
  - Authored the exportable `Solar_Explorer_API.postman_collection.json` (Postman v2.1.0) containing 19 test endpoints across 5 modules with automated JavaScript assertions for status codes (200, 201, 400, 401, 404, 500).
- **Security & Authentication:**
  - Built salted cryptographic password hashing (`crypto` SHA-256 + `bcryptjs`) ensuring zero plain-text password exposure.

---

### 👤 2. HARSHEET (E-Commerce Systems & Interactive Logic Lead)
- **E-Commerce Checkout & Pre-Order Architecture (`merchandise.html`):**
  - Developed the responsive 6-item merchandise preview catalog with category filtering and dynamic pricing calculation.
  - Programmed the complete order placement controller (`controllers/orderController.js`) handling cart subtotals, shipping calculations, and order status updates (`PATCH /api/orders/:id/status`).
- **High-Precision 19-Day Launch Countdown Clock (Innovation 5%):**
  - Created the mathematical modulo time breakdown interval engine (`days`, `hours`, `minutes`, `seconds`) in client JavaScript with drift compensation.
- **Digital VIP Launch Pass Generator:**
  - Built the client-side boarding pass generator in `merchandise.html` that synthesizes an interactive boarding pass in the DOM with unique voucher codes (`VIP-ORBIT-XXXX`) and locked 20% discount badges.
- **Dark-Themed Celestial HTML Email Invoices (`services/emailService.js`):**
  - Designed the custom dark-mode, cosmic-styled HTML receipt generator. Integrated direct in-browser inspection at `/api/orders/:id/receipt` and Nodemailer asynchronous dispatch.

---

### 👤 3. AVIRAJ (Asynchronous Integration & External Telemetry Lead)
- **Live Orbital Telemetry & Real-Time Tracking (`satellites.html`):**
  - Integrated external space science APIs (WhereTheISS and CelesTrak NORAD SATCAT) to stream real-time orbital velocity (~27,600 km/h), altitude (~420 km), and sub-satellite coordinates.
  - Programmed the Ground Station Pass Predictor (`/api/satellites/passes`) calculating overhead visible passes for specified observer coordinates.
- **Asynchronous Network Resilience & Failover (Rubric Weightage: 15%):**
  - Built network fault-tolerance using native `AbortController` timeouts (2000–4000 ms) to prevent slow external APIs from hanging the client UI or server thread.
  - Authored the autonomous offline mathematical orbital propagation fallback calculating simulated Keplerian ground tracks during network outages.
- **Satellite Watchlist Persistence:**
  - Implemented the database-backed orbital watchlist (`POST/GET/DELETE /api/satellites/watchlist`) supporting NORAD catalog tracking.

---

### 👤 4. SAMARTH (Scientific Astrophysics Computations & Search Lead)
- **Keplerian Planetary Age Calculator (`fun-space.html`):**
  - Programmed the planetary age conversion engine based on Kepler's Third Law of Planetary Motion ($T^2 \propto a^3$), converting Earth years into planetary orbital years across Mercury, Venus, Mars, Jupiter, Saturn, Uranus, and Neptune.
- **Newtonian Gravitational Weight Calculator (`fun-space.html`):**
  - Engineered the celestial weight transformation engine utilizing calibrated surface gravitational accelerations ($g = G M / R^2$), handling edge-case validation and unit conversion with zero NaN errors.
- **Gamified Cosmic Astrophysics Quiz & Leaderboard:**
  - Authored the 5-question astrophysics trivia pool and evaluation controller (`controllers/quizController.js`).
  - Implemented dynamic cosmic rank tiering (*Space Cadet* $\rightarrow$ *Orbital Navigator* $\rightarrow$ *Senior Flight Director* $\rightarrow$ *Chief Galactic Astrophysicist*) with persistent database leaderboard logging (`/api/quiz/leaderboard`).
- **Instant Client-Side Search Engines:**
  - Programmed instantaneous, zero-latency DOM filtering across planetary databases and historic mission timelines (`index.html`, `missions.html`).

---

### 👤 5. SHIVANSH (UI/UX Engineering, EJS SSR & Accessibility Lead)
- **Template Engines & Modular Partials (Rubric Weightage: 5%):**
  - Configured the Express EJS view engine and designed the reusable layout partials hierarchy: `views/partials/header.ejs`, `navbar.ejs`, and `footer.ejs`.
  - Built the Server-Side Rendered Mission Control Telemetry view at `/telemetry`, dynamically compiling system health, database state, live ISS coordinates, and team rosters on the server.
- **Dark Cosmic Design System & CSS Architecture (`style.css`):**
  - Formulated the dark-mode cosmic aesthetic utilizing CSS Custom Properties (variables), CSS Grid, Flexbox, custom SVG celestial artwork, and Google Fonts (`Orbitron` & `Space Grotesk`).
  - Engineered responsive viewport breakpoints ensuring optimal display across mobile (375px), tablet (768px), and ultra-wide desktop monitors (1920px+).
- **WCAG 2.1 Level AA Accessibility Compliance:**
  - Implemented dynamic `aria-live="polite"` feedback regions on forms to ensure screen-reader announcements.
  - Added visible keyboard focus rings (`:focus-visible`) and integrated CSS `prefers-reduced-motion` media queries to support motion-sensitive users.

---

## 3. Rubric Assessment Scorecard (Self & Peer Evaluation Across C11–C15)

Evaluation Criteria:
- **C11: Final Product / Solution (10 Marks):** Functional completeness, robustness, bug-free operation.
- **C12: Technical Depth (10 Marks):** MVC modularity, Mongoose schemas, async protocols, status codes.
- **C13: Innovation / Application (10 Marks):** Scientific calculators, live telemetry, VIP boarding pass, dark receipts.
- **C14: Presentation & Communication (5 Marks):** Academic report quality, slide deck, Postman documentation.
- **C15: Individual Contribution & Learning (5 Marks):** Domain mastery, code ownership, teamwork.

| Team Member Name | Assigned Role | C11 (10) | C12 (10) | C13 (10) | C14 (5) | C15 (5) | Total (40%) |
|---|---|---|---|---|---|---|---|
| **Pratham** | Full-Stack Architecture & DB Lead | 9.9 | 10.0 | 9.7 | 4.9 | 5.0 | **39.5 / 40 (98.7%)** |
| **Harsheet** | E-Commerce & Interactive Lead | 9.8 | 9.7 | 9.9 | 4.9 | 5.0 | **39.3 / 40 (98.2%)** |
| **Aviraj** | Asynchronous Telemetry Lead | 9.8 | 9.9 | 9.8 | 4.8 | 5.0 | **39.3 / 40 (98.2%)** |
| **Samarth** | Scientific Computations Lead | 9.8 | 9.7 | 9.8 | 4.9 | 5.0 | **39.2 / 40 (98.0%)** |
| **Shivansh** | UI/UX & EJS Templating Lead | 9.9 | 9.8 | 9.7 | 5.0 | 5.0 | **39.4 / 40 (98.5%)** |
| **Consolidated Team Score** | **Full Team A3 Average** | **9.84** | **9.82** | **9.78** | **4.90** | **5.00** | **39.34 / 40 (98.35%)** |

---

## 4. Academic Integrity & Individual Verification Declaration

We hereby certify that the deliverables submitted for Phase Evaluation 3 (A3 End-Term Assessment) of Solar Explorer represent original engineering work authored collaboratively by the undersigned team members. Every technical component—including the Express MVC backend, Mongoose ODM schemas, dual-storage fallback engine, EJS SSR templates, astrophysics simulators, and Postman test suite—has been verified through automated test suites and peer code reviews.

- **Signed:**
  - *Pratham* — Lead Full-Stack Architect & Database Persistence Engineer
  - *Harsheet* — E-Commerce Systems & Interactive Logic Lead
  - *Aviraj* — Asynchronous Integration & External Telemetry Lead
  - *Samarth* — Scientific Astrophysics Computations Lead
  - *Shivansh* — UI/UX Engineering & EJS Templating Lead


### Updated Contribution Breakdown - Final Audit
| Team Member | Module | Deliverable | Status |
| :--- | :--- | :--- | :--- |
| Pratham Singh | Dashboard & Minimalist UI | Metric stabilization, order tracking form, observation CRUD | Completed (100%) |
| Aviraj Singh | Satellites & Live Radar | Find ISS Location, canvas radar engine, CelesTrak proxy | Completed (100%) |
| Harsheet Patel | Merch & Route Gateway | API route aliasing, order persistence verification, email invoices | Completed (100%) |
| Samarth Sharma | Auth & Pass Prediction | Pass prediction tests, watchlist CRUD, dual-storage persistence | Completed (100%) |
| Shivansh Gupta | NOAA SWPC & System Testing | Space weather 2x2 grid, test suites, API gateway validation | Completed (100%) |
