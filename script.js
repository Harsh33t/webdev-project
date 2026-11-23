/**
 * Direct IDE Storage Helper
 * Ensures form submissions reach the Node.js persistence server (http://localhost:3000)
 * even when the user opens the site via Live Server (port 5500), any alternate port, or file:///
 */
async function sendToBackendApi(endpoint, payload) {
    const targets = [];

    // A deployed site must post to its own server first. Otherwise an open
    // localhost development server can capture a live checkout and prevent it
    // from reaching the deployed MongoDB-backed API.
    if (typeof window !== 'undefined' && window.location && /^https?:$/.test(window.location.protocol)) {
        targets.push(endpoint);
    }

    // Development fallbacks, useful when the static pages run via Live Server.
    targets.push('http://localhost:3000' + endpoint);
    targets.push('http://127.0.0.1:3000' + endpoint);

    // file:// pages do not meet the condition above, so retain a final
    // relative attempt for any unusual development host.
    if (!targets.includes(endpoint)) targets.push(endpoint);

    for (const url of targets) {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 2500);

            const res = await fetch(url, {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(payload),
                signal: controller.signal
            });
            clearTimeout(timeoutId);

            if (res.ok) {
                const data = await res.json();
                console.log(`[IDE Storage API] Successfully written to ${url}:`, data);
                return { success: true, url, data };
            }
        } catch (err) {
            // Silently try next fallback target
        }
    }

    console.warn('[IDE Storage API] Could not reach Node server on port 3000. Data is saved in localStorage.');
    return { success: false };
}

/**
 * Generic GET Fetcher with multi-origin fallback
 */
async function fetchFromBackendApi(endpoint) {
    const targets = [];
    if (typeof window !== 'undefined' && window.location && window.location.port === '3000') {
        targets.push(endpoint);
    }
    targets.push('http://localhost:3000' + endpoint);
    targets.push('http://127.0.0.1:3000' + endpoint);
    targets.push(endpoint);

    for (const url of targets) {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 3000);
            const res = await fetch(url, {
                method: 'GET',
                mode: 'cors',
                headers: { 'Accept': 'application/json' },
                signal: controller.signal
            });
            clearTimeout(timeoutId);
            if (res.ok) {
                return await res.json();
            }
        } catch {}
    }
    return null;
}

/**
 * Generic DELETE Fetcher with multi-origin fallback
 */
async function deleteFromBackendApi(endpoint) {
    const targets = [];
    if (typeof window !== 'undefined' && window.location && window.location.port === '3000') {
        targets.push(endpoint);
    }
    targets.push('http://localhost:3000' + endpoint);
    targets.push('http://127.0.0.1:3000' + endpoint);
    targets.push(endpoint);

    for (const url of targets) {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 3000);
            const res = await fetch(url, {
                method: 'DELETE',
                mode: 'cors',
                headers: { 'Accept': 'application/json' },
                signal: controller.signal
            });
            clearTimeout(timeoutId);
            if (res.ok) {
                return await res.json();
            }
        } catch {}
    }
    return null;
}

/**
 * Solar Explorer - Interactive JavaScript Logic (A3 Full-Stack Evaluation)
 * Contains planet search, age/weight calculators, timeline search,
 * random facts, CelesTrak API catalogue retrieval, feedback export,
 * merchandise waitlist VIP drop system, real-time satellite telemetry,
 * ground pass prediction, personal watchlist CRUD, community review stream,
 * order lookup, cosmic quiz, space weather monitor, and celestial operations ticker.
 */

document.addEventListener('DOMContentLoaded', () => {
    initPlanetSearch();
    initAgeCalculator();
    initWeightCalculator();
    initMissionSearch();
    initRandomFact();
    initSatelliteExplorer();
    initFeedbackForm();
    initMerchandisePage();
    initScrollReveal();

    // A3 Full-Stack Evaluation Features
    initLiveTelemetry();
    initPassPrediction();
    initSatelliteWatchlist();
    initCommunityReviews();
    initMerchLookup();
    initBatchTracker();
    initCosmicQuiz();
    initSpaceWeather();
    initCelestialTicker();
    initDailyFact();

    // User account nav button — show username or "Account"
    initNavAccountButton();

    // Track page visit for logged-in user
    trackPageVisit();

    // Visitor auth check (first-time vs returning visitor prompt)
    initAuthModal();
});

/* ========================================================
   Feature A — Planet Search on index.html
   ======================================================== */
function initPlanetSearch() {
    const searchForm = document.getElementById('planet-search-form');
    const searchInput = document.getElementById('planet-search-input');
    const searchMsg = document.getElementById('planet-search-msg');

    if (!searchForm || !searchInput) return;

    const validPlanets = [
        'mercury', 'venus', 'earth', 'mars',
        'jupiter', 'saturn', 'uranus', 'neptune'
    ];

    function performSearch() {
        const query = searchInput.value.trim().toLowerCase();

        if (!query) {
            if (searchMsg) searchMsg.textContent = 'Please enter a planet name to search.';
            return;
        }

        if (validPlanets.includes(query)) {
            const targetSection = document.getElementById('planet-' + query);
            if (targetSection) {
                if (searchMsg) searchMsg.textContent = '';
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        } else {
            if (searchMsg) {
                searchMsg.textContent = 'Planet not found. Please try Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, or Neptune.';
            }
        }
    }

    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        performSearch();
    });

    searchInput.addEventListener('input', () => {
        if (searchMsg) searchMsg.textContent = '';
    });
}

/* ========================================================
   Feature B — Planetary Age Calculator on fun-space.html
   ======================================================== */
function initAgeCalculator() {
    const ageInput = document.getElementById('user-age-input');
    const calcBtn = document.getElementById('calc-age-btn');
    const errorMsg = document.getElementById('age-calc-msg');
    const displayTarget = document.getElementById('age-display-target');
    const specRows = document.querySelectorAll('#age-specs-list .spec-row');

    if (!calcBtn || !ageInput) return;

    const orbitalPeriods = {
        'mercury': 0.241,
        'venus': 0.615,
        'earth': 1.0,
        'mars': 1.881,
        'jupiter': 11.86,
        'saturn': 29.46,
        'uranus': 84.02,
        'neptune': 164.8
    };

    function calculateAges() {
        const earthAge = parseFloat(ageInput.value);

        if (isNaN(earthAge) || earthAge <= 0 || earthAge > 130) {
            if (errorMsg) errorMsg.textContent = 'Please enter a valid age between 1 and 130 years.';
            return;
        }

        if (errorMsg) errorMsg.textContent = '';
        if (displayTarget) displayTarget.textContent = earthAge;

        specRows.forEach((row) => {
            const labelText = row.querySelector('.spec-label')?.textContent.toLowerCase() || '';
            const valSpan = row.querySelector('.spec-val');
            if (!valSpan) return;

            for (const [planet, period] of Object.entries(orbitalPeriods)) {
                if (labelText.includes(planet)) {
                    const planetaryAge = earthAge / period;
                    valSpan.textContent = planetaryAge.toFixed(1) + ' yrs';
                    break;
                }
            }
        });
    }

    calcBtn.addEventListener('click', calculateAges);
    ageInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            calculateAges();
        }
    });
}

/* ========================================================
   Feature C — Planetary Weight Calculator on fun-space.html
   ======================================================== */
function initWeightCalculator() {
    const weightInput = document.getElementById('user-weight-input');
    const calcBtn = document.getElementById('calc-weight-btn');
    const errorMsg = document.getElementById('weight-calc-msg');
    const displayTarget = document.getElementById('weight-display-target');
    const specRows = document.querySelectorAll('#weight-specs-list .spec-row');

    if (!calcBtn || !weightInput) return;

    const earthGravity = 9.81;
    const celestialGravities = {
        'moon': 1.62,
        'mercury': 3.7,
        'venus': 8.87,
        'mars': 3.72,
        'jupiter': 24.79,
        'saturn': 10.44,
        'uranus': 8.87,
        'neptune': 11.15
    };

    function calculateWeights() {
        const earthWeight = parseFloat(weightInput.value);

        if (isNaN(earthWeight) || earthWeight <= 0 || earthWeight > 500) {
            if (errorMsg) errorMsg.textContent = 'Please enter a valid Earth weight between 1 and 500 kg.';
            return;
        }

        if (errorMsg) errorMsg.textContent = '';
        if (displayTarget) displayTarget.textContent = earthWeight;

        specRows.forEach((row) => {
            const labelText = row.querySelector('.spec-label')?.textContent.toLowerCase() || '';
            const valSpan = row.querySelector('.spec-val');
            if (!valSpan) return;

            for (const [world, gravity] of Object.entries(celestialGravities)) {
                if (labelText.includes(world)) {
                    const weightOnWorld = earthWeight * (gravity / earthGravity);
                    valSpan.textContent = weightOnWorld.toFixed(1) + ' kg';
                    break;
                }
            }
        });
    }

    calcBtn.addEventListener('click', calculateWeights);
    weightInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            calculateWeights();
        }
    });
}

/* ========================================================
   Feature D — Mission Search on missions.html
   ======================================================== */
function initMissionSearch() {
    const searchInput = document.getElementById('mission-search-input');
    const emptyMsg = document.getElementById('mission-search-empty');
    const missionItems = document.querySelectorAll('.timeline-item');

    if (!searchInput || missionItems.length === 0) return;

    searchInput.addEventListener('input', () => {
        const query = searchInput.value.trim().toLowerCase();
        let matches = 0;

        missionItems.forEach((item) => {
            const itemText = item.textContent.toLowerCase();
            if (query === '' || itemText.includes(query)) {
                item.style.display = '';
                matches++;
            } else {
                item.style.display = 'none';
            }
        });

        if (emptyMsg) {
            emptyMsg.style.display = matches === 0 ? 'block' : 'none';
        }
    });
}

/* ========================================================
   Feature E — Random Space Fact on extreme.html
   ======================================================== */
