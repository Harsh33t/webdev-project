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
 * Solar Explorer - Interactive JavaScript Logic (Second Evaluation)
 * Contains planet search, age/weight calculators, timeline search,
 * random facts, CelesTrak API catalogue retrieval, feedback export,
 * and merchandise waitlist VIP drop system.
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

        // Download JSON file
        try {
            const jsonString = JSON.stringify(feedbackList, null, 2);
            const blob = new Blob([jsonString], { type: 'application/json' });
            const downloadUrl = URL.createObjectURL(blob);

            const tempLink = document.createElement('a');
            tempLink.href = downloadUrl;
            tempLink.download = 'solar-explorer-feedback.json';
            document.body.appendChild(tempLink);
            tempLink.click();
            document.body.removeChild(tempLink);

            setTimeout(() => {
                URL.revokeObjectURL(downloadUrl);
            }, 1000);

            if (formStatus) {
                formStatus.textContent = `Thank you, ${nameVal}! Your feedback (ID: ${recordId}) has been saved in JSON format and downloaded.`;
                formStatus.className = 'form-status success';
                formStatus.style.display = 'block';
            }

            form.reset();
        } catch (downloadErr) {
            if (formStatus) {
                formStatus.textContent = `Thank you, ${nameVal}! Your feedback (ID: ${recordId}) has been saved in JSON format.`;
                formStatus.className = 'form-status success';
                formStatus.style.display = 'block';
            }
        }
    });
}

/* ========================================================
   Feature K — Space Merchandise Countdown & Waitlist (merchandise.html)
   ======================================================== */
const MERCH_WAITLIST_STORAGE_KEY = 'solarExplorerMerchandiseWaitlist';

