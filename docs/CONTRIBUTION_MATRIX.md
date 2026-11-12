# 👥 SOLAR EXPLORER — INDIVIDUAL CONTRIBUTION & RUBRIC MAPPING MATRIX
**Phase Evaluation 3 (A3 End-Term Assessment — 40% Weightage)**  
**Assessment Criteria:**  
- **C11:** Final Product / Solution  
- **C12:** Technical Depth  
- **C13:** Innovation / Application  
- **C14:** Presentation & Communication  
- **C15:** Individual Contribution & Learning  

---

## 1. Executive Contribution Summary

| Member Name | Primary Technical Domain | Specific Architectural Modules Delivered | Rubric Focus |
|---|---|---|---|
| **Pratham** | Full-Stack Architecture & Backend Lead | Node.js/Express server bootstrap, Mongoose ODM schemas, RESTful API endpoints (`/api/feedback`, `/api/merchandise`, `/api/satellites/*`, `/api/quiz`), MongoDB persistence, and dual-storage fallback engine. | C11, C12, C15 |
| **Harsheet** | E-Commerce & Interactive Logic Lead | Space Merchandise drop showcase, drift-compensated 19-day countdown timer, pre-order catalog filtering, and Digital VIP Boarding Pass generator with coupon locking. | C11, C13, C15 |
| **Aviraj** | Asynchronous Integration & External API Lead | CelesTrak NORAD SATCAT live API integration, Wheretheiss orbital telemetry tracking, satellite watchlist persistence, and network fault-tolerance failover. | C12, C13, C15 |
| **Samarth** | Scientific Computations & Search Engines Lead | Keplerian Planetary Age Calculator, Newton-gravitational Planetary Weight Calculator, real-time Planet Search, and Cosmic Knowledge Quiz with leaderboard. | C11, C12, C15 |
| **Shivansh** | UI/UX Engineering, EJS Templates & Accessibility Lead | EJS view engine setup & modular partials (`header`, `navbar`, `footer`), `/telemetry` SSR view, WCAG 2.1 AA accessible forms (`aria-live`), and dark cosmic design tokens. | C11, C14, C15 |

---

## 2. Detailed Individual Breakdown Across Criteria C11–C15

### 👤 1. PRATHAM (Lead Full-Stack Architect & Backend Engineer)
- **Node.js & Express.js Setup (Assessment 10%):** Architected the main Express application (`server.js`), implemented environment configuration, structured route handlers, and configured middleware (`express.json()`, `cors()`).
- **MongoDB Operations via Mongoose ODM (Assessment 5%):** Designed and deployed Mongoose schemas with strict validations, unique indexing, email regular expressions, and lifecycle timestamps.
- **Frontend-Backend Data Flow (Assessment 15%):** Authored the dual-mode data persistence pipeline enabling asynchronous Fetch calls from client pages to write directly into MongoDB and fallback IDE JSON records.
- **C11–C15 Alignment:** Ensured complete system stability, zero server crashes under malformed JSON payloads, and clean HTTP status code returns (200, 201, 400, 500).

---

### 👤 2. HARSHEET (E-Commerce & Interactive Logic Lead)
- **Merchandise Showcase & Launch Engine (`merchandise.html`):** Developed the complete product catalog layout featuring 6 space-themed items with category filtering and dynamic pricing.
- **19-Day Launch Countdown Timer (Innovation 5%):** Created the high-precision JavaScript countdown clock with mathematical modulo time breakdown (`days`, `hours`, `minutes`, `seconds`).
- **VIP Early Access & Digital Boarding Pass Generator:** Implemented the pre-order workflow that dynamically constructs a high-tech boarding pass in the DOM with unique voucher codes (`VIP-ORBIT-XXXX`) and 20% discount locking.
- **C11–C15 Alignment:** Delivered an intuitive, bug-free e-commerce pre-order flow with instant visual feedback and smooth scroll interactions.

---

### 👤 3. AVIRAJ (Asynchronous Integration & External API Lead)
- **Live Satellite Telemetry & Tracker (`satellites.html`):** Connected the frontend to live satellite telemetry APIs, retrieving real-time orbital velocity, altitude, and latitude/longitude coordinates.
- **Network Resilience & Failover (Assessment 15%):** Engineered network error-handling pipelines with automatic fallback triggers when external APIs are unreachable.
- **Satellite Watchlist Persistence:** Authored asynchronous CRUD operations against `/api/satellites/watchlist` with persistent database storage.
- **C11–C15 Alignment:** Exhibited strong command of asynchronous JavaScript (`async/await`, Promises), HTTP headers, and rate-limiting handling.

---

### 👤 4. SAMARTH (Scientific Computations & Search Engines Lead)
- **Planetary Age Calculator (`fun-space.html`):** Programmed the celestial orbital mechanics calculator utilizing Keplerian orbital period coefficients for all 8 solar system planets.
- **Planetary Weight Calculator (`fun-space.html`):** Authored the gravitational acceleration calculator using planetary surface gravity factors ($g_{planet} / g_{Earth}$).
- **Interactive Space Quiz & Leaderboard:** Created an engaging 5-question cosmic trivia challenge that computes scores and submits them to the backend leaderboard (`/api/quiz`).
- **C11–C15 Alignment:** Implemented highly responsive interactive calculators with zero runtime NaN errors and instant DOM updates.

---

### 👤 5. SHIVANSH (UI/UX Engineering, EJS Templates & Accessibility Lead)
- **Template Engines & Static Files (Assessment 5%):** Structured the EJS templating hierarchy, authored modular layout partials (`header.ejs`, `navbar.ejs`, `footer.ejs`), and created the live Server-Side Rendered Space Telemetry view at `/telemetry`.
- **Design System & Typography:** Crafted the dark cosmic theme utilizing CSS Grid, Flexbox, custom SVG artwork, and Google Fonts (`Orbitron` & `Space Grotesk`).
- **WCAG 2.1 AA Accessibility & Animations:** Implemented `aria-live` form status regions, color-contrast-compliant palettes, keyboard focus indicators, and `prefers-reduced-motion` animation fallbacks.
- **C11–C15 Alignment:** Created a polished, modern, and accessible visual interface that provides a cohesive aesthetic across all pages.

---

## 3. Rubric Assessment Scorecard (Self & Peer Evaluation)

| Student Name | C11: Final Product (10) | C12: Tech Depth (10) | C13: Innovation (10) | C14: Presentation (5) | C15: Contribution (5) | Total (40%) |
|---|---|---|---|---|---|---|
| **Pratham** | 9.8 | 9.9 | 9.6 | 4.9 | 5.0 | **39.2 / 40** |
| **Harsheet** | 9.7 | 9.6 | 9.8 | 4.9 | 5.0 | **39.0 / 40** |
| **Aviraj** | 9.7 | 9.8 | 9.7 | 4.8 | 5.0 | **39.0 / 40** |
| **Samarth** | 9.8 | 9.6 | 9.6 | 4.9 | 5.0 | **38.9 / 40** |
| **Shivansh** | 9.9 | 9.7 | 9.6 | 4.9 | 5.0 | **39.1 / 40** |
| **Team Average** | **9.78** | **9.72** | **9.66** | **4.88** | **5.00** | **39.04 / 40 (97.6%)** |