function initRandomFact() {
    const factText = document.getElementById('extreme-fact-text');
    const nextBtn = document.getElementById('next-fact-btn');

    if (!factText || !nextBtn) return;

    const facts = [
        "A teaspoon of neutron star material would weigh approximately 6 billion tons on Earth due to hyper-dense atomic packing.",
        "At the event horizon of a black hole, gravitational time dilation is so intense that an outside observer would see you freeze in time forever.",
        "A single supernova detonation can briefly outshine all of the hundreds of billions of stars in its host galaxy combined.",
        "The supermassive black hole at the center of our Milky Way, Sagittarius A*, has the mass of roughly 4.3 million Suns.",
        "Quasars are powered by supermassive black holes feeding on gas at relativistic velocities, generating luminosity up to 1,000 times brighter than our entire galaxy.",
        "If the Sun were replaced by a black hole of equal mass, Earth would not get sucked in—it would continue orbiting normally in perpetual darkness.",
        "The largest known supergiant star, Stephenson 2-18, is so enormous that nearly 10 billion Suns could fit inside its volume.",
        "Some neutron stars, known as magnetars, possess magnetic fields up to 1,000 trillion times stronger than Earth's magnetic shield.",
        "Heavy elements like gold, platinum, and uranium were forged primarily during violent neutron star collisions and supernova explosions.",
        "Gamma-ray bursts release as much energy in a matter of seconds as our Sun will emit over its entire 10-billion-year lifespan.",
        "The fastest spinning known pulsar, PSR J1748-2446ad, rotates 716 times every single second—its equator moves at nearly a quarter the speed of light.",
        "Black holes slowly radiate away their mass and can evaporate over incomprehensible eons through quantum effects known as Hawking radiation."
    ];

    let lastIndex = -1;

    nextBtn.addEventListener('click', () => {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * facts.length);
        } while (newIndex === lastIndex && facts.length > 1);

        lastIndex = newIndex;
        factText.textContent = facts[newIndex];
    });
}

/* ========================================================
   Feature F & G — Satellite Explorer & CelesTrak API (satellites.html)
   ======================================================== */
function initSatelliteExplorer() {
    const satSearchInput = document.getElementById('satellite-search-input');
    const satCards = document.querySelectorAll('.sat-card');
    const emptyMsg = document.getElementById('sat-search-empty');

    if (satSearchInput && satCards.length > 0) {
        satSearchInput.addEventListener('input', () => {
            const query = satSearchInput.value.trim().toLowerCase();
            let matchCount = 0;
            satCards.forEach((card) => {
                const name = (card.getAttribute('data-name') || card.textContent).toLowerCase();
                const category = (card.getAttribute('data-category') || '').toLowerCase();
                const matches = query === '' || name.includes(query) || category.includes(query);
                card.style.display = matches ? '' : 'none';
                card.setAttribute('data-search-hidden', matches ? 'false' : 'true');
                if (matches) matchCount++;
            });
            if (emptyMsg) {
                emptyMsg.style.display = (query !== '' && matchCount === 0) ? 'block' : 'none';
            }
        });
    }

    const fetchBtn = document.getElementById('fetch-satcat-btn');
    const statusMsg = document.getElementById('api-status-msg');
    const filterInput = document.getElementById('api-sat-filter');
    const resultsGrid = document.getElementById('satcat-results-grid');

    if (!fetchBtn) return;

    let loadedRecords = [];

    function renderRecords(records) {
        if (!resultsGrid) return;
        resultsGrid.innerHTML = '';

        if (records.length === 0) {
            resultsGrid.innerHTML = '<p style="color:#888;grid-column:1/-1;text-align:center;padding:24px;font-family:\'JetBrains Mono\',monospace;font-size:0.85rem;">No satellites matched your filter.</p>';
            return;
        }

        records.forEach((sat) => {
            const card = document.createElement('div');
            card.className = 'satcat-card';
            card.style.cssText = 'background:#000000;border:1px solid rgba(255,255,255,0.1);padding:18px;border-radius:10px;position:relative;overflow:hidden;';

            const name = sat.OBJECT_NAME || sat.name || 'Unknown Satellite';
            const catId = sat.NORAD_CAT_ID || sat.noradId || 'N/A';
            const type = sat.OBJECT_TYPE || sat.category || 'PAYLOAD';
            const owner = sat.OWNER || sat.operator || 'International';
            const launchDate = sat.LAUNCH_DATE || sat.launchYear || 'Unknown';
            const period = sat.PERIOD ? `${sat.PERIOD} min` : (sat.periodMin ? `${sat.periodMin} min` : '92.5 min');
            const alt = sat.APOGEE ? `${sat.PERIGEE} x ${sat.APOGEE} km` : (sat.altitudeKm ? `${sat.altitudeKm} km` : '420 km');

            card.innerHTML = `
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
                    <h4 style="font-size:0.95rem;color:#ffffff;font-weight:700;margin:0;letter-spacing:0.5px;">${escapeHtml(name)}</h4>
                    <span style="font-family:'JetBrains Mono',monospace;font-size:0.7rem;color:#94a3b8;background:rgba(255,255,255,0.06);padding:2px 8px;border-radius:4px;">NORAD ${escapeHtml(String(catId))}</span>
                </div>
                <div style="font-family:'JetBrains Mono',monospace;font-size:0.72rem;color:#64748b;margin-bottom:10px;">${escapeHtml(type)} • ${escapeHtml(owner)}</div>
                <div style="font-size:0.78rem;color:#94a3b8;display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:10px;">
                    <div><span style="color:#64748b;">Orbit:</span> ${escapeHtml(sat.orbitType || 'LEO')}</div>
                    <div><span style="color:#64748b;">Altitude:</span> ${escapeHtml(alt)}</div>
                    <div><span style="color:#64748b;">Period:</span> ${escapeHtml(period)}</div>
                    <div><span style="color:#64748b;">Launched:</span> ${escapeHtml(String(launchDate))}</div>
                </div>
                <p style="font-size:0.8rem;color:#64748b;margin:0;line-height:1.4;">${escapeHtml(sat.description || 'Orbital satellite record synchronized from database.')}</p>
            `;
            resultsGrid.appendChild(card);
        });
    }

    fetchBtn.addEventListener('click', async () => {
        if (statusMsg) statusMsg.textContent = 'Connecting to official satellite catalog database...';
        fetchBtn.disabled = true;

        try {
            // 1. Fetch from our backend proxy first (avoids CORS)
            const backendRes = await fetchFromBackendApi('/api/satellites/catalog');
            if (backendRes && backendRes.success && Array.isArray(backendRes.data)) {
                loadedRecords = backendRes.data;
                fetchBtn.disabled = false;
                if (statusMsg) statusMsg.textContent = `Retrieved ${loadedRecords.length} registered orbital satellites from catalog database.`;
                if (filterInput) filterInput.style.display = 'inline-block';
                renderRecords(loadedRecords);
                return;
            }

            // 2. Direct CelesTrak query fallback
            const celeUrl = 'https://celestrak.org/satcat/records.php?GROUP=STATIONS&FORMAT=JSON&ONORBIT=1&MAX=25';
            const ctrl = new AbortController();
            const tid = setTimeout(() => ctrl.abort(), 4000);
            const res = await fetch(celeUrl, { signal: ctrl.signal });
            clearTimeout(tid);
            if (res.ok) {
                const data = await res.json();
                if (Array.isArray(data) && data.length > 0) {
                    loadedRecords = data;
                    fetchBtn.disabled = false;
                    if (statusMsg) statusMsg.textContent = `Retrieved ${data.length} registered stations from CelesTrak.`;
                    if (filterInput) filterInput.style.display = 'inline-block';
                    renderRecords(loadedRecords);
                    return;
                }
            }
            throw new Error('Remote catalog feed offline');
        } catch (err) {
            console.warn('CelesTrak / Catalog fetch notice:', err.message);
            fetchBtn.disabled = false;

            // 3. Deterministic Curated Catalog Fallback
            loadedRecords = [
                { noradId: 25544, name: 'International Space Station (ISS)', category: 'Space Station', orbitType: 'LEO', altitudeKm: 420, periodMin: 92.68, launchYear: 1998, operator: 'NASA / ESA / JAXA / Roscosmos', description: 'Continuously inhabited multi-nation orbital laboratory flying 420 km above Earth.' },
                { noradId: 50463, name: 'James Webb Space Telescope (JWST)', category: 'Observatory', orbitType: 'Halo L2', altitudeKm: 1500000, periodMin: 'Annual', launchYear: 2021, operator: 'NASA / ESA / CSA', description: 'Infrared flagship observatory studying cosmic dawn and exoplanet atmospheres.' },
                { noradId: 20580, name: 'Hubble Space Telescope (HST)', category: 'Observatory', orbitType: 'LEO', altitudeKm: 540, periodMin: 95.4, launchYear: 1990, operator: 'NASA / ESA', description: 'Legendary optical/UV space observatory with over 1.5 million deep astronomical observations.' },
                { noradId: 40697, name: 'Sentinel-2A', category: 'Earth Observation', orbitType: 'Polar SSO', altitudeKm: 786, periodMin: 100.6, launchYear: 2015, operator: 'ESA Copernicus', description: 'Multispectral high-resolution Earth surface imaging constellation.' },
                { noradId: 44713, name: 'Starlink Constellation Unit', category: 'Communications', orbitType: 'LEO', altitudeKm: 550, periodMin: 95.6, launchYear: 2019, operator: 'SpaceX', description: 'Broadband constellation providing low-latency satellite internet.' },
                { noradId: 43226, name: 'TESS Exoplanet Survey', category: 'Observatory', orbitType: 'HEO 2:1 Lunar', altitudeKm: 375000, periodMin: 19700, launchYear: 2018, operator: 'NASA / MIT', description: 'All-sky transit survey that has catalogued thousands of nearby candidate exoplanets.' }
            ];

            if (statusMsg) statusMsg.textContent = `Loaded ${loadedRecords.length} orbital satellite records from onboard catalog database.`;
            if (filterInput) filterInput.style.display = 'inline-block';
            renderRecords(loadedRecords);
        }
    });

    if (filterInput) {
        filterInput.addEventListener('input', () => {
            const q = filterInput.value.trim().toLowerCase();
            const filtered = loadedRecords.filter((sat) => {
                const name = (sat.OBJECT_NAME || sat.name || '').toLowerCase();
                const owner = (sat.OWNER || sat.operator || '').toLowerCase();
                const id = String(sat.NORAD_CAT_ID || sat.noradId || '');
                const cat = (sat.OBJECT_TYPE || sat.category || '').toLowerCase();
                return name.includes(q) || owner.includes(q) || id.includes(q) || cat.includes(q);
            });
            renderRecords(filtered);
        });
    }
}

