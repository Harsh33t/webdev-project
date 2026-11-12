# 🚀 SOLAR EXPLORER — END-TERM PRESENTATION & LIVE DEMO SCRIPT
**Phase Evaluation 3 (A3 — 40% Evaluation)**  
**Target Duration:** 10–12 Minutes Total (Presentation + Live Walkthrough + Viva Defense)  
**Team Roster:**  
- **Speaker 1 (Pratham):** System Architecture, Node.js/Express Backend & Mongoose ODM  
- **Speaker 2 (Harsheet):** Space Merchandise Drop, 19-Day Countdown & VIP Pass Engine  
- **Speaker 3 (Aviraj):** Asynchronous API Pipeline, CelesTrak SATCAT & Telemetry Failover  
- **Speaker 4 (Samarth):** Interactive Science Calculators, Keplerian Mechanics & Search  
- **Speaker 5 (Shivansh):** UI/UX Design System, EJS Template Partials & WCAG Accessibility

---

## Part 1: Slide-by-Slide Presentation Script

### Slide 1: Title & Project Mission (0:00 - 1:15)
- **Visuals:** Solar Explorer splash screen, team roster, tech badges (Node.js, Express, MongoDB, EJS, HTML5/CSS3).
- **Speaker:** **Pratham**
- **Script:**  
  > "Respected Professor and Evaluators, good afternoon. Welcome to the final A3 End-Term evaluation of our full-stack web engineering project: **Solar Explorer**.  
  > Over the course of the semester, our team set out to engineer more than just a typical astronomy website. We built a production-grade, full-stack educational and e-commerce portal that integrates real-time astrophysical data, interactive physics engines, and an exclusive celestial merchandise drop portal.  
  > For this A3 evaluation, carrying 40% course weightage, our focus has been the comprehensive integration of the full technology stack: from client-side ES6+ scripts to an Express.js backend, EJS server-side rendering, and persistent document storage through MongoDB and Mongoose ODM. Today, our team will walk you through our architectural design, live data flows, and technical accomplishments."

---

### Slide 2: Full-Stack Architecture & Express/Node Setup (1:15 - 2:45)
- **Visuals:** Layered Architecture Diagram, Express middleware pipeline diagram, REST API endpoint matrix.
- **Speaker:** **Pratham**
- **Script:**  
  > "I will begin with the backend backbone. Our server is powered by Node.js and Express.js, configured with a modular separation of concerns.  
  > When an incoming HTTP request hits our server, it passes through a structured middleware chain: first, `cors()` to guarantee cross-origin security; second, `express.json()` with strict payload size limits to protect against denial-of-service attempts; third, request logging for automated server diagnostics; and fourth, `express.static()` to efficiently serve our static stylesheets, custom SVG vectors, and multimedia assets.  
  > We implemented RESTful endpoints adhering to strict HTTP semantics: `POST /api/feedback`, `POST /api/merchandise`, `GET/POST /api/satellites/*`, and `/api/quiz` for record creation, paired with dedicated `GET` routes. We also configured Mongoose 8.x with strict schemas enforcing data integrity, custom regular expressions, required field validation, and unique indexing before any document touches MongoDB. Furthermore, we implemented a dual-storage engine that automatically falls back to local JSON persistence if MongoDB is temporarily unavailable, ensuring zero downtime."

---

### Slide 3: EJS Templating & Front-to-Back Data Flow (2:45 - 4:00)
- **Visuals:** EJS directory tree (`views/partials`), before-and-after server-side rendering diagram, DevTools Network tab showing JSON payload exchange.
- **Speaker:** **Shivansh**
- **Script:**  
  > "To satisfy the template engine requirements, we integrated EJS—Embedded JavaScript. Rather than duplicating navigation headers, metadata, and footers across every HTML file, we modularized our layout into reusable partials: `header.ejs`, `navbar.ejs`, and `footer.ejs`. We built a dedicated live server-side rendered Space Telemetry & Dashboard view at `/telemetry`.  
  > On the client side, our responsive design system utilizes CSS Grid and Flexbox with a curated dark cosmic palette based on Google Fonts `Orbitron` and `Space Grotesk`.  
  > Crucially, we prioritized WCAG 2.1 Level AA accessibility. Our forms incorporate dynamic `aria-live="polite"` containers so screen readers announce real-time validation feedback. Furthermore, all transitions are governed by CSS media queries respecting the user’s `prefers-reduced-motion` settings."

---

### Slide 4: Real-Time Telemetry & Asynchronous External APIs (4:00 - 5:30)
- **Visuals:** CelesTrak NORAD SATCAT cards, API fetch flowchart with NOAA failover, code snippet showing Promise chaining and AbortController.
- **Speaker:** **Aviraj**
- **Script:**  
  > "My primary responsibility was architecting our asynchronous integration pipeline on `satellites.html`.  
  > Rather than relying exclusively on static datasets, Solar Explorer connects directly to the official **CelesTrak NORAD SATCAT API** and **Wheretheiss API** to fetch live orbital station records in orbit around Earth. When the user initiates a query, our client script issues an asynchronous Fetch request governed by an `AbortController` timeout to prevent hanging UI threads.  
  > Upon receiving the raw JSON array, our JavaScript engine parses orbital apogees, perigees, orbital periods, and NORAD catalog IDs, dynamically rendering interactive cards into the DOM. We also built an interactive Pass Predictor and a personal Satellite Watchlist with live database persistence."

