# 🌌 SOLAR EXPLORER — FINAL TECHNICAL PROJECT REPORT
**Phase Evaluation 3 (A3 End-Term Assessment — 40% Weightage)**  
**Course:** Web Development & Full-Stack Engineering  
**Submission Date:** November 2026  
**Team Members:**  
1. **Pratham** (Full-Stack Architect & Backend Lead)  
2. **Harsheet** (E-Commerce & Interactive Logic Lead)  
3. **Aviraj** (Asynchronous Integration & External API Lead)  
4. **Samarth** (Scientific Computations & Search Engines Lead)  
5. **Shivansh** (UI/UX Engineering, EJS Templates & Accessibility Lead)

---

## 1. Project Synopsis & Executive Summary

**Solar Explorer** is a high-performance, responsive full-stack web application engineered to bridge the gap between rigorous astrophysics education and contemporary web technologies. Built from the ground up across three evolutionary phases (A1: Semantic Design & UI/UX; A2: Client-side Interactivity & Asynchronous Data; A3: Full-Stack Integration with Node.js, Express.js, MongoDB/Mongoose ODM, and Server-Side Rendering), the application serves as an interactive scientific encyclopedia, live telemetry satellite hub, and an exclusive celestial merchandise drop portal.

### 1.1 Core Objectives
- **Full-Stack Architectural Cohesion:** Seamlessly connect client-side Single Page Application (SPA) features with an Express.js RESTful API, server-side EJS templating, and persistent document storage via MongoDB Atlas / Mongoose ODM.
- **Scientific Fidelity:** Provide accurate physical simulations, including Keplerian orbital mechanics calculations, Newton-gravitational planetary weight conversions, and real-time NORAD Two-Line Element (TLE) satellite tracking via external space databases.
- **Enterprise-Grade Data Persistence & Validation:** Enforce schema-level constraints, bi-directional input sanitization (client-side HTML5/regex and server-side Mongoose validation), structured error handling, and transactional database updates.
- **Universal Accessibility & Ergonomics:** Deliver a dark-mode cosmic aesthetic conforming strictly to WCAG 2.1 Level AA standards, responsive CSS Grid/Flexbox layouts, and `prefers-reduced-motion` compliance.

---

## 2. System Architecture & Component Diagram

Solar Explorer implements a layered Model-View-Controller (MVC) architectural pattern coupled with a decoupled REST API subsystem for dynamic asynchronous client requests.

```
+-----------------------------------------------------------------------------------+
|                                  CLIENT TIER                                      |
|  +--------------------+  +--------------------+  +-----------------------------+  |
|  |   HTML5 / CSS3     |  |   JavaScript ES6+  |  |    EJS Dynamic Views        |  |
|  | - Dark Theme UI    |  | - DOM Controllers  |  | - Server-Side Rendered      |  |
|  | - Responsive Grid  |  | - Async Fetch API  |  | - Partials (Nav/Header/Foot)|  |
|  | - Accessible Forms |  | - Physics Engines  |  | - Dynamic Data Injection    |  |
|  +--------------------+  +--------------------+  +-----------------------------+  |
+------------------------------------------+----------------------------------------+
                                           | HTTP Requests (JSON / Multi-Part)
                                           v
+-----------------------------------------------------------------------------------+
|                            APPLICATION / SERVER TIER                              |
|                       Node.js Runtime & Express.js Engine                         |
|                                                                                   |
|  +-----------------------------------------------------------------------------+  |
|  | Middleware Stack: CORS, Morgan Logger, Express.json, Express.urlencoded     |  |
|  +-----------------------------------------------------------------------------+  |
|                                          |                                        |
|         +--------------------------------+-------------------------------+        |
|         v                                                                v        |
|  +-----------------------------+                  +----------------------------+  |
|  |     REST API Controllers    |                  |    SSR Page Controllers    |  |
|  | - POST/GET /api/feedback    |                  | - GET /                    |  |
|  | - POST/GET /api/merchandise |                  | - GET /telemetry (SSR)     |  |
|  | - GET /api/satellites/*     |                  | - GET /dashboard           |  |
|  | - POST/GET /api/quiz        |                  |                            |  |
|  +-----------------------------+                  +----------------------------+  |
+------------------------------------------+----------------------------------------+
                                           | ODM Operations (Mongoose Driver)
                                           v
+-----------------------------------------------------------------------------------+
|                                 DATA PERSISTENCE TIER                             |
|  +-----------------------------------------------------------------------------+  |
|  |                             Mongoose 8.x ODM Layer                          |  |
|  |  - Strict Schemas & Types    - Lifecycle Hooks       - Index Optimizations  |  |
|  |  - RegEx Validators         - Dual-Storage Fallback - Error Middleware      |  |
|  +-----------------------------------------------------------------------------+  |
|                                          |                                        |
|         +--------------------------------+-------------------------------+        |
|         v                                                                v        |
|  +-----------------------------+                  +----------------------------+  |
|  |       MongoDB Database      |                  |   Resilient JSON Engine    |  |
|  | - feedbacks, merchandises   |                  | - data/feedback.json       |  |
|  | - watchlists, quizscores    |                  | - data/merchandise.json    |  |
|  +-----------------------------+                  +----------------------------+  |
+-----------------------------------------------------------------------------------+
                                           |
                                           +---> [External CelesTrak / NOAA / Wheretheiss APIs]
```

