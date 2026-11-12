/**
 * Direct IDE Storage Helper
 * Ensures form submissions reach the Node.js persistence server (http://localhost:3000)
 * even when the user opens the site via Live Server (port 5500), any alternate port, or file:///
 */
async function sendToBackendApi(endpoint, payload) {
    const targets = [];

    // 1. If currently on port 3000, relative is fastest
    if (typeof window !== 'undefined' && window.location && window.location.port === '3000') {
        targets.push(endpoint);
    }

    // 2. Primary local server
    targets.push('http://localhost:3000' + endpoint);

    // 3. IPv4 fallback
    targets.push('http://127.0.0.1:3000' + endpoint);

    // 4. Relative fallback
    targets.push(endpoint);

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
    const satCards = document.querySelectorAll('.planets-container .planet-card');

    if (satSearchInput && satCards.length > 0) {
        satSearchInput.addEventListener('input', () => {
            const query = satSearchInput.value.trim().toLowerCase();
            satCards.forEach((card) => {
                const text = card.textContent.toLowerCase();
                card.style.display = (query === '' || text.includes(query)) ? '' : 'none';
            });
        });
    }

    const fetchBtn = document.getElementById('fetch-satcat-btn');
    const statusMsg = document.getElementById('api-status-msg');
    const filterInput = document.getElementById('api-sat-filter');
    const resultsGrid = document.getElementById('satcat-results-grid');

    if (!fetchBtn) return;

    const celeUrl = 'https://celestrak.org/satcat/records.php?GROUP=STATIONS&FORMAT=JSON&ONORBIT=1&MAX=25';
    let loadedRecords = [];

    function renderRecords(records) {
        if (!resultsGrid) return;
        resultsGrid.innerHTML = '';

        if (records.length === 0) {
            resultsGrid.innerHTML = '<p style="color:#888;grid-column:1/-1;text-align:center;padding:20px;">No satellites matched your filter.</p>';
            return;
        }

        records.forEach((sat) => {
            const card = document.createElement('div');
            card.className = 'satcat-card';

            const name = sat.OBJECT_NAME || 'Unknown Satellite';
            const catId = sat.NORAD_CAT_ID || 'N/A';
            const type = sat.OBJECT_TYPE || 'PAYLOAD';
            const owner = sat.OWNER || 'International';
            const launchDate = sat.LAUNCH_DATE || 'Unknown';
            const period = sat.PERIOD ? `${sat.PERIOD} min` : 'N/A';
            const apogee = sat.APOGEE ? `${sat.APOGEE} km` : 'N/A';
            const perigee = sat.PERIGEE ? `${sat.PERIGEE} km` : 'N/A';

            card.innerHTML = `
                <div class="satcat-name">${escapeHtml(name)}</div>
                <div class="satcat-meta">
                    <span><strong>NORAD ID:</strong> ${escapeHtml(String(catId))}</span>
                    <span><strong>Type:</strong> ${escapeHtml(type)}</span>
                    <span><strong>Country/Owner:</strong> ${escapeHtml(owner)}</span>
                    <span><strong>Launch Date:</strong> ${escapeHtml(launchDate)}</span>
                    <span><strong>Orbital Period:</strong> ${escapeHtml(period)}</span>
                    <span><strong>Altitude:</strong> ${escapeHtml(perigee)} x ${escapeHtml(apogee)}</span>
                </div>
            `;
            resultsGrid.appendChild(card);
        });
    }

    fetchBtn.addEventListener('click', () => {
        if (statusMsg) statusMsg.textContent = 'Connecting to CelesTrak API and retrieving satellite catalog...';
        fetchBtn.disabled = true;

        fetch(celeUrl)
            .then((res) => {
                if (!res.ok) throw new Error(`HTTP error ${res.status}`);
                return res.json();
            })
            .then((data) => {
                fetchBtn.disabled = false;
                if (!Array.isArray(data) || data.length === 0) {
                    if (statusMsg) statusMsg.textContent = 'No satellite records returned by CelesTrak.';
                    return;
                }

                loadedRecords = data;
                if (statusMsg) {
                    statusMsg.textContent = `Successfully retrieved ${data.length} registered orbital stations from CelesTrak.`;
                }

                if (filterInput) filterInput.style.display = 'block';
                renderRecords(loadedRecords);
            })
            .catch((err) => {
                console.warn('CelesTrak API request error:', err);
                fetchBtn.disabled = false;
                if (statusMsg) {
                    statusMsg.innerHTML = `
                        Unable to connect to CelesTrak API (${escapeHtml(err.message)}).
                        <br><button id="fetch-noaa-fallback-btn" class="btn calc-btn" style="margin-top:10px;">TEST NOAA SPACE WEATHER API ALTERNATIVE</button>
                    `;
                    const fallbackBtn = document.getElementById('fetch-noaa-fallback-btn');
                    if (fallbackBtn) {
                        fallbackBtn.addEventListener('click', fetchNoaaFallback);
                    }
                }
            });
    });

    if (filterInput) {
        filterInput.addEventListener('input', () => {
            const q = filterInput.value.trim().toLowerCase();
            const filtered = loadedRecords.filter((sat) => {
                const name = (sat.OBJECT_NAME || '').toLowerCase();
                const owner = (sat.OWNER || '').toLowerCase();
                const id = String(sat.NORAD_CAT_ID || '');
                return name.includes(q) || owner.includes(q) || id.includes(q);
            });
            renderRecords(filtered);
        });
    }

    function fetchNoaaFallback() {
        if (statusMsg) statusMsg.textContent = 'Connecting to NOAA Space Weather API...';
        const noaaUrl = 'https://services.swpc.noaa.gov/products/noaa-scales.json';

        fetch(noaaUrl)
            .then((res) => {
                if (!res.ok) throw new Error(`HTTP error ${res.status}`);
                return res.json();
            })
            .then((data) => {
                if (statusMsg) statusMsg.textContent = 'Successfully retrieved NOAA space weather data:';
                if (!resultsGrid) return;
                resultsGrid.innerHTML = '';

                const latestKey = Object.keys(data)[0] || '0';
                const latest = data[latestKey] || {};

                const card = document.createElement('div');
                card.className = 'satcat-card';
                card.innerHTML = `
                    <div class="satcat-name">NOAA Space Weather Status</div>
                    <div class="satcat-meta">
                        <span><strong>Timestamp:</strong> ${latest.DateStamp || ''} ${latest.TimeStamp || ''} UTC</span>
                        <span><strong>Geomagnetic (G-Scale):</strong> Scale ${latest.G?.Scale || '0'} (${latest.G?.Text || 'None'})</span>
                        <span><strong>Solar Radiation (S-Scale):</strong> Scale ${latest.S?.Scale || '0'} (${latest.S?.Text || 'None'})</span>
                        <span><strong>Radio Blackouts (R-Scale):</strong> Scale ${latest.R?.Scale || '0'} (${latest.R?.Text || 'None'})</span>
                    </div>
                `;
                resultsGrid.appendChild(card);
            })
            .catch((err) => {
                if (statusMsg) statusMsg.textContent = `NOAA API request also failed: ${err.message}`;
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

            const orderPayload = {
                customer: { name, email, address, city, zip },
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
                shippingMethod: 'orbital_express',
                paymentMethod: 'simulated_express'
            };

            try {
                const res = await sendToBackendApi('/api/orders', orderPayload);
                const order = (res && res.data) ? res.data : {
                    orderId: 'ORD-2026-' + Math.floor(1000 + Math.random() * 9000),
                    trackingNumber: 'TRK-SOLAR-' + Math.floor(100000 + Math.random() * 900000),
                    status: 'confirmed'
                };

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

                // Cache in localStorage
                try {
                    const existing = JSON.parse(localStorage.getItem(MERCH_ORDERS_STORAGE_KEY) || '[]');
                    existing.unshift({
                        orderId: order.orderId,
                        trackingNumber: order.trackingNumber,
                        customer: { name, email, address, city, zip },
                        items: orderPayload.items,
                        total: orderPayload.total,
                        createdAt: new Date().toISOString()
                    });
                    localStorage.setItem(MERCH_ORDERS_STORAGE_KEY, JSON.stringify(existing.slice(0, 50)));
                } catch (cacheErr) {
                    console.warn('LocalStorage order save failed:', cacheErr);
                }

                // Flip view
                if (drawerFormView) drawerFormView.style.display = 'none';
                if (drawerReceiptView) drawerReceiptView.style.display = 'flex';

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

    if (!latEl || !canvas) return;

    const ctx = canvas.getContext('2d');
    const trail = [];
    let currentPos = null;
    let pulseRadius = 6;
    let pulseGrowing = true;

    async function fetchTelemetry() {
        try {
            const data = await fetchFromBackendApi('/api/satellites/telemetry/iss');
            if (data && data.success) {
                latEl.textContent = `${data.latitude >= 0 ? '+' : ''}${data.latitude.toFixed(4)}°`;
                lonEl.textContent = `${data.longitude >= 0 ? '+' : ''}${data.longitude.toFixed(4)}°`;
                altEl.textContent = `${data.altitudeKm} km`;
                velEl.textContent = `${Number(data.velocityKmh).toLocaleString()} km/h`;
                if (visEl) visEl.textContent = (data.visibility || 'Daylight').toUpperCase();
                if (updatedEl) updatedEl.textContent = `Updated: ${new Date().toLocaleTimeString()}`;
                if (providerEl) providerEl.textContent = `PROVIDER: ${data.provider.toUpperCase()}`;

                currentPos = { lat: data.latitude, lon: data.longitude };
                trail.push({ ...currentPos, time: Date.now() });
                if (trail.length > 30) trail.shift();
            }
        } catch (e) {
            console.warn('Telemetry fetch error:', e);
        }
    }

    // Canvas Projection: Converts lat/lon to canvas (x, y)
    function project(lat, lon, width, height) {
        const x = ((lon + 180) / 360) * width;
        const y = ((90 - lat) / 180) * height;
        return { x, y };
    }

    function drawRadar() {
        const w = canvas.width;
        const h = canvas.height;

        // Dark Cosmic Background
        ctx.fillStyle = '#050505';
        ctx.fillRect(0, 0, w, h);

        // Coordinate Grid
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
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

        // Approximate Continental Coastline Silhouettes (stylized vector polygons)
        ctx.fillStyle = '#0d0d0d';
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
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
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(0, yTop);
        ctx.lineTo(w, yTop);
        ctx.moveTo(0, yBot);
        ctx.lineTo(w, yBot);
        ctx.stroke();
        ctx.setLineDash([]);

        // Theoretical Sinusoidal Orbit Track
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.28)';
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
            ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.45})`;
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

            ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
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
            ctx.strokeStyle = '#22c55e';
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
            ctx.fillStyle = '#f8fafc';
            ctx.font = 'bold 11px "JetBrains Mono", monospace';
            ctx.fillText(`ISS [${currentPos.lat.toFixed(1)}°, ${currentPos.lon.toFixed(1)}°]`, pt.x + 10, pt.y - 10);
        }

        requestAnimationFrame(drawRadar);
    }

    fetchTelemetry();
    drawRadar();
    setInterval(fetchTelemetry, 5000);
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

    if (!computeBtn || !resultsContainer) return;

    presetBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const lat = btn.getAttribute('data-lat');
            const lon = btn.getAttribute('data-lon');
            if (latInput) latInput.value = lat;
            if (lonInput) lonInput.value = lon;
            fetchPasses(lat, lon);
        });
    });

    computeBtn.addEventListener('click', () => {
        const lat = latInput ? latInput.value.trim() : 28.6139;
        const lon = lonInput ? lonInput.value.trim() : 77.2090;
        fetchPasses(lat, lon);
    });

    async function fetchPasses(lat, lon) {
        resultsContainer.innerHTML = '<div class="loading-spinner">Computing orbital pass trajectory...</div>';
        try {
            const data = await fetchFromBackendApi(`/api/satellites/25544/passes?lat=${lat}&lon=${lon}`);
            if (data && data.success && Array.isArray(data.passes)) {
                resultsContainer.innerHTML = data.passes.map(p => `
                    <div class="pass-card">
                        <div class="pass-card-header">
                            <span class="pass-badge">PASS #${p.passNumber}</span>
                            <span class="pass-elevation">${p.maxElevationDeg}° Max Elevation</span>
                        </div>
                        <div class="pass-time-row">
                            <span class="lbl">AOS (Rise Time):</span>
                            <span class="val">${new Date(p.riseTimeUtc).toLocaleTimeString()} UTC</span>
                        </div>
                        <div class="pass-time-row">
                            <span class="lbl">TCA (Max Elevation):</span>
                            <span class="val">${new Date(p.maxElevationTimeUtc).toLocaleTimeString()} UTC</span>
                        </div>
                        <div class="pass-time-row">
                            <span class="lbl">Duration:</span>
                            <span class="val">${Math.floor(p.durationSeconds / 60)}m ${p.durationSeconds % 60}s</span>
                        </div>
                        <div class="pass-time-row">
                            <span class="lbl">Trajectory:</span>
                            <span class="val text-cyan">${p.approachDirection}</span>
                        </div>
                        <div class="pass-status-tag ${p.maxElevationDeg > 60 ? 'pass-opt' : 'pass-day'}">
                            ${escapeHtml(p.visibilityStatus)}
                        </div>
                    </div>
                `).join('');
            } else {
                resultsContainer.innerHTML = '<div class="error-msg">Unable to predict orbital passes at this time.</div>';
            }
        } catch (err) {
            resultsContainer.innerHTML = '<div class="error-msg">Network error contacting ground station API.</div>';
        }
    }

    // Initial load
    fetchPasses(28.6139, 77.2090);
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
            const isHidden = formBox.style.display === 'none';
            formBox.style.display = isHidden ? 'block' : 'none';
            toggleBtn.textContent = isHidden ? 'CLOSE FORM' : '+ ADD TO WATCHLIST';
        });
    }

    if (cancelBtn && formBox) {
        cancelBtn.addEventListener('click', () => {
            formBox.style.display = 'none';
            if (toggleBtn) toggleBtn.textContent = '+ ADD TO WATCHLIST';
        });
    }

    async function loadWatchlist() {
        display.innerHTML = '<div class="loading-spinner">Loading satellite watchlist from database...</div>';
        try {
            const res = await fetchFromBackendApi('/api/satellites/watchlist');
            if (res && res.success && Array.isArray(res.data)) {
                if (res.data.length === 0) {
                    display.innerHTML = '<p class="empty-state">No satellites in your watchlist. Click "+ ADD TO WATCHLIST" above to track one.</p>';
                    return;
                }
                display.innerHTML = res.data.map(sat => `
                    <div class="sat-watchlist-card" data-norad="${sat.noradId}">
                        <div class="wl-card-top">
                            <span class="norad-pill">NORAD ${sat.noradId}</span>
                            <span class="orbit-badge">${escapeHtml(sat.orbitType || 'LEO')}</span>
                        </div>
                        <h3 class="sat-name">${escapeHtml(sat.name)}</h3>
                        <div class="sat-cat">${escapeHtml(sat.category || 'Observatory')}</div>
                        <p class="sat-notes">${escapeHtml(sat.notes || 'Tracked by Ground Station')}</p>
                        <div class="wl-card-footer">
                            <span class="spotted-date">Logged: ${new Date(sat.spottedAt || Date.now()).toLocaleDateString()}</span>
                            <button type="button" class="btn btn-sm btn-delete-sat" data-id="${sat.noradId}">REMOVE</button>
                        </div>
                    </div>
                `).join('');

                // Attach delete handlers
                display.querySelectorAll('.btn-delete-sat').forEach(btn => {
                    btn.addEventListener('click', async () => {
                        const id = btn.getAttribute('data-id');
                        btn.textContent = 'Removing...';
                        btn.disabled = true;
                        await deleteFromBackendApi(`/api/satellites/watchlist/${id}`);
                        loadWatchlist();
                    });
                });
            } else {
                display.innerHTML = '<p class="error-msg">Failed to load watchlist from server.</p>';
            }
        } catch {
            display.innerHTML = '<p class="error-msg">Connection error querying satellite database.</p>';
        }
    }

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const norad = document.getElementById('sat-norad').value;
            const name = document.getElementById('sat-name').value;
            const category = document.getElementById('sat-category').value;
            const orbitType = document.getElementById('sat-orbit').value;
            const notes = document.getElementById('sat-notes').value;

            const submitBtn = form.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = 'SAVING...';
            }

            await sendToBackendApi('/api/satellites/watchlist', {
                noradId: norad,
                name: name,
                category: category,
                orbitType: orbitType,
                notes: notes
            });

            form.reset();
            if (formBox) formBox.style.display = 'none';
            if (toggleBtn) toggleBtn.textContent = '+ ADD TO WATCHLIST';
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = 'SAVE TO DATABASE';
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
                if (flareEl) flareEl.textContent = data.xrayFlareStatus || 'Class C1.4';
                if (radioEl) radioEl.textContent = data.radioBlackoutScale || 'None (R0)';
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
    const dbEl = document.getElementById('ticker-db');

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

        fetchFromBackendApi('/api/telemetry').then(res => {
            if (res && res.success && dbEl) {
                dbEl.textContent = `${res.database.mode.toUpperCase()} Active (${res.metrics.totalFeedbacks} reviews, ${res.metrics.totalMerchOrders} orders)`;
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