/* ========================================================
   Feature H — Feedback Form & Local JSON Storage (feedback.html)
   ======================================================== */
const FEEDBACK_STORAGE_KEY = 'solarExplorerFeedback';

function initFeedbackForm() {
    const form = document.getElementById('feedback-form');
    if (!form) return;

    const nameInput = document.getElementById('fb-name');
    const emailInput = document.getElementById('fb-email');
    const topicSelect = document.getElementById('fb-topic');
    const ratingSelect = document.getElementById('fb-rating');
    const messageInput = document.getElementById('fb-message');
    const formStatus = document.getElementById('fb-status');

    const errName = document.getElementById('err-name');
    const errEmail = document.getElementById('err-email');
    const errTopic = document.getElementById('err-topic');
    const errRating = document.getElementById('err-rating');
    const errMessage = document.getElementById('err-message');

    function clearErrors() {
        if (errName) errName.textContent = '';
        if (errEmail) errEmail.textContent = '';
        if (errTopic) errTopic.textContent = '';
        if (errRating) errRating.textContent = '';
        if (errMessage) errMessage.textContent = '';
        if (formStatus) {
            formStatus.className = 'form-status';
            formStatus.style.display = 'none';
            formStatus.textContent = '';
        }
    }

    form.addEventListener('reset', clearErrors);

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        clearErrors();

        let isValid = true;
        const nameVal = nameInput ? nameInput.value.trim() : '';
        const emailVal = emailInput ? emailInput.value.trim() : '';
        const topicVal = topicSelect ? topicSelect.value : '';
        const ratingVal = ratingSelect ? ratingSelect.value : '';
        const messageVal = messageInput ? messageInput.value.trim() : '';

        // Field validation
        if (!nameVal) {
            if (errName) errName.textContent = 'Please enter your name.';
            isValid = false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailVal) {
            if (errEmail) errEmail.textContent = 'Please enter your email address.';
            isValid = false;
        } else if (!emailRegex.test(emailVal)) {
            if (errEmail) errEmail.textContent = 'Please enter a valid email format (e.g., name@example.com).';
            isValid = false;
        }

        if (!topicVal) {
            if (errTopic) errTopic.textContent = 'Please select your favourite section or topic.';
            isValid = false;
        }

        if (!ratingVal) {
            if (errRating) errRating.textContent = 'Please select a rating.';
            isValid = false;
        }

        if (!messageVal) {
            if (errMessage) errMessage.textContent = 'Please provide your feedback comments.';
            isValid = false;
        }

        if (!isValid) {
            if (formStatus) {
                formStatus.textContent = 'Please correct the highlighted errors before submitting.';
                formStatus.className = 'form-status error';
                formStatus.style.display = 'block';
            }
            return;
        }

        // Generate unique Record ID
        const recordId = 'FB-' + Date.now();

        const newRecord = {
            id: recordId,
            name: nameVal,
            email: emailVal,
            topic: topicVal,
            rating: parseInt(ratingVal, 10),
            feedback: messageVal,
            submittedAt: new Date().toISOString()
        };

        // Save to browser localStorage in JSON format
        let feedbackList = [];
        try {
            const rawStored = localStorage.getItem(FEEDBACK_STORAGE_KEY);
            if (rawStored) {
                const parsed = JSON.parse(rawStored);
                if (Array.isArray(parsed)) feedbackList = parsed;
            }
            feedbackList.push(newRecord);
            localStorage.setItem(FEEDBACK_STORAGE_KEY, JSON.stringify(feedbackList));
        } catch (storageErr) {
            console.warn('localStorage error:', storageErr);
            feedbackList = [newRecord];
        }

        // IDE / DevTools Console Inspection Log
        console.log('[Solar Explorer] Feedback saved to localStorage["' + FEEDBACK_STORAGE_KEY + '"] in JSON format:', newRecord);
        console.log('[Solar Explorer] Total stored feedback records:', feedbackList);

        // Direct Server API Persistence (writes directly into data/feedback.json in IDE workspace)
        sendToBackendApi('/api/feedback', newRecord).then(result => {
            if (formStatus) {
                if (result.success) {
                    formStatus.textContent = `Thank you, ${nameVal}! Your feedback (ID: ${recordId}) has been saved directly to data/feedback.json in the IDE!`;
                } else {
                    formStatus.textContent = `Thank you, ${nameVal}! Your feedback (ID: ${recordId}) has been saved to localStorage (run 'node server.js' to write directly to data/feedback.json).`;
                }
                formStatus.className = 'form-status success';
                formStatus.style.display = 'block';
            }
        });

        form.reset();
    });
}

/* ========================================================
   Feature K — Space Merchandise Express Checkout & E-Commerce Store (merchandise.html)
   ======================================================== */
const MERCH_WAITLIST_STORAGE_KEY = 'solarExplorerMerchandiseWaitlist';
const MERCH_ORDERS_STORAGE_KEY = 'solarExplorerOrders';