### 2.1 Layered Data Flow Specification
1. **Request Ingestion:** The client dispatches asynchronous `fetch()` requests carrying serialized JSON payloads with headers `{ 'Content-Type': 'application/json' }`.
2. **Middleware Pipeline:** Incoming requests traverse:
   - `cors()` for cross-origin request security.
   - `express.json({ limit: '1mb' })` to safely parse incoming JSON payloads.
   - `morgan('dev')` for structured HTTP telemetry logging.
   - `express.static()` to serve static assets (images, stylesheets, client scripts).
3. **Controller Execution:** Business controllers validate incoming parameters, extract normalized fields, and interface with Mongoose model methods.
4. **ODM Transaction & Fallback:** Mongoose executes schema validation, regex constraints, and executes atomic operations against MongoDB. If MongoDB is offline, a graceful dual-storage fallback persists changes directly to local structured JSON records without server interruption.
5. **Structured Response:** The API returns standard HTTP status codes (`200 OK`, `201 Created`, `400 Bad Request`, `500 Internal Server Error`) accompanied by consistent JSON envelopes.

---

## 3. Technology Stack & Environment Specifications

| Category | Technology | Version | Purpose in Solar Explorer |
|---|---|---|---|
| **Frontend Core** | HTML5 / Semantic Elements | Latest | Structural markup, WCAG accessibility, form containers |
| **Styling & Design** | CSS3 / Custom Properties | Latest | Dark cosmic design system, CSS Grid, Flexbox, Keyframes |
| **Typography** | Google Fonts (`Orbitron`, `Space Grotesk`) | Web Fonts | Futuristic display headings and high-legibility scientific body text |
| **Client Scripting** | JavaScript (ES6+ ECMAScript) | Modern | DOM manipulation, calculators, countdown timer, async fetch |
| **Server Runtime** | Node.js | v20.x+ LTS | Server environment, asynchronous event loop, file streaming |
| **Backend Framework** | Express.js | v4.21+ | Routing engine, REST API endpoints, middleware pipeline |
| **Template Engine** | EJS (Embedded JavaScript) | v3.1+ | Dynamic server-side page rendering, modular partials |
| **Database** | MongoDB / MongoDB Atlas | v7.0+ | Document-oriented NoSQL database for flexible celestial schemas |
| **Object Data Mapper** | Mongoose ODM | v8.x | Schema validation, business modeling, query middleware |
| **External APIs** | CelesTrak NORAD SATCAT, Wheretheiss, NOAA | REST/JSON | Live satellite catalog tracking, orbital pass prediction, space weather |

---

## 4. Frontend-Backend Data Flow & REST API Specification

### 4.1 Endpoints Specification Table

| HTTP Method | Endpoint URI | Description | Auth / Access | Success Code | Error Codes |
|---|---|---|---|---|---|
| `GET` | `/` | Serves main landing page via EJS/Static | Public | `200 OK` | `500` |
| `GET` | `/telemetry` | Dynamic Server-Side Rendered (EJS) telemetry dashboard | Public | `200 OK` | `500` |
| `GET` | `/api/feedback` | Retrieves all customer feedback records | Public / Admin | `200 OK` | `500` |
| `POST` | `/api/feedback` | Validates & saves user feedback to MongoDB/JSON | Public | `201 Created` | `400, 500` |
| `GET` | `/api/merchandise` | Retrieves all VIP waitlist reservations | Public / Admin | `200 OK` | `500` |
| `POST` | `/api/merchandise` | Validates pre-order, issues VIP code, stores in DB | Public | `201 Created` | `400, 409, 500` |
| `GET` | `/api/satellites/telemetry/iss` | Real-time ISS velocity, altitude, Lat/Long with cache | Public | `200 OK` | `502, 504` |
| `GET` | `/api/satellites/catalog` | Curated orbital spacecraft catalog | Public | `200 OK` | `500` |
| `GET` | `/api/satellites/watchlist` | Retrieves user's tracked satellite watchlist | Public | `200 OK` | `500` |
| `POST` | `/api/satellites/watchlist` | Adds satellite to persistent database watchlist | Public | `201 Created` | `400, 409` |
| `DELETE` | `/api/satellites/watchlist/:id` | Removes satellite from persistent watchlist | Public | `200 OK` | `404` |
| `POST` | `/api/quiz` | Submits cosmic quiz score to database leaderboard | Public | `201 Created` | `400` |
| `GET` | `/api/quiz/leaderboard` | Retrieves top explorer quiz leaderboard | Public | `200 OK` | `500` |
| `GET` | `/api/space-weather` | Returns real-time Solar Flare & Geomagnetic Kp index | Public | `200 OK` | `502` |