---

### Slide 5: Scientific Computing & Search Algorithms (5:30 - 7:00)
- **Visuals:** Planetary Age & Planetary Weight calculator screenshots, Keplerian formula overlay ($T^2 \propto a^3$), Instant search demo GIF.
- **Speaker:** **Samarth**
- **Script:**  
  > "On our `fun-space.html` and `missions.html` modules, my focus was scientific computation and real-time DOM filtering.  
  > For the **Planetary Age Calculator**, we implemented precise Keplerian orbital period ratios. When a user enters their Earth age, our algorithm calculates their exact age across all 8 planets—from Mercury’s rapid 88-day orbit to Neptune’s 164.8-year journey.  
  > For the **Planetary Weight Calculator**, we implemented celestial gravitational surface accelerations derived from Newton’s Law of Universal Gravitation ($g = G M / R^2$). A user’s weight is transformed instantaneously using calibrated surface gravities.  
  > In addition, I engineered high-performance client-side search engines on `index.html` and `missions.html` that filter planetary bodies and historic NASA/ISRO timelines without triggering page reloads."

---

### Slide 6: Space Merchandise Showcase, 19-Day Timer & VIP Boarding Pass (7:00 - 8:30)
- **Visuals:** Merchandise grid, countdown timer UI, Digital VIP Boarding Pass screenshot with coupon badge, MongoDB Compass document view.
- **Speaker:** **Harsheet**
- **Script:**  
  > "For our feature highlight on `merchandise.html`, we built the **Space Lovers Merchandise Launchpad**.  
  > First, we engineered a live, ticking **19-Day Launch Countdown Timer**. Our JavaScript code computes days, hours, minutes, and seconds dynamically using mathematical modulo operations, updating every 1000 milliseconds without UI lag.  
  > Second, we implemented an interactive merchandise preview grid featuring 6 bespoke items like the Lunar Bomber Jacket and Saturn Orbit Hoodie. Clicking 'Pre-order' on any card automatically auto-fills the product selector and smooth-scrolls to the VIP form.  
  > When the user submits the form, our system validates the fields, generates a unique Record ID (`MERCH-...`), and produces a **Digital VIP Boarding Pass** in the DOM. This pass locks in an exclusive `VIP-ORBIT-XXXX` code and a 20% discount badge. Most importantly, the entire order payload is transmitted via HTTP POST to our Express backend and permanently stored in our MongoDB collection."

---

## Part 2: Step-by-Step Live Demonstration Walkthrough (3 Minutes)

*The team transitions to the live browser window and terminal running in Antigravity IDE.*

### Step 1: Starting the Server & Health Verification (Conducted by Pratham)
1. **Action:** Open terminal in the IDE and run `node server.js`.
2. **Narration:** *"Notice that our Node/Express server initializes on port 3000, establishes an active connection to MongoDB/JSON dual storage, and displays the direct persistence endpoints."*
3. **Action:** Open `http://localhost:3000/telemetry` in Google Chrome to demonstrate Server-Side Rendering (EJS).

### Step 2: Scientific Calculators & Live Search (Conducted by Samarth)
1. **Action:** Navigate to `fun-space.html`. Type age `20` into the Age Calculator and press Enter.
2. **Narration:** *"Observe how the DOM updates instantaneously: a 20-year-old on Earth is 83.0 years old on Mercury and only 0.1 years old on Neptune."*
3. **Action:** Enter weight `70` kg into the Weight Calculator.

### Step 3: Live Satellite Query with External API (Conducted by Aviraj)
1. **Action:** Navigate to `satellites.html` and click **"LOAD SATELLITE CATALOGUE"**.
2. **Narration:** *"The client invokes the CelesTrak NORAD SATCAT endpoint. In under two seconds, 25 live space stations and orbiters appear with real NORAD IDs, launch dates, and apogee/perigee altitudes."*

### Step 4: Merchandise Pre-Order & Digital Boarding Pass (Conducted by Harsheet)
1. **Action:** Navigate to `merchandise.html`. Point out the active 19-day countdown timer ticking on screen.
2. **Action:** Click "Pre-order" on the **"Lunar Bomber Jacket"** card. Form scrolls smoothly and auto-selects the product.
3. **Action:** Fill in Name: `Professor Evaluation`, Email: `evaluator@university.edu`, Size: `Large`, Quantity: `2`, check consent, and submit.
4. **Narration:** *"Upon submission, our JavaScript dispatches an asynchronous POST request to `/api/merchandise`. The response generates this sleek Digital VIP Launch Pass right in the DOM with code `VIP-ORBIT-XXXX`."*

### Step 5: Verifying Full-Stack Data Flow & Database Persistence (Conducted by Pratham)
1. **Action:** Switch to terminal / MongoDB Compass / workspace file `data/merchandise.json`.
2. **Narration:** *"Here is the critical full-stack proof: the record is saved with unique ID `MERCH-...`, complete with schema-validated fields, timestamp, and discount voucher. Both MongoDB and the IDE filesystem confirm zero data loss."*
3. **Action:** Navigate to `feedback.html`, submit a 5-star review, and show the live DevTools Console log outputting the structured JSON object.