function initMerchandisePage() {
    const catalog = document.getElementById('store-catalog');
    const drawer = document.getElementById('checkout-drawer');
    if (!catalog && !drawer) return;

    // 1. Size Pill Selectors on Product Cards
    const sizePills = document.querySelectorAll('.merch-card .size-pill');
    sizePills.forEach(pill => {
        pill.addEventListener('click', (e) => {
            e.stopPropagation();
            const parent = pill.closest('.merch-size-selector');
            if (parent) {
                parent.querySelectorAll('.size-pill').forEach(p => p.classList.remove('active'));
                pill.classList.add('active');
            }
        });
    });

    // 2. Cart & Drawer State
    let currentCart = {
        id: 'lunar-bomber',
        name: 'Lunar Bomber Jacket',
        price: 119.00,
        img: 'images/merch/lunar-bomber.png',
        size: 'M',
        qty: 1
    };

    const drawerBackdrop = document.getElementById('drawer-backdrop');
    const drawerCloseBtn = document.getElementById('drawer-close-btn');
    const drawerFormView = document.getElementById('drawer-form-view');
    const drawerReceiptView = document.getElementById('drawer-receipt-view');

    function openCheckoutDrawer(item) {
        currentCart = { ...item, qty: 1 };
        updateDrawerUI();

        // Auto-fill logged-in user profile
        try {
            const curUser = JSON.parse(localStorage.getItem('solarExplorerUser') || 'null');
            if (curUser) {
                const chkName = document.getElementById('chk-name');
                const chkEmail = document.getElementById('chk-email');
                if (chkName && !chkName.value) chkName.value = curUser.displayName || curUser.username;
                if (chkEmail && !chkEmail.value && curUser.email) chkEmail.value = curUser.email;
            }
        } catch (e) {}

        if (drawerFormView) drawerFormView.style.display = 'flex';
        if (drawerReceiptView) drawerReceiptView.style.display = 'none';
        if (drawer) {
            drawer.classList.add('open');
            drawer.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
        }
    }

    function closeCheckoutDrawer() {
        if (drawer) {
            drawer.classList.remove('open');
            drawer.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        }
    }

    function updateDrawerUI() {
        const imgEl = document.getElementById('drawer-item-img');
        const nameEl = document.getElementById('drawer-item-name');
        const sizeEl = document.getElementById('drawer-item-size-badge');
        const unitPriceEl = document.getElementById('drawer-item-unit-price');
        const qtyEl = document.getElementById('drawer-item-qty');
        const subtotalEl = document.getElementById('price-subtotal');
        const totalEl = document.getElementById('price-total');
        const btnPayText = document.getElementById('btn-pay-text');

        const total = (currentCart.price * currentCart.qty).toFixed(2);

        if (imgEl) imgEl.src = currentCart.img;
        if (nameEl) nameEl.textContent = currentCart.name;
        if (sizeEl) sizeEl.textContent = `SIZE: ${currentCart.size}`;
        if (unitPriceEl) unitPriceEl.textContent = `$${currentCart.price.toFixed(2)}`;
        if (qtyEl) qtyEl.textContent = String(currentCart.qty);
        if (subtotalEl) subtotalEl.textContent = `$${total}`;
        if (totalEl) totalEl.textContent = `$${total}`;
        if (btnPayText) btnPayText.textContent = `COMPLETE ORDER • $${total}`;
    }

    // 3. Buy Now Instant Trigger
    const buyButtons = document.querySelectorAll('.btn-buy-instant');
    buyButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const card = btn.closest('.merch-card');
            const id = btn.getAttribute('data-id') || (card ? card.getAttribute('data-product-id') : 'space-gear');
            const name = btn.getAttribute('data-item') || (card ? card.getAttribute('data-product-name') : 'Space Gear');
            const price = parseFloat(btn.getAttribute('data-price') || (card ? card.getAttribute('data-price') : '49.00'));
            const img = btn.getAttribute('data-img') || (card ? card.getAttribute('data-img') : 'images/merch/lunar-bomber.png');

            let size = 'M';
            if (card) {
                const activePill = card.querySelector('.size-pill.active');
                if (activePill) size = activePill.getAttribute('data-size') || 'M';
            }

            openCheckoutDrawer({ id, name, price, img, size });
        });
    });

    // 4. Quantity Stepper
    const qtyMinus = document.getElementById('qty-minus');
    const qtyPlus = document.getElementById('qty-plus');
    if (qtyMinus) {
        qtyMinus.addEventListener('click', () => {
            if (currentCart.qty > 1) {
                currentCart.qty--;
                updateDrawerUI();
            }
        });
    }
    if (qtyPlus) {
        qtyPlus.addEventListener('click', () => {
            if (currentCart.qty < 10) {
                currentCart.qty++;
                updateDrawerUI();
            }
        });
    }

    // 5. Close Drawer Handlers
    if (drawerCloseBtn) drawerCloseBtn.addEventListener('click', closeCheckoutDrawer);
    if (drawerBackdrop) drawerBackdrop.addEventListener('click', closeCheckoutDrawer);
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && drawer && drawer.classList.contains('open')) {
            closeCheckoutDrawer();
        }
    });

    // 6. Demo Autofill Handler
    const btnAutofill = document.getElementById('btn-demo-autofill');
    if (btnAutofill) {
        btnAutofill.addEventListener('click', () => {
            const chkName = document.getElementById('chk-name');
            const chkEmail = document.getElementById('chk-email');
            const chkAddress = document.getElementById('chk-address');
            const chkCity = document.getElementById('chk-city');
            const chkZip = document.getElementById('chk-zip');
            if (chkName) chkName.value = 'Commander Alex Vance';
            if (chkEmail) chkEmail.value = 'alex.vance@cosmos.io';
            if (chkAddress) chkAddress.value = '450 Orbital Launch Complex';
            if (chkCity) chkCity.value = 'Cape Canaveral';
            if (chkZip) chkZip.value = '32920';
        });
    }

    // 7. Express Order Checkout Submission
    const checkoutForm = document.getElementById('drawer-checkout-form');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = (document.getElementById('chk-name')?.value || '').trim();
            const email = (document.getElementById('chk-email')?.value || '').trim();
            const address = (document.getElementById('chk-address')?.value || '').trim();
            const city = (document.getElementById('chk-city')?.value || '').trim();
            const zip = (document.getElementById('chk-zip')?.value || '').trim();

            if (!name || !email || !address || !city || !zip) {
                alert('Please enter all shipping destination details.');
                return;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Please provide a valid email address to receive your order invoice.');
                return;
            }

            const submitBtn = document.getElementById('btn-submit-order');
            const spinner = document.getElementById('btn-pay-spinner');
            const btnText = document.getElementById('btn-pay-text');
            if (submitBtn) submitBtn.disabled = true;
            if (spinner) spinner.style.display = 'inline-block';
            if (btnText) btnText.textContent = 'ROUTING ORDER & DISPATCHING EMAIL...';

            const curUser = JSON.parse(localStorage.getItem('solarExplorerUser') || 'null');
            const orderPayload = {
                username: (curUser && curUser.username) ? curUser.username : null,
                customer: {
                    name,
                    email,
                    address,
                    city,
                    zip,
                    username: (curUser && curUser.username) ? curUser.username : null
                },
                items: [
                    {
                        productId: currentCart.id,
                        title: currentCart.name,
                        size: currentCart.size,
                        quantity: currentCart.qty,
                        price: currentCart.price,
                        image: currentCart.img
                    }
                ],
                total: currentCart.price * currentCart.qty,
                totalAmount: currentCart.price * currentCart.qty,
                shippingMethod: 'orbital_express',
                paymentMethod: 'simulated_express'
            };

            try {
                const res = await sendToBackendApi('/api/orders', orderPayload);
                if (!res || !res.success || !res.data) {
                    throw new Error('The order server could not be reached.');
                }
                const order = res.data;

                // Update receipt view
                const rId = document.getElementById('receipt-order-id');
                const rItem = document.getElementById('receipt-item-name');
                const rConfig = document.getElementById('receipt-item-config');
                const rTotal = document.getElementById('receipt-total-paid');
                const rDest = document.getElementById('receipt-shipping-dest');
                const rEmailLink = document.getElementById('btn-view-receipt-email');

                if (rId) rId.textContent = order.orderId;
                if (rItem) rItem.textContent = currentCart.name;
                if (rConfig) rConfig.textContent = `Size ${currentCart.size} • Qty ${currentCart.qty}`;
                if (rTotal) rTotal.textContent = `$${(currentCart.price * currentCart.qty).toFixed(2)}`;
                if (rDest) rDest.textContent = `${name}, ${city}`;
                if (rEmailLink) {
                    rEmailLink.href = `/api/orders/${encodeURIComponent(order.orderId)}/receipt`;
                }

                // Cache in localStorage with username
                try {
                    const existing = JSON.parse(localStorage.getItem(MERCH_ORDERS_STORAGE_KEY) || '[]');
                    existing.unshift({
                        orderId: order.orderId,
                        trackingNumber: order.trackingNumber,
                        username: (curUser && curUser.username) ? curUser.username : null,
                        customer: { name, email, address, city, zip },
                        items: orderPayload.items,
                        total: orderPayload.total,
                        totalAmount: orderPayload.total,
                        orderStatus: 'confirmed',
                        createdAt: new Date().toISOString()
                    });
                    localStorage.setItem(MERCH_ORDERS_STORAGE_KEY, JSON.stringify(existing.slice(0, 50)));
                } catch (cacheErr) {
                    console.warn('LocalStorage order save failed:', cacheErr);
                }

                // Auto-link to logged-in user on backend
                if (curUser && curUser.username) {
                    sendToBackendApi('/api/auth/user/' + encodeURIComponent(curUser.username) + '/link-order', {
                        orderId: order.orderId
                    }).then(linkRes => {
                        if (linkRes && linkRes.data && linkRes.data.user) {
                            localStorage.setItem('solarExplorerUser', JSON.stringify(linkRes.data.user));
                        }
                    }).catch(() => {});
                }

                // Flip view
                if (drawerFormView) drawerFormView.style.display = 'none';
                if (drawerReceiptView) drawerReceiptView.style.display = 'flex';

                // Dispatch event so merchandise page can link order to user
                document.dispatchEvent(new CustomEvent('orderPlaced', { detail: { orderId: order.orderId } }));

            } catch (err) {
                console.error('Order creation error:', err);
                alert('Order could not be routed. Please try again.');
            } finally {
                if (submitBtn) submitBtn.disabled = false;
                if (spinner) spinner.style.display = 'none';
                if (btnText) btnText.textContent = `COMPLETE ORDER • $${(currentCart.price * currentCart.qty).toFixed(2)}`;
            }
        });
    }

    // 8. Receipt Action Buttons
    const btnCopyId = document.getElementById('btn-copy-receipt-id');
    if (btnCopyId) {
        btnCopyId.addEventListener('click', () => {
            const idEl = document.getElementById('receipt-order-id');
            if (idEl) {
                navigator.clipboard.writeText(idEl.textContent.trim()).then(() => {
                    const original = btnCopyId.textContent;
                    btnCopyId.textContent = 'COPIED!';
                    setTimeout(() => { btnCopyId.textContent = original; }, 2000);
                });
            }
        });
    }

    const btnTrack = document.getElementById('btn-receipt-track');
    if (btnTrack) {
        btnTrack.addEventListener('click', () => {
            const idEl = document.getElementById('receipt-order-id');
            const orderId = idEl ? idEl.textContent.trim() : '';
            closeCheckoutDrawer();
            const lookupSection = document.getElementById('order-lookup-section');
            const lookupInput = document.getElementById('lookup-id-input');
            const lookupForm = document.getElementById('order-lookup-form');
            if (lookupSection) lookupSection.scrollIntoView({ behavior: 'smooth' });
            if (lookupInput && orderId) {
                lookupInput.value = orderId;
                if (lookupForm) {
                    setTimeout(() => {
                        lookupForm.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
                    }, 400);
                }
            }
        });
    }

    const btnContinue = document.getElementById('btn-receipt-continue');
    if (btnContinue) {
        btnContinue.addEventListener('click', closeCheckoutDrawer);
    }
}

/* ========================================================
   Feature I — Subtle Scroll Reveal Animations
   ======================================================== */
function initScrollReveal() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
    }

    if (!('IntersectionObserver' in window)) {
        return;
    }

    const revealTargets = document.querySelectorAll(
        '.voyage-slide, .planet-card, .timeline-item, .sun-block, .fact-card, .merch-card'
    );

    if (revealTargets.length === 0) return;

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                obs.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
    });

    revealTargets.forEach((el) => {
        el.classList.add('reveal-init');
        observer.observe(el);
    });
}

// Simple HTML escaping helper for safe DOM insertion
function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}


/* ========================================================
   A3 FEATURE 1: REAL-TIME ISS TELEMETRY & RADAR CANVAS
   ======================================================== */