---

## 5. Database Architecture & Mongoose ODM Mapping

### 5.1 Models Implemented
1. **`Feedback`**: Customer feedback submissions with topic categorization, rating (1–5), feedback comments, and automated timestamping.
2. **`Merchandise`**: VIP pre-order reservations with product selection, apparel size, order quantity (1–10), auto-generated `VIP-ORBIT-XXXX` voucher codes, and 20% discount locking.
3. **`SatelliteWatchlist`**: User-selected satellites tracked by NORAD ID, category, orbit type, and user custom observation notes.
4. **`QuizScore`**: Space explorer quiz scores with player name, score percentage, and difficulty rating.

---

## 6. Template Engine Implementation & Static Asset Hierarchy

### 6.1 EJS Configuration & Partials Architecture
The server leverages EJS to render modular, dynamic views while avoiding repetitive boilerplate HTML:
```
views/
├── partials/
│   ├── header.ejs       # Common <head>, metadata, Orbitron/Space Grotesk imports
│   ├── navbar.ejs       # Sticky navigation bar with active-route dynamic highlighting
│   └── footer.ejs       # Space agency credits, copyright, quick links
├── telemetry.ejs        # Live Server-Side Rendered Space Telemetry & Database Dashboard
└── dashboard.ejs        # Unified evaluation & system status overview
```

In `server.js`:
```javascript
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(__dirname));
```

---

## 7. Innovative Features & Usability Highlights

1. **Live Orbital Telemetry & Real-Time ISS Tracker:** Real-time orbital speed (~27,600 km/h), altitude (~420 km), orbital period, and live sub-satellite coordinates.
2. **Satellite Pass & Visibility Calculator:** Predicts upcoming high-elevation visibility passes for ground observers.
3. **Interactive Cosmic Knowledge Quiz & Leaderboard:** Space science trivia quiz with instant score computation and database-backed leaderboard.
4. **Dynamic VIP Digital Boarding Pass Generation:** Synthesizes an interactive boarding pass (`VIP-ORBIT-XXXX`) within the DOM with locked-in 20% early-bird discount vouchers.
5. **Precision 19-Day Launch Countdown Timer:** Drift-compensated JavaScript interval engine tracking continuous seconds.
6. **Graceful Dual-Storage Engine:** Resilient Mongoose ODM architecture that falls back to structured JSON file persistence if MongoDB is temporarily offline.

---

## 8. Alignment to Academic Evaluation Rubric

| Rubric Component | Weightage | Implementation Details & Evidence |
|---|---|---|
| **Frontend-Backend Data Flow** | **15%** | Asynchronous Fetch pipeline, bi-directional JSON serialization, HTTP status management (200, 201, 400, 404, 500), CORS headers, and real-time UI state sync. |
| **Node.js / Express Setup** | **10%** | Modular Express server architecture, robust middleware stack (`express.json`, `morgan`, `cors`), environment configuration, and centralized error handling. |
| **Template Engines & Static Files** | **5%** | EJS template engine setup, modular partials (`navbar`, `header`, `footer`), server-side variable interpolation, and static asset streaming. |
| **MongoDB Operations via Mongoose**| **5%** | Strict Mongoose Schemas, data validation, unique indexes, CRUD operations (`create`, `find`, `delete`), and atomic write verification with JSON dual-storage fallback. |
| **Innovation & Usability** | **5%** | 19-Day live launch countdown, Digital VIP Boarding Pass generator, ISS telemetry tracker, and interactive planetary physics calculators. |
| **Total Academic Weightage** | **40%** | Comprehensive full-stack delivery demonstrating end-to-end technical mastery. |