function initMerchandisePage() {
    const merchForm = document.getElementById('merch-waitlist-form');
    const daysEl = document.getElementById('cd-days');

    if (!merchForm && !daysEl) return;

    /* 1. Launch Countdown Timer: 19 Days */
    const hoursEl = document.getElementById('cd-hours');
    const minutesEl = document.getElementById('cd-minutes');
    const secondsEl = document.getElementById('cd-seconds');

    if (daysEl && hoursEl && minutesEl && secondsEl) {
        let remainingSeconds = 19 * 86400 + 8 * 3600 + 45 * 60 + 12;

        function updateCountdown() {
            if (remainingSeconds > 0) remainingSeconds--;
            const d = Math.floor(remainingSeconds / 86400);
            const h = Math.floor((remainingSeconds % 86400) / 3600);
            const m = Math.floor((remainingSeconds % 3600) / 60);
            const s = remainingSeconds % 60;

            daysEl.textContent = String(d).padStart(2, '0');
            hoursEl.textContent = String(h).padStart(2, '0');
            minutesEl.textContent = String(m).padStart(2, '0');
            secondsEl.textContent = String(s).padStart(2, '0');
        }

        updateCountdown();
        setInterval(updateCountdown, 1000);
    }


    /* 3. Card Pre-Register Quick Button */
    const interestButtons = document.querySelectorAll('.btn-preorder, .btn-interest');
    const productSelect = document.getElementById('wl-product');
    const waitlistSection = document.getElementById('waitlist-section');

    if (interestButtons.length > 0 && productSelect) {
        interestButtons.forEach((btn) => {
            btn.addEventListener('click', () => {
                const itemTitle = btn.getAttribute('data-item');

                for (let i = 0; i < productSelect.options.length; i++) {
                    if (productSelect.options[i].text.includes(itemTitle)) {
                        productSelect.selectedIndex = i;
                        break;
                    }
                }

                if (waitlistSection) {
                    waitlistSection.scrollIntoView({ behavior: 'smooth' });
                }

                const nameInput = document.getElementById('wl-name');
                if (nameInput) nameInput.focus();
            });
        });
    }

    /* 4. Waitlist Form Submission & JSON Storage */
    if (merchForm) {
        const nameInput = document.getElementById('wl-name');
        const emailInput = document.getElementById('wl-email');
        const itemSelect = document.getElementById('wl-product');
        const sizeSelect = document.getElementById('wl-size');
        const qtyInput = document.getElementById('wl-qty');
        const wishlistInput = document.getElementById('wl-wishlist');
        const notifyCheck = document.getElementById('wl-notify');
        const statusBox = document.getElementById('wl-status');
        const passTarget = document.getElementById('boarding-pass-target');

        const errName = document.getElementById('err-wl-name');
        const errEmail = document.getElementById('err-wl-email');
        const errProduct = document.getElementById('err-wl-product');
        const errQty = document.getElementById('err-wl-qty');
        const errNotify = document.getElementById('err-wl-notify');

        function clearWlErrors() {
            if (errName) errName.textContent = '';
            if (errEmail) errEmail.textContent = '';
            if (errProduct) errProduct.textContent = '';
            if (errQty) errQty.textContent = '';
            if (errNotify) errNotify.textContent = '';
            if (statusBox) {
                statusBox.className = 'form-status';
                statusBox.style.display = 'none';
                statusBox.textContent = '';
            }
        }

        merchForm.addEventListener('reset', () => {
            clearWlErrors();
            if (passTarget) passTarget.style.display = 'none';
        });

        merchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            clearWlErrors();

            let isValid = true;
            const nameVal = nameInput ? nameInput.value.trim() : '';
            const emailVal = emailInput ? emailInput.value.trim() : '';
            const productVal = itemSelect ? itemSelect.value : '';
            const sizeVal = sizeSelect ? sizeSelect.value : 'N/A';
            const qtyVal = qtyInput ? parseInt(qtyInput.value, 10) : 1;
            const wishlistVal = wishlistInput ? wishlistInput.value.trim() : '';
            const notifyVal = notifyCheck ? notifyCheck.checked : false;

            if (!nameVal) {
                if (errName) errName.textContent = 'Please enter your full name.';
                isValid = false;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailVal) {
                if (errEmail) errEmail.textContent = 'Please enter your email.';
                isValid = false;
            } else if (!emailRegex.test(emailVal)) {
                if (errEmail) errEmail.textContent = 'Please enter a valid email format.';
                isValid = false;
            }

            if (!productVal) {
                if (errProduct) errProduct.textContent = 'Please select a merchandise item of interest.';
                isValid = false;
            }

            if (isNaN(qtyVal) || qtyVal < 1 || qtyVal > 10) {
                if (errQty) errQty.textContent = 'Please enter a quantity between 1 and 10.';
                isValid = false;
            }

            if (!notifyVal) {
                if (errNotify) errNotify.textContent = 'Please confirm early launch notification consent.';
                isValid = false;
            }

            if (!isValid) {
                if (statusBox) {
                    statusBox.textContent = 'Please fix the highlighted errors before submitting.';
                    statusBox.className = 'form-status error';
                    statusBox.style.display = 'block';
                }
                return;
            }

            const recordId = 'MERCH-' + Date.now();
            const vipPassCode = 'VIP-ORBIT-' + Math.floor(1000 + Math.random() * 9000);

            const waitlistRecord = {
                id: recordId,
                vipPassId: vipPassCode,
                name: nameVal,
                email: emailVal,
                product: productVal,
                size: sizeVal,
                quantity: qtyVal,
                suggestions: wishlistVal || 'None provided',
                discount: '20% VIP DISCOUNT',
                registeredAt: new Date().toISOString()
            };

            // Save to localStorage in JSON format
            let waitlist = [];
            try {
                const raw = localStorage.getItem(MERCH_WAITLIST_STORAGE_KEY);
                if (raw) {
                    const parsed = JSON.parse(raw);
                    if (Array.isArray(parsed)) waitlist = parsed;
                }
                waitlist.push(waitlistRecord);
                localStorage.setItem(MERCH_WAITLIST_STORAGE_KEY, JSON.stringify(waitlist));
            } catch (err) {
                console.warn('Waitlist localStorage failed:', err);
                waitlist = [waitlistRecord];
            }

            // IDE DevTools Console Inspection Log
            console.log('[Solar Explorer Merchandise] Waitlist saved to localStorage["' + MERCH_WAITLIST_STORAGE_KEY + '"] in JSON format:', waitlistRecord);
            console.log('[Solar Explorer Merchandise] Total waitlist reservations:', waitlist);

            // Direct Server API Persistence (writes directly into data/merchandise.json in IDE workspace)
            sendToBackendApi('/api/merchandise', waitlistRecord).then(result => {
                if (statusBox) {
                    if (result.success) {
                        statusBox.textContent = `Success! VIP Pre-order confirmed (ID: ${recordId}) & saved directly into data/merchandise.json in the IDE!`;
                    } else {
                        statusBox.textContent = `Success! VIP Pre-order confirmed (ID: ${recordId}) & saved to localStorage (run 'node server.js' to write directly to data/merchandise.json in IDE).`;
                    }
                    statusBox.className = 'form-status success';
                    statusBox.style.display = 'block';
                }
            });

            // Render Digital VIP Boarding Pass
            if (passTarget) {
                passTarget.innerHTML = `
                    <div class="boarding-pass-card">
                        <div class="bp-header">
                            <div>
                                <div class="bp-logo-title">SOLAR EXPLORER VIP LAUNCH PASS</div>
                                <span style="font-size:0.75rem;color:#94a3b8;letter-spacing:1px;">OFFICIAL MERCHANDISE DROP 01 &bull; Q4 2026</span>
                            </div>
                            <div class="bp-pass-id">${escapeHtml(vipPassCode)}</div>
                        </div>
                        <div class="bp-grid">
                            <div>
                                <span class="bp-item-label">Explorer / Name</span>
                                <div class="bp-item-val">${escapeHtml(nameVal)}</div>
                            </div>
                            <div>
                                <span class="bp-item-label">Reserved Item</span>
                                <div class="bp-item-val">${escapeHtml(productVal)}</div>
                            </div>
                            <div>
                                <span class="bp-item-label">Size &bull; Quantity</span>
                                <div class="bp-item-val">${escapeHtml(sizeVal)} &bull; ${escapeHtml(String(qtyVal))} Unit(s)</div>
                            </div>
                            <div>
                                <span class="bp-item-label">Record Storage ID</span>
                                <div class="bp-item-val" style="font-family:'Consolas',monospace;font-size:0.85rem;color:#38bdf8;">${escapeHtml(recordId)}</div>
                            </div>
                        </div>
                        <div class="bp-footer">
                            <span class="bp-discount-badge">✓ 20% EARLY BIRD DISCOUNT CODE LOCKED</span>
                            <span>Direct IDE File: <code>data/merchandise.json</code></span>
                        </div>
                    </div>
                `;
                passTarget.style.display = 'block';
                passTarget.scrollIntoView({ behavior: 'smooth' });
            }

            // Download JSON file for IDE inspection
            try {
                const jsonString = JSON.stringify(waitlist, null, 2);
                const blob = new Blob([jsonString], { type: 'application/json' });
                const downloadUrl = URL.createObjectURL(blob);
                const tempLink = document.createElement('a');
                tempLink.href = downloadUrl;
                tempLink.download = 'solar-explorer-merchandise.json';
                document.body.appendChild(tempLink);
                tempLink.click();
                document.body.removeChild(tempLink);
                setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000);
            } catch (dlErr) {
                console.warn('JSON file auto-download bypassed:', dlErr);
            }

            if (statusBox) {
                statusBox.textContent = `Success! Your VIP Pre-order has been reserved (ID: ${recordId}), saved in JSON format, and downloaded.`;
                statusBox.className = 'form-status success';
                statusBox.style.display = 'block';
            }

            merchForm.reset();
        });
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