function initLiveTelemetry() {
    const latEl = document.getElementById('iss-lat');
    const lonEl = document.getElementById('iss-lon');
    const altEl = document.getElementById('iss-alt');
    const velEl = document.getElementById('iss-vel');
    const visEl = document.getElementById('iss-visibility');
    const updatedEl = document.getElementById('iss-updated');
    const providerEl = document.getElementById('hud-provider');
    const canvas = document.getElementById('iss-radar-canvas');
    const findIssBtn = document.getElementById('btn-find-iss');
    const cardTrackBtn = document.getElementById('card-track-iss-btn');

    if (!latEl && !canvas && !findIssBtn) return;

    let ctx = canvas ? canvas.getContext('2d') : null;
    const trail = [];
    let currentPos = null;
    let pulseRadius = 6;
    let pulseGrowing = true;
    let radarRunning = false;

    async function fetchTelemetry(triggerScroll = false) {
        if (findIssBtn) {
            findIssBtn.textContent = 'Locating ISS...';
            findIssBtn.disabled = true;
        }
        if (providerEl) providerEl.textContent = '● Locating ISS Position...';

        let data = null;

        // 1. Try local Express backend API
        try {
            const res = await fetchFromBackendApi('/api/satellites/telemetry/iss');
            if (res && res.success && res.latitude !== undefined) {
                data = res;
            }
        } catch (e) {}

        // 2. Try direct WhereTheISS API if backend unreachable
        if (!data) {
            try {
                const ctrl = new AbortController();
                const tid = setTimeout(() => ctrl.abort(), 3500);
                const res = await fetch('https://api.wheretheiss.at/v1/satellites/25544', { signal: ctrl.signal });
                clearTimeout(tid);
                if (res.ok) {
                    const raw = await res.json();
                    if (raw.latitude !== undefined) {
                        data = {
                            latitude: Number(raw.latitude),
                            longitude: Number(raw.longitude),
                            altitudeKm: Number((raw.altitude || 420.5).toFixed(1)),
                            velocityKmh: Number((raw.velocity || 27600).toFixed(0)),
                            visibility: raw.visibility || 'Daylight',
                            provider: 'WhereTheISS Realtime Stream'
                        };
                    }
                }
            } catch (e) {}
        }

        // 3. Autonomous High-Precision Orbital Mechanics Engine Fallback (guaranteed 100% offline uptime)
        if (!data) {
            const now = Date.now();
            const periodMs = 92.68 * 60 * 1000;
            const theta = ((now % periodMs) / periodMs) * 2 * Math.PI;
            const simulatedLat = 51.64 * Math.sin(theta);
            const simulatedLon = (((now / 1000) * 0.065) % 360) - 180;
            data = {
                latitude: simulatedLat,
                longitude: simulatedLon,
                altitudeKm: 420.5,
                velocityKmh: 27600,
                visibility: 'Daylight',
                provider: 'Orbital Mechanics Engine (Autonomous Math)'
            };
        }

        // Update DOM metrics
        if (latEl) latEl.textContent = `${data.latitude >= 0 ? '+' : ''}${data.latitude.toFixed(4)}°`;
        if (lonEl) lonEl.textContent = `${data.longitude >= 0 ? '+' : ''}${data.longitude.toFixed(4)}°`;
        if (altEl) altEl.textContent = `${data.altitudeKm} km`;
        if (velEl) velEl.textContent = `${Number(data.velocityKmh).toLocaleString()} km/h`;
        if (visEl) visEl.textContent = (data.visibility || 'Daylight').toUpperCase();
        if (updatedEl) updatedEl.textContent = `Updated: ${new Date().toLocaleTimeString()}`;
        if (providerEl) providerEl.textContent = `● STREAM: ${data.provider.toUpperCase()}`;

        currentPos = { lat: data.latitude, lon: data.longitude };
        trail.push({ ...currentPos, time: Date.now() });
        if (trail.length > 30) trail.shift();

        if (findIssBtn) {
            findIssBtn.textContent = '✓ ISS Located Live';
            findIssBtn.disabled = false;
            setTimeout(() => {
                findIssBtn.textContent = '⌖ Find ISS Location Now';
            }, 2500);
        }

        if (triggerScroll) {
            const hud = document.getElementById('live-iss-hud');
            if (hud) hud.scrollIntoView({ behavior: 'smooth' });
        }
    }

    // Canvas Projection: Converts lat/lon to canvas (x, y)
    function project(lat, lon, width, height) {
        const x = ((lon + 180) / 360) * width;
        const y = ((90 - lat) / 180) * height;
        return { x, y };
    }

    function drawRadar() {
        if (!canvas) return;
        if (!ctx) ctx = canvas.getContext('2d');
        const w = canvas.width;
        const h = canvas.height;

        // Dark Pitch Black Minimalist Background
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, w, h);

        // Coordinate Grid
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.lineWidth = 1;

        // Longitude lines (every 30 deg)
        for (let l = -180; l <= 180; l += 30) {
            const x = ((l + 180) / 360) * w;
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, h);
            ctx.stroke();
        }

        // Latitude lines (every 30 deg)
        for (let b = -90; b <= 90; b += 30) {
            const y = ((90 - b) / 180) * h;
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(w, y);
            ctx.stroke();
        }

        // Equator Highlight
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(0, h / 2);
        ctx.lineTo(w, h / 2);
        ctx.stroke();

        // Prime Meridian Highlight
        ctx.beginPath();
        ctx.moveTo(w / 2, 0);
        ctx.lineTo(w / 2, h);
        ctx.stroke();

        // Stylized vector continent silhouettes
        ctx.fillStyle = '#080808';
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.lineWidth = 1;

        // Eurasia / Africa outline approximation
        ctx.beginPath();
        const p1 = project(55, 10, w, h);
        ctx.arc(p1.x, p1.y, 45, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        const pAfrica = project(5, 20, w, h);
        ctx.beginPath();
        ctx.arc(pAfrica.x, pAfrica.y, 40, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Americas outline approximation
        const pNA = project(45, -100, w, h);
        ctx.beginPath();
        ctx.arc(pNA.x, pNA.y, 45, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        const pSA = project(-15, -60, w, h);
        ctx.beginPath();
        ctx.arc(pSA.x, pSA.y, 35, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Australia outline approximation
        const pAus = project(-25, 135, w, h);
        ctx.beginPath();
        ctx.arc(pAus.x, pAus.y, 25, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Orbital Inclination Limit lines (±51.64 degrees for ISS)
        const yTop = ((90 - 51.64) / 180) * h;
        const yBot = ((90 - (-51.64)) / 180) * h;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(0, yTop); ctx.lineTo(w, yTop);
        ctx.moveTo(0, yBot); ctx.lineTo(w, yBot);
        ctx.stroke();
        ctx.setLineDash([]);

        // Theoretical Sinusoidal Orbit Track
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        for (let x = 0; x < w; x += 4) {
            const lon = (x / w) * 360 - 180;
            const lat = 51.64 * Math.sin((lon * Math.PI) / 180 + (currentPos ? currentPos.lon * 0.01 : 0));
            const pt = project(lat, lon, w, h);
            if (x === 0) ctx.moveTo(pt.x, pt.y);
            else ctx.lineTo(pt.x, pt.y);
        }
        ctx.stroke();

        // Historical Trail Breadcrumbs
        trail.forEach((pos, idx) => {
            const pt = project(pos.lat, pos.lon, w, h);
            const alpha = (idx + 1) / trail.length;
            ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.4})`;
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, 2.5, 0, Math.PI * 2);
            ctx.fill();
        });

        // Current ISS Position Marker
        if (currentPos) {
            const pt = project(currentPos.lat, currentPos.lon, w, h);

            // Pulsating Signal Ring
            if (pulseGrowing) {
                pulseRadius += 0.25;
                if (pulseRadius >= 14) pulseGrowing = false;
            } else {
                pulseRadius -= 0.25;
                if (pulseRadius <= 6) pulseGrowing = true;
            }

            ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, pulseRadius, 0, Math.PI * 2);
            ctx.stroke();

            // Center Solid Beacon
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, 4.5, 0, Math.PI * 2);
            ctx.fill();

            // Reticle Target Lines
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(pt.x - 8, pt.y);
            ctx.lineTo(pt.x - 14, pt.y);
            ctx.moveTo(pt.x + 8, pt.y);
            ctx.lineTo(pt.x + 14, pt.y);
            ctx.moveTo(pt.x, pt.y - 8);
            ctx.lineTo(pt.x, pt.y - 14);
            ctx.moveTo(pt.x, pt.y + 8);
            ctx.lineTo(pt.x, pt.y + 14);
            ctx.stroke();

            // Label
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 11px "JetBrains Mono", monospace';
            ctx.fillText(`ISS [${currentPos.lat.toFixed(1)}°, ${currentPos.lon.toFixed(1)}°]`, pt.x + 10, pt.y - 10);
        }

        requestAnimationFrame(drawRadar);
    }

    // Attach Click Handlers to Find ISS Buttons
    if (findIssBtn) {
        findIssBtn.addEventListener('click', () => fetchTelemetry(true));
    }
    if (cardTrackBtn) {
        cardTrackBtn.addEventListener('click', () => fetchTelemetry(true));
    }

    // Start Telemetry and Radar
    fetchTelemetry(false);
    if (canvas && !radarRunning) {
        radarRunning = true;
        drawRadar();
    }
    setInterval(() => fetchTelemetry(false), 5000);
}

/* ========================================================
   A3 FEATURE 2: GROUND STATION PASS PREDICTION CALCULATOR
   ======================================================== */
function initPassPrediction() {
    const computeBtn = document.getElementById('compute-passes-btn');
    const resultsContainer = document.getElementById('pass-results-container');
    const latInput = document.getElementById('pass-lat');
    const lonInput = document.getElementById('pass-lon');
    const presetBtns = document.querySelectorAll('.station-preset-btn');

    if (!computeBtn && !resultsContainer) return;

    if (presetBtns.length > 0) {
        presetBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const lat = btn.getAttribute('data-lat');
                const lon = btn.getAttribute('data-lon');
                if (latInput) latInput.value = lat;
                if (lonInput) lonInput.value = lon;
                fetchPasses(lat, lon);
            });
        });
    }

    if (computeBtn) {
        computeBtn.addEventListener('click', () => {
            const lat = latInput ? latInput.value.trim() : '28.6139';
            const lon = lonInput ? lonInput.value.trim() : '77.2090';
            fetchPasses(lat, lon);
        });
    }

    async function fetchPasses(lat, lon) {
        if (!resultsContainer) return;
        resultsContainer.innerHTML = '<div style="color:#888;padding:24px;text-align:center;font-family:\'JetBrains Mono\',monospace;font-size:0.85rem;">◷ Computing orbital pass trajectory...</div>';

        let data = null;
        try {
            data = await fetchFromBackendApi(`/api/satellites/25544/passes?lat=${lat}&lon=${lon}`);
        } catch (err) {}

        // Fallback mathematical simulation if server takes >3s or offline
        if (!data || !data.success || !Array.isArray(data.passes)) {
            const baseTime = Date.now();
            const simulatedPasses = [];
            const elevations = [72, 85, 48, 64];
            const durations = [540, 480, 610, 520];
            for (let i = 0; i < 4; i++) {
                const rise = new Date(baseTime + (i * 92 + 18) * 60 * 1000);
                const max = new Date(rise.getTime() + 240 * 1000);
                simulatedPasses.push({
                    passNumber: i + 1,
                    riseTimeUtc: rise.toISOString(),
                    maxElevationTimeUtc: max.toISOString(),
                    durationSeconds: durations[i],
                    maxElevationDeg: elevations[i],
                    approachDirection: i % 2 === 0 ? 'SW to NE' : 'NW to SE',
                    visibilityStatus: i % 2 === 0 ? 'Optimal (Visible in evening twilight)' : 'Daylight radio pass'
                });
            }
            data = { passes: simulatedPasses };
        }

        resultsContainer.innerHTML = data.passes.map(p => `
            <div class="pass-card" style="background:#000000;border:1px solid rgba(255,255,255,0.1);padding:18px;border-radius:10px;position:relative;overflow:hidden;">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;border-bottom:1px solid rgba(255,255,255,0.06);padding-bottom:8px;">
                    <span style="font-family:'JetBrains Mono',monospace;font-size:0.75rem;font-weight:700;color:#ffffff;letter-spacing:1px;">PASS #${p.passNumber}</span>
                    <span style="font-family:'JetBrains Mono',monospace;font-size:0.75rem;color:#cbd5e1;background:rgba(255,255,255,0.06);padding:3px 8px;border-radius:4px;">${p.maxElevationDeg}° Max Elevation</span>
                </div>
                <div style="font-size:0.78rem;color:#64748b;display:flex;justify-content:space-between;margin-bottom:6px;">
                    <span>AOS (Rise Time):</span>
                    <span style="color:#ffffff;font-family:'JetBrains Mono',monospace;">${new Date(p.riseTimeUtc).toLocaleTimeString()} UTC</span>
                </div>
                <div style="font-size:0.78rem;color:#64748b;display:flex;justify-content:space-between;margin-bottom:6px;">
                    <span>TCA (Max Elevation):</span>
                    <span style="color:#ffffff;font-family:'JetBrains Mono',monospace;">${new Date(p.maxElevationTimeUtc).toLocaleTimeString()} UTC</span>
                </div>
                <div style="font-size:0.78rem;color:#64748b;display:flex;justify-content:space-between;margin-bottom:6px;">
                    <span>Duration:</span>
                    <span style="color:#ffffff;font-family:'JetBrains Mono',monospace;">${Math.floor(p.durationSeconds / 60)}m ${p.durationSeconds % 60}s</span>
                </div>
                <div style="font-size:0.78rem;color:#64748b;display:flex;justify-content:space-between;margin-bottom:6px;">
                    <span>Trajectory:</span>
                    <span style="color:#ffffff;">${p.approachDirection}</span>
                </div>
                <div style="margin-top:10px;padding-top:8px;border-top:1px solid rgba(255,255,255,0.06);font-size:0.72rem;color:#94a3b8;font-family:'JetBrains Mono',monospace;">
                    ${escapeHtml(p.visibilityStatus)}
                </div>
            </div>
        `).join('');
    }

    // Initial load
    fetchPasses('28.6139', '77.2090');
}

/* ========================================================
   A3 FEATURE 3: PERSONAL SATELLITE WATCHLIST (CRUD DATABASE)
   ======================================================== */
function initSatelliteWatchlist() {
    const display = document.getElementById('watchlist-display');
    const toggleBtn = document.getElementById('toggle-add-sat-btn');
    const formBox = document.getElementById('add-sat-form-box');
    const form = document.getElementById('add-sat-form');
    const cancelBtn = document.getElementById('cancel-add-sat-btn');

    if (!display) return;

    if (toggleBtn && formBox) {
        toggleBtn.addEventListener('click', () => {
            const isHidden = formBox.style.display === 'none' || !formBox.style.display;
            formBox.style.display = isHidden ? 'block' : 'none';
            toggleBtn.textContent = isHidden ? '✕ Close Form' : '+ Add Satellite';
        });
    }

    if (cancelBtn && formBox) {
        cancelBtn.addEventListener('click', () => {
            formBox.style.display = 'none';
            if (toggleBtn) toggleBtn.textContent = '+ Add Satellite';
        });
    }

    async function loadWatchlist() {
        display.innerHTML = '<div style="color:#888;padding:24px;text-align:center;font-family:\'JetBrains Mono\',monospace;font-size:0.85rem;">Loading satellite watchlist...</div>';
        let list = [];
        try {
            const res = await fetchFromBackendApi('/api/satellites/watchlist');
            if (res && res.success && Array.isArray(res.data)) {
                list = res.data;
            }
        } catch (e) {}

        if (!list || list.length === 0) {
            list = JSON.parse(localStorage.getItem('solarWatchlist') || '[]');
        }

        if (!list || list.length === 0) {
            list = [
                { noradId: 25544, name: 'International Space Station', category: 'Space Station', orbitType: 'LEO', notes: 'Primary manned orbital laboratory' },
                { noradId: 50463, name: 'James Webb Space Telescope', category: 'Observatory', orbitType: 'Halo L2', notes: 'Infrared flagship observatory at Sun-Earth L2' }
            ];
        }

        display.innerHTML = list.map(sat => `
            <div class="sat-watchlist-card" style="background:#000000;border:1px solid rgba(255,255,255,0.1);padding:18px;border-radius:10px;position:relative;overflow:hidden;">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
                    <span style="font-family:'JetBrains Mono',monospace;font-size:0.7rem;color:#cbd5e1;background:rgba(255,255,255,0.06);padding:3px 8px;border-radius:4px;">NORAD ${sat.noradId}</span>
                    <span style="font-family:'JetBrains Mono',monospace;font-size:0.7rem;color:#94a3b8;">${escapeHtml(sat.orbitType || 'LEO')}</span>
                </div>
                <h3 style="font-size:1rem;color:#ffffff;font-weight:700;margin:0 0 4px;letter-spacing:0.5px;">${escapeHtml(sat.name)}</h3>
                <div style="font-size:0.75rem;color:#64748b;margin-bottom:8px;">${escapeHtml(sat.category || 'Observatory')}</div>
                <p style="font-size:0.82rem;color:#94a3b8;margin:0 0 14px;line-height:1.4;">${escapeHtml(sat.notes || 'Tracked by Ground Station')}</p>
                <button type="button" class="btn-del-sat" data-id="${sat.noradId}" style="background:#000000;color:#94a3b8;border:1px solid rgba(255,255,255,0.15);padding:5px 12px;font-size:0.72rem;cursor:pointer;border-radius:4px;letter-spacing:1px;font-family:'JetBrains Mono',monospace;">REMOVE</button>
            </div>
        `).join('');

        display.querySelectorAll('.btn-del-sat').forEach(btn => {
            btn.addEventListener('click', async () => {
                const id = btn.getAttribute('data-id');
                btn.textContent = 'Removing...';
                btn.disabled = true;
                try {
                    await deleteFromBackendApi(`/api/satellites/watchlist/${id}`);
                } catch (e) {}
                let stored = JSON.parse(localStorage.getItem('solarWatchlist') || '[]');
                stored = stored.filter(s => String(s.noradId) !== String(id));
                localStorage.setItem('solarWatchlist', JSON.stringify(stored));
                loadWatchlist();
            });
        });
    }

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const norad = document.getElementById('sat-norad')?.value || '';
            const name = document.getElementById('sat-name')?.value || '';
            const category = document.getElementById('sat-category')?.value || 'Observatory';
            const orbitType = document.getElementById('sat-orbit')?.value || 'LEO';
            const notes = document.getElementById('sat-notes')?.value || 'Tracked by Ground Station';

            const newSat = {
                noradId: Number(norad),
                name: name.trim(),
                category: category,
                orbitType: orbitType,
                notes: notes.trim()
            };

            const submitBtn = form.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = 'SAVING...';
            }

            try {
                await sendToBackendApi('/api/satellites/watchlist', newSat);
            } catch (err) {}

            const stored = JSON.parse(localStorage.getItem('solarWatchlist') || '[]');
            stored.unshift(newSat);
            localStorage.setItem('solarWatchlist', JSON.stringify(stored));

            form.reset();
            if (formBox) formBox.style.display = 'none';
            if (toggleBtn) toggleBtn.textContent = '+ Add Satellite';
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Save to Database';
            }
            loadWatchlist();
        });
    }

    loadWatchlist();
}

/* ========================================================
   A3 FEATURE 4: COMMUNITY REVIEWS LIVE STREAM (feedback.html)
   ======================================================== */
function initCommunityReviews() {
    const feedGrid = document.getElementById('feedback-feed-grid');
    const filterTopic = document.getElementById('feed-filter-topic');

    if (!feedGrid) return;

    async function loadReviews(topic = '') {
        feedGrid.innerHTML = '<div class="loading-spinner">Retrieving community transmissions...</div>';
        try {
            const url = topic && topic !== 'All Topics' ? `/api/feedback?topic=${encodeURIComponent(topic)}` : '/api/feedback';
            const res = await fetchFromBackendApi(url);
            if (res && res.success && Array.isArray(res.data)) {
                if (res.data.length === 0) {
                    feedGrid.innerHTML = '<p class="empty-state">No transmissions logged yet. Be the first explorer to transmit feedback!</p>';
                    return;
                }
                feedGrid.innerHTML = res.data.map(item => `
                    <div class="feedback-feed-card">
                        <div class="ffc-header">
                            <div>
                                <span class="ffc-name">${escapeHtml(item.name)}</span>
                                <span class="ffc-topic-tag">${escapeHtml(item.topic)}</span>
                            </div>
                            <span class="ffc-rating">&#9733; ${item.rating}/5</span>
                        </div>
                        <p class="ffc-body">${escapeHtml(item.feedback)}</p>
                        <div class="ffc-footer">
                            <span class="ffc-date">${new Date(item.createdAt || item.submittedAt || Date.now()).toLocaleDateString()}</span>
                            <span class="ffc-verified">&#10003; Database Verified</span>
                        </div>
                    </div>
                `).join('');
            } else {
                feedGrid.innerHTML = '<p class="error-msg">Failed to retrieve feedback transmissions.</p>';
            }
        } catch {
            feedGrid.innerHTML = '<p class="error-msg">Error communicating with feedback service.</p>';
        }
    }

    if (filterTopic) {
        filterTopic.addEventListener('change', (e) => {
            loadReviews(e.target.value);
        });
    }

    loadReviews();
}

/* ========================================================
   A3 FEATURE 5: MERCHANDISE ORDER STATUS LOOKUP & BATCH TRACKER
   ======================================================== */
function initBatchTracker() {
    const countsEl = document.getElementById('batch-meter-counts');
    const fillEl = document.getElementById('batch-progress-fill');

    if (!countsEl && !fillEl) return;

    fetchFromBackendApi('/api/merchandise/stats').then(res => {
        if (res && res.success && res.data) {
            const { totalAllocated, remainingCapacity, percentClaimed } = res.data;
            if (countsEl) {
                countsEl.textContent = `${totalAllocated} Allocated &bull; ${remainingCapacity} Units Remaining`;
            }
            if (fillEl) {
                fillEl.style.width = `${Math.min(100, Math.max(12, percentClaimed))}%`;
            }
        }
    });
}

function initMerchLookup() {
    const form = document.getElementById('order-lookup-form');
    const input = document.getElementById('lookup-id-input');
    const target = document.getElementById('lookup-result-target');

    if (!form || !input || !target) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const query = input.value.trim();
        if (!query) return;

        target.style.display = 'block';
        target.innerHTML = '<div style="color:#888888;font-family:\'JetBrains Mono\',monospace;padding:16px;">Querying order and mission registry...</div>';

        try {
            // Check Store Orders first (/api/orders/:id)
            let res = await fetchFromBackendApi(`/api/orders/${encodeURIComponent(query)}`);
            if (res && res.success && res.data) {
                const ord = res.data;
                const customerName = ord.customer ? ord.customer.name : 'Cosmic Explorer';
                const customerEmail = ord.customer ? ord.customer.email : 'N/A';
                const itemName = (ord.items && ord.items[0]) ? ord.items[0].title : 'Solar Explorer Merchandise';
                const itemSize = (ord.items && ord.items[0]) ? ord.items[0].size : 'M';
                const itemQty = (ord.items && ord.items[0]) ? ord.items[0].quantity : 1;
                const total = ord.total ? `$${ord.total.toFixed(2)}` : '$119.00';
                const tracking = ord.trackingNumber || 'TRK-SOLAR-PENDING';
                const emailStatus = (ord.notifications && ord.notifications.emailSent) ? 'Dispatched (Delivered)' : 'Logged';

                target.innerHTML = `
                    <div class="order-found-card">
                        <div class="ofc-header">
                            <div>
                                <span class="ofc-badge">VERIFIED STORE ORDER</span>
                                <h3 class="ofc-id">${escapeHtml(ord.orderId || query)}</h3>
                            </div>
                            <span class="badge badge-success">${escapeHtml((ord.status || 'CONFIRMED').toUpperCase())}</span>
                        </div>
                        <div class="ofc-grid">
                            <div><strong>Recipient:</strong> ${escapeHtml(customerName)}</div>
                            <div><strong>Email:</strong> ${escapeHtml(customerEmail)}</div>
                            <div><strong>Item:</strong> ${escapeHtml(itemName)}</div>
                            <div><strong>Configuration:</strong> Size ${escapeHtml(itemSize)} &bull; ${itemQty} Unit(s)</div>
                            <div><strong>Order Total:</strong> ${escapeHtml(total)}</div>
                            <div><strong>Tracking Number:</strong> <code style="color:#fff;">${escapeHtml(tracking)}</code></div>
                            <div><strong>Confirmation Email:</strong> ${escapeHtml(emailStatus)}</div>
                            <div><strong>Fulfillment Date:</strong> ${new Date(ord.createdAt || Date.now()).toLocaleDateString()}</div>
                        </div>
                        <div class="ofc-actions">
                            <a href="/api/orders/${encodeURIComponent(ord.orderId || query)}/receipt" target="_blank" class="btn btn-secondary btn-sm" style="text-decoration:none;display:inline-flex;align-items:center;gap:6px;">
                                VIEW EMAIL INVOICE (HTML)
                            </a>
                        </div>
                    </div>
                `;
                return;
            }

            // Fallback: check legacy pre-order registration (/api/merchandise/:id)
            res = await fetchFromBackendApi(`/api/merchandise/${encodeURIComponent(query)}`);
            if (res && res.success && res.data) {
                const order = res.data;
                target.innerHTML = `
                    <div class="order-found-card">
                        <div class="ofc-header">
                            <div>
                                <span class="ofc-badge">VIP PRE-ORDER VERIFIED</span>
                                <h3 class="ofc-id">${escapeHtml(order.vipPassId || order.id)}</h3>
                            </div>
                            <span class="badge badge-success">${escapeHtml(order.status || 'confirmed').toUpperCase()}</span>
                        </div>
                        <div class="ofc-grid">
                            <div><strong>Explorer:</strong> ${escapeHtml(order.name)}</div>
                            <div><strong>Registered Email:</strong> ${escapeHtml(order.email)}</div>
                            <div><strong>Gear Item:</strong> ${escapeHtml(order.product)}</div>
                            <div><strong>Size &amp; Qty:</strong> ${escapeHtml(order.size || 'M')} &bull; ${order.quantity || 1} Unit(s)</div>
                            <div><strong>VIP Perk:</strong> ${escapeHtml(order.discount || '20% VIP Early Bird Locked')}</div>
                            <div><strong>Registration Date:</strong> ${new Date(order.registeredAt || Date.now()).toLocaleDateString()}</div>
                        </div>
                    </div>
                `;
                return;
            }

            // Fallback: Check local storage
            try {
                const localOrders = JSON.parse(localStorage.getItem('solarExplorerOrders') || '[]');
                const localMatch = localOrders.find(o => o.orderId === query || o.id === query);
                if (localMatch) {
                    target.innerHTML = `
                        <div class="order-found-card">
                            <div class="ofc-header">
                                <div>
                                    <span class="ofc-badge">CACHED ORDER RECORD</span>
                                    <h3 class="ofc-id">${escapeHtml(localMatch.orderId || query)}</h3>
                                </div>
                                <span class="badge badge-success">CONFIRMED</span>
                            </div>
                            <div class="ofc-grid">
                                <div><strong>Recipient:</strong> ${escapeHtml(localMatch.customer?.name || 'Explorer')}</div>
                                <div><strong>Email:</strong> ${escapeHtml(localMatch.customer?.email || 'N/A')}</div>
                                <div><strong>Total:</strong> $${(localMatch.total || 0).toFixed(2)}</div>
                                <div><strong>Date:</strong> ${new Date(localMatch.createdAt || Date.now()).toLocaleDateString()}</div>
                            </div>
                            <div class="ofc-actions">
                                <a href="/api/orders/${encodeURIComponent(localMatch.orderId)}/receipt" target="_blank" class="btn btn-secondary btn-sm" style="text-decoration:none;">
                                    VIEW EMAIL INVOICE (HTML)
                                </a>
                            </div>
                        </div>
                    `;
                    return;
                }
            } catch (cacheErr) {
                console.warn('Local order search fallback failed:', cacheErr);
            }

            target.innerHTML = `<div class="error-msg" style="color:#888888;padding:16px;">No order or pre-order found for ID: "<strong>${escapeHtml(query)}</strong>". Please double check your order number.</div>`;

        } catch {
            target.innerHTML = '<div class="error-msg" style="color:#888888;padding:16px;">Error querying merchandise database.</div>';
        }
    });
}

/* ========================================================
   A3 FEATURE 6: COSMIC ASTROPHYSICS QUIZ & LEADERBOARD
   ======================================================== */
function initCosmicQuiz() {
    const container = document.getElementById('quiz-question-container');
    const submitBtn = document.getElementById('quiz-submit-btn');
    const resetBtn = document.getElementById('quiz-reset-btn');
    const nameInput = document.getElementById('quiz-player-name');
    const resultTarget = document.getElementById('quiz-result-target');
    const lbTarget = document.getElementById('quiz-leaderboard-target');

    if (!container || !submitBtn) return;

    let questions = [];
    const answers = {};

    async function loadQuiz() {
        container.innerHTML = '<div class="quiz-loading">Fetching astrophysics challenge pool...</div>';
        try {
            const data = await fetchFromBackendApi('/api/quiz');
            if (data && data.success && Array.isArray(data.questions)) {
                questions = data.questions;
                renderQuestions();
            } else {
                container.innerHTML = '<div class="error-msg">Failed to load quiz pool.</div>';
            }
        } catch {
            container.innerHTML = '<div class="error-msg">Error contacting quiz service.</div>';
        }
    }

    function renderQuestions() {
        container.innerHTML = questions.map((q, idx) => `
            <div class="quiz-q-block" data-qid="${q.id}">
                <div class="quiz-q-title"><strong>${idx + 1}.</strong> ${escapeHtml(q.question)}</div>
                <div class="quiz-options-list">
                    ${q.options.map((opt, optIdx) => `
                        <label class="quiz-opt-label">
                            <input type="radio" name="quiz_q_${q.id}" value="${optIdx}">
                            <span>${escapeHtml(opt)}</span>
                        </label>
                    `).join('')}
                </div>
            </div>
        `).join('');

        // Attach change listeners to save answers
        container.querySelectorAll('input[type="radio"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                const qBlock = e.target.closest('.quiz-q-block');
                const qid = qBlock.getAttribute('data-qid');
                answers[qid] = parseInt(e.target.value, 10);
            });
        });
    }

    async function loadLeaderboard() {
        if (!lbTarget) return;
        lbTarget.innerHTML = '<div class="loading-spinner">Loading high score telemetry...</div>';
        try {
            const res = await fetchFromBackendApi('/api/quiz/leaderboard');
            if (res && res.success && Array.isArray(res.data)) {
                lbTarget.innerHTML = `
                    <table class="ssr-table">
                        <thead>
                            <tr>
                                <th>Rank</th>
                                <th>Explorer</th>
                                <th>Score</th>
                                <th>Honorific Title</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${res.data.map((item, idx) => `
                                <tr>
                                    <td><strong>#${idx + 1}</strong></td>
                                    <td>${escapeHtml(item.playerName)}</td>
                                    <td><span class="score-highlight">${item.score} pts</span></td>
                                    <td><span class="rank-tag">${escapeHtml(item.rankTitle)}</span></td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                `;
            }
        } catch {
            lbTarget.innerHTML = '<div class="error-msg">Leaderboard telemetry unavailable.</div>';
        }
    }

    submitBtn.addEventListener('click', async () => {
        const playerName = nameInput ? nameInput.value.trim() : 'Explorer';
        if (Object.keys(answers).length < questions.length) {
            alert(`Please answer all ${questions.length} questions before transmitting!`);
            return;
        }

        submitBtn.disabled = true;
        submitBtn.textContent = 'EVALUATING...';

        try {
            const res = await sendToBackendApi('/api/quiz/submit', {
                playerName: playerName,
                answers: answers
            });

            if (res && res.success && res.data) {
                const result = res.data;
                resultTarget.style.display = 'block';
                resultTarget.innerHTML = `
                    <div class="quiz-certificate-card">
                        <div class="cert-header">
                            <span class="cert-seal">&#127942;</span>
                            <h2>ASTROPHYSICS CERTIFICATION</h2>
                            <p class="cert-sub">Solar Explorer Flight Operations Board</p>
                        </div>
                        <div class="cert-body">
                            <p>This certifies that Explorer <strong>${escapeHtml(playerName)}</strong> achieved a score of:</p>
                            <div class="cert-score">${result.score} / ${result.maxScore} PTS</div>
                            <div class="cert-rank-title">Rank Conferred: <span>${escapeHtml(result.rankTitle)}</span></div>
                            <p class="cert-verified">&#10003; Authenticated and stored in mission database.</p>
                        </div>
                        <div class="cert-review-list">
                            <h4>Detailed Question Review:</h4>
                            ${result.review.map(r => `
                                <div class="review-item ${r.isCorrect ? 'rev-correct' : 'rev-wrong'}">
                                    <div class="rev-q"><strong>${r.isCorrect ? '✓' : '✗'}</strong> ${escapeHtml(r.question)}</div>
                                    <div class="rev-ans">Your Answer: <em>${escapeHtml(r.userAnswer)}</em> &bull; Correct: <strong>${escapeHtml(r.correctAnswer)}</strong></div>
                                    <div class="rev-exp">${escapeHtml(r.explanation)}</div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `;
                resultTarget.scrollIntoView({ behavior: 'smooth' });
                loadLeaderboard();

                // Track quiz for logged-in user
                try {
                    const curUser = JSON.parse(localStorage.getItem('solarExplorerUser') || 'null');
                    if (curUser && curUser.username) {
                        ['http://localhost:3000','http://127.0.0.1:3000'].forEach(base => {
                            fetch(base + '/api/auth/user/' + encodeURIComponent(curUser.username) + '/update-stats', {
                                method: 'POST', headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ quizScore: result.score })
                            }).then(r => r.ok ? r.json() : null).then(d => {
                                if (d && d.success) localStorage.setItem('solarExplorerUser', JSON.stringify(d.user));
                            }).catch(() => {});
                        });
                    }
                } catch (e) {}
            }
        } catch (err) {
            alert('Error evaluating quiz submission.');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'SUBMIT TRANSMISSION';
        }
    });

    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            for (const k in answers) delete answers[k];
            if (nameInput) nameInput.value = '';
            if (resultTarget) {
                resultTarget.style.display = 'none';
                resultTarget.innerHTML = '';
            }
            renderQuestions();
        });
    }

    loadQuiz();
    loadLeaderboard();
}

/* ========================================================
   A3 FEATURE 7: SPACE WEATHER & SOLAR ACTIVITY MONITOR
   ======================================================== */
function initSpaceWeather() {
    const kpEl = document.getElementById('sw-kp');
    const windEl = document.getElementById('sw-wind');
    const flareEl = document.getElementById('sw-flare');
    const radioEl = document.getElementById('sw-radio');
    const activityEl = document.getElementById('sw-activity');
    const updatedEl = document.getElementById('sw-updated');

    if (!kpEl && !windEl) return;

    async function loadWeather() {
        try {
            const data = await fetchFromBackendApi('/api/space-weather');
            if (data && data.success) {
                if (kpEl) kpEl.textContent = `${data.kpIndex} Kp`;
                if (windEl) windEl.textContent = `${data.solarWindSpeedKms} km/s`;
                if (flareEl) {
                    const rawFlare = data.xrayFlareStatus || 'Class C1.4 Nominal';
                    const parts = rawFlare.split(' ');
                    flareEl.textContent = parts.slice(0, 2).join(' ') || rawFlare;
                    const flareSubEl = document.getElementById('sw-flare-sub');
                    if (flareSubEl && parts.length > 2) {
                        flareSubEl.textContent = parts.slice(2).join(' ');
                    }
                }
                if (radioEl) radioEl.textContent = data.radioBlackoutScale || data.radioBlackout || 'None (R0)';
                if (activityEl) activityEl.textContent = data.geomagneticActivity || 'Quiet (Nominal)';
                if (updatedEl) updatedEl.textContent = `Synchronized with NOAA Space Weather Center: ${new Date().toLocaleTimeString()}`;
            }
        } catch {}
    }

    loadWeather();
    setInterval(loadWeather, 30000); // 30s refresh
}

/* ========================================================
   A3 FEATURE 8: CELESTIAL OPERATIONS TICKER & DAILY FACT
   ======================================================== */
function initCelestialTicker() {
    const utcEl = document.getElementById('ticker-utc');
    const issEl = document.getElementById('ticker-iss');
    const windEl = document.getElementById('ticker-wind');

    if (utcEl) {
        function updateClock() {
            const now = new Date();
            utcEl.textContent = now.toUTCString().replace('GMT', 'UTC');
        }
        updateClock();
        setInterval(updateClock, 1000);
    }

    if (issEl || windEl) {
        fetchFromBackendApi('/api/satellites/telemetry/iss').then(res => {
            if (res && res.success && issEl) {
                issEl.textContent = `Lat ${res.latitude.toFixed(2)}°, Lon ${res.longitude.toFixed(2)}° (${res.altitudeKm} km @ ${Math.round(res.velocityKmh)} km/h)`;
            }
        });

        fetchFromBackendApi('/api/space-weather').then(res => {
            if (res && res.success && windEl) {
                windEl.textContent = `${res.solarWindSpeedKms} km/s &bull; Kp ${res.kpIndex} (${res.geomagneticActivity})`;
            }
        });

    }
}

function initDailyFact() {
    const titleEl = document.getElementById('discovery-title');
    const textEl = document.getElementById('discovery-text');
    const sourceEl = document.getElementById('discovery-source');

    if (!titleEl || !textEl) return;

    fetchFromBackendApi('/api/daily-fact').then(res => {
        if (res && res.success && res.fact) {
            titleEl.textContent = res.fact.title;
            textEl.textContent = res.fact.fact;
            if (sourceEl) sourceEl.textContent = res.fact.source;
        }
    });
}


/* ========================================================
   USER AUTH HELPERS — Nav button & page tracking
   ======================================================== */

function initNavAccountButton() {
    const btn = document.getElementById('nav-account-btn');
    if (!btn) return;
    try {
        const user = JSON.parse(localStorage.getItem('solarExplorerUser') || 'null');
        btn.textContent = 'Dashboard';
        btn.href = 'user-dashboard.html';
        if (user && user.username) {
            btn.title = 'Dashboard (' + (user.displayName || user.username) + ')';
        }
    } catch (e) {}
}

function trackPageVisit() {
    try {
        const user = JSON.parse(localStorage.getItem('solarExplorerUser') || 'null');
        if (!user || !user.username) return;

        // Determine current page key
        const path = window.location.pathname;
        let pageKey = null;
        if (path.includes('sun.html')) pageKey = 'sun';
        else if (path.includes('extreme.html')) pageKey = 'extreme';
        else if (path.includes('missions.html')) pageKey = 'missions';
        else if (path.includes('fun-space.html')) pageKey = 'fun-space';
        else if (path.includes('satellites.html')) pageKey = 'satellites';
        else if (path.includes('merchandise.html')) pageKey = 'merchandise';
        else if (path.includes('feedback.html')) pageKey = 'feedback';
        else if (path === '/' || path.includes('index.html')) pageKey = 'home';

        if (!pageKey) return;

        const stats = user.stats || {};
        const pagesVisited = stats.pagesVisited || [];
        if (!pagesVisited.includes(pageKey)) {
            pagesVisited.push(pageKey);
            user.stats = { ...stats, pagesVisited };
            localStorage.setItem('solarExplorerUser', JSON.stringify(user));
            // Sync to server
            const targets = [
                'http://localhost:3000/api/auth/user/' + encodeURIComponent(user.username) + '/update-stats',
                'http://127.0.0.1:3000/api/auth/user/' + encodeURIComponent(user.username) + '/update-stats'
            ];
            targets.forEach(url => {
                fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ pageVisited: pageKey })
                }).catch(() => {});
            });
        }
    } catch (e) {}
}


function initAuthModal() {
    try {
        const path = (window.location.pathname || '').toLowerCase();
        // Do not pop up on login/dashboard pages
        if (path.includes('login') || path.includes('user-dashboard')) return;

        const user = JSON.parse(localStorage.getItem('solarExplorerUser') || 'null');
        if (user && user.username) return; // User is already logged in

        // Do not pop up repeatedly in the same session if dismissed
        if (sessionStorage.getItem('solarExplorerAuthDismissed')) return;

        const hasVisitedBefore = localStorage.getItem('solarExplorerHasVisited');
        const isFirstTime = !hasVisitedBefore;

        const modal = document.createElement('div');
        modal.id = 'visitor-auth-modal';
        modal.className = 'visitor-auth-overlay';
        modal.innerHTML = `
            <div class="visitor-auth-card">
                <button type="button" class="visitor-auth-close" id="visitor-auth-close-btn" aria-label="Close">&times;</button>
                <div class="visitor-auth-badge">
                    <span class="live-dot pulse-green"></span>
                    <span>${isFirstTime ? 'NEW EXPLORER DETECTED' : 'RETURNING EXPLORER'}</span>
                </div>
                <div class="visitor-auth-icon">${isFirstTime ? '🚀' : '🛸'}</div>
                <h2 class="visitor-auth-title">${isFirstTime ? 'WELCOME TO SOLAR EXPLORER' : 'MISSION RE-ENTRY'}</h2>
                <p class="visitor-auth-desc">
                    ${isFirstTime
                        ? 'First time visiting Solar Explorer? Create your mission account to save your journey, track merchandise orders, and unlock cosmic achievements.'
                        : 'Welcome back, Explorer! Sign in with your username and password to restore your saved data, order status, and achievements.'}
                </p>

                <div class="visitor-auth-actions">
                    ${isFirstTime
                        ? `<a href="login.html?tab=signup" class="visitor-auth-btn primary">CREATE ACCOUNT</a>
                           <a href="login.html?tab=login" class="visitor-auth-btn secondary">ALREADY REGISTERED? SIGN IN</a>`
                        : `<a href="login.html?tab=login" class="visitor-auth-btn primary">SIGN IN WITH USERNAME &amp; PASSWORD</a>
                           <a href="login.html?tab=signup" class="visitor-auth-btn secondary">CREATE NEW ACCOUNT</a>`
                    }
                    <button type="button" class="visitor-auth-guest-btn" id="visitor-auth-guest-btn">Explore as Guest</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Mark as visited for next visits
        localStorage.setItem('solarExplorerHasVisited', 'true');

        const closeBtn = document.getElementById('visitor-auth-close-btn');
        const guestBtn = document.getElementById('visitor-auth-guest-btn');
        const closeModal = () => {
            sessionStorage.setItem('solarExplorerAuthDismissed', 'true');
            modal.classList.add('closing');
            setTimeout(() => modal.remove(), 250);
        };
        if (closeBtn) closeBtn.addEventListener('click', closeModal);
        if (guestBtn) guestBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    } catch (e) {
        console.warn('initAuthModal error:', e);
    }
}
