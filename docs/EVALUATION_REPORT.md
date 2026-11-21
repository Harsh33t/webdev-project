# Solar Explorer — A3 End-Term Evaluation Report
**Project Name**: Solar Explorer (Cosmic Observation & Satellite Telemetry Platform)  
**Academic Evaluation**: A3 - End Term Evaluation (40%)  
**Date**: November 22, 2026  
**Team**:
- **Pratham Singh Shaurya** (Lead Full-Stack Architect & Dashboard Developer)
- **Aviraj Singh** (Satellites Engineer & Live Radar Telemetry Developer)
- **Harsheet Patel** (Backend API Gateway & E-Commerce Telemetry Architect)
- **Samarth Sharma** (Authentication, Pass Prediction & Dual-Storage Engineer)
- **Shivansh Gupta** (NOAA SWPC Heliophysics Feed & Testing Lead)

---

## 1. Executive Summary & Evaluation Alignment (Rubric 40%)

The Solar Explorer project has been comprehensively enhanced and hardened according to the A3 End-Term academic evaluation criteria:
- **Frontend-Backend Data Flow (15%)**: 16 dedicated REST APIs integrated seamlessly with real-time UI components (live ISS telemetry, Ground Station pass prediction, NOAA SWPC space weather, merchandise order fulfillment, and celestial observation logs).
- **Node.js / Express Setup (10%)**: Clean MVC architecture (`models`, `routes`, `controllers`, `services`, `middleware`), structured JSON body parsing, CORS handling, graceful shutdowns, and centralized error middleware.
- **Template Engines & Static Files (5%)**: Multi-page responsive static application served cleanly via Express static middleware with custom route aliases and server-rendered HTML invoice receipts.
- **MongoDB Operations via Mongoose/ODM (5%)**: Full CRUD capabilities (`Create`, `Read`, `Update (PATCH)`, `Delete`) backed by Mongoose models (`User`, `CelestialObservation`, `MerchandiseOrder`) with an autonomous JSON persistence fallback layer.
- **Innovation & Usability (5%)**: Sleek pitch-black monochrome minimalist aesthetic, 60fps HTML5 Canvas orbital projection radar, Keplerian orbital math engine fallback, and instant order tracking telemetry.

---

## 2. Key Modules & Technical Implementation

### A. Satellite Explorer & Live ISS Radar
- **High-Resolution Realistic Imagery**: 15 high-definition satellite entries (ISS, JWST, Hubble, GPS Block III, Sentinel-2A, Starlink, GOES-18, Landsat 9, Chandra, TESS, Cassini, GRACE-FO, Tiangong, Parker Solar Probe, Envisat).
- **Minimalist Pitch-Black Aesthetic**: Pure `#000000` card backgrounds with faint dashed Keplerian orbital rings (`rgba(255, 255, 255, 0.05)`) and concentric reticles.
- **Find ISS Location Engine**: `#btn-find-iss` and `#card-track-iss-btn` trigger immediate coordinate acquisition, update telemetry metrics (Latitude, Longitude, Altitude, Velocity, Solar State), and smoothly scroll to the live radar projection canvas.
- **60fps Orbital Radar Canvas**: Vector world projection with equator, prime meridian, orbital inclination limits (±51.64°), historical breadcrumbs, and pulsating signal beacon.
- **Fail-Safe Offline Mode**: Autonomous Keplerian orbital math engine guarantees 100% telemetry uptime even without external internet connectivity.

### B. Mission Control User Dashboard
- **Stabilized Commander Profile**: Total Points locked to `$2.00` and rank position stabilized, preventing unwanted mutations from order totals.
- **Non-Glitching Orders Section**: Reconciliation check prevents DOM wipe and eliminates progress-bar animation flashing or layout jerking.
- **Embedded Order Tracking Tool**: Dedicated search input queries `/api/orders/:id`, `/api/merch/orders/:id`, and cached local storage to display live fulfillment dispatch telemetry.
- **Celestial Observations CRUD Module**: Interactive modals for logging, inspecting, editing (PATCH), and deleting observational astronomical records.

### C. NOAA SWPC Space Weather Telemetry Feed
- **2x2 Telemetry Grid**: Matches Space Weather Prediction Center design with high contrast, dark backgrounds, and subtle orbit rings:
  1. *Planetary K-Index*: Real-time geomagnetic disturbance levels.
  2. *Solar Wind Speed*: Interplanetary plasma stream speed (km/s).
  3. *X-Ray Flare Level*: Solar flux background classification.
  4. *Radio Blackout*: High-frequency communications operational status.

---

## 3. End-to-End Test & Verification Results

All 16 backend API endpoints verified with HTTP 200 OK:
- `GET /api/telemetry` (200 OK)
- `GET /api/space-weather` (200 OK)
- `GET /api/daily-fact` (200 OK)
- `GET /api/observations` (200 OK)
- `GET /api/orders` (200 OK)
- `GET /api/merch/orders/ORD-2026-3185` (200 OK)
- `GET /api/orders/ORD-2026-3185` (200 OK)
- `GET /api/orders/ORD-2026-3185/receipt` (200 OK)
- `GET /api/satellites/catalog` (200 OK)
- `GET /api/satellites/telemetry/iss` (200 OK)
- `GET /api/satellites/25544/passes` (200 OK)
- `GET /api/satellites/watchlist` (200 OK)
- `GET /api/merchandise` (200 OK)
- `GET /api/feedback` (200 OK)
- `GET /api/quiz` (200 OK)
- `GET /api/quiz/leaderboard` (200 OK)

CRUD verification on `/api/observations`:
- `POST` (201 Created)
- `GET /:id` (200 OK)
- `PATCH /:id` (200 OK)
- `DELETE /:id` (200 OK)
